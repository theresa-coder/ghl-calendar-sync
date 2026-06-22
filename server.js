const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Calendar Configuration
const CALENDAR_CONFIG = {
  grouped: [
    { name: 'Insight Call', ghlId: process.env.INSIGHT_CALL_ID },
    { name: 'Mini Session', ghlId: process.env.MINI_SESSION_ID },
    { name: 'Clarity Catalyst Session', ghlId: process.env.CLARITY_CATALYST_ID },
    { name: 'Enrollment Call', ghlId: process.env.ENROLLMENT_CALL_ID },
    { name: '2nd Insight/minisession', ghlId: process.env.SECOND_INSIGHT_ID },
    { name: 'Connection Chat', ghlId: process.env.CONNECTION_CHAT_ID }
  ],
  individual: [
    { name: 'Private Session', ghlId: process.env.PRIVATE_SESSION_ID, type: 'PRIVATE_SESSIONS' },
    { name: 'Private Session (Continuing Clients)', ghlId: process.env.PRIVATE_SESSION_CONTINUING_ID, type: 'PRIVATE_SESSIONS' },
    { name: 'Becoming More Me Podcast with Theresa', ghlId: process.env.PODCAST_ID, type: 'PODCAST' }
  ]
};

// Parse time string to minutes
function timeToMinutes(timeStr) {
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const meridiem = match[3]?.toLowerCase() || 'am';

  if (meridiem === 'pm' && hours !== 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Parse time slots from string
function parseTimeSlots(timeString) {
  if (!timeString || timeString.toLowerCase() === 'none' || timeString.toLowerCase() === 'away') {
    return [];
  }

  const slots = [];
  const ranges = timeString.split(',').map(r => r.trim());

  ranges.forEach(range => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(t => t.trim());
      const startMin = timeToMinutes(start);
      const endMin = timeToMinutes(end);

      if (startMin !== null && endMin !== null) {
        let current = startMin;
        while (current <= endMin) {
          const hours = Math.floor(current / 60);
          const mins = current % 60;
          const meridiem = hours >= 12 ? 'pm' : 'am';
          const displayHours = hours % 12 || 12;
          const displayMins = mins ? `:${mins.toString().padStart(2, '0')}` : '';
          slots.push(`${displayHours}${displayMins}${meridiem}`);
          current += 60;
        }
      }
    } else {
      slots.push(range);
    }
  });

  return [...new Set(slots)];
}

// Parse date string
function parseDateString(dateStr) {
  if (!dateStr) return [];

  const dates = [];
  
  // Handle "Mar 3-5" format
  if (dateStr.includes('-') && !dateStr.includes(':')) {
    const match = dateStr.match(/([A-Za-z]+)\s+(\d+)-(\d+)/);
    if (match) {
      const monthStr = match[1];
      const startDay = parseInt(match[2]);
      const endDay = parseInt(match[3]);
      
      const monthDate = new Date(`${monthStr} 1, 2026`);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      for (let day = startDay; day <= endDay; day++) {
        dates.push(new Date(year, month, day));
      }
      return dates;
    }
  }

  // Handle single date
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    dates.push(parsed);
  }

  return dates;
}

// Read Google Sheet
async function readGoogleSheet() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}?key=${GOOGLE_API_KEY}&includeGridData=true`;
    const response = await axios.get(url);
    
    const sheet = response.data.sheets[0];
    const rows = sheet.data[0].rowData;
    
    const data = [];
    const headers = [];

    // Extract headers
    if (rows[0]) {
      rows[0].values.forEach(cell => {
        headers.push(cell.userEnteredValue?.stringValue || '');
      });
    }

    // Extract data rows
    for (let i = 1; i < rows.length; i++) {
      const row = {};
      rows[i]?.values?.forEach((cell, idx) => {
        const value = cell.userEnteredValue?.stringValue || 
                     cell.userEnteredValue?.boolValue || '';
        row[headers[idx]] = value;
      });
      
      if (row['DATE'] && row['TIMES']) {
        data.push(row);
      }
    }

    return { data, headers };
  } catch (error) {
    console.error('Error reading Google Sheet:', error.message);
    throw error;
  }
}

// Add availability to GHL calendar
async function addToGHLCalendar(calendarGhlId, dates, timeSlots) {
  try {
    const payload = {
      dates: dates.map(d => d.toISOString().split('T')[0]),
      timeSlots: timeSlots.map(slot => ({
        startTime: slot,
        duration: 60 // 1 hour slots
      }))
    };

    const response = await axios.post(
      `https://api.gohighlevel.com/v1/calendars/${calendarGhlId}/availability`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
          'Location-Id': GHL_LOCATION_ID
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error adding to GHL calendar ${calendarGhlId}:`, error.message);
    throw error;
  }
}

// Update Google Sheet status
async function updateSheetStatus(rowIndex, status = 'COMPLETED') {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/'Sheet1'!L${rowIndex + 1}?key=${GOOGLE_API_KEY}`;
    
    await axios.put(
      url,
      { values: [[status]] },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error updating sheet:', error.message);
  }
}

// Main sync endpoint
app.post('/api/sync', async (req, res) => {
  try {
    const updates = [];

    updates.push({ timestamp: new Date().toISOString(), message: 'Starting sync...', type: 'info' });

    // Read Google Sheet
    updates.push({ message: 'Reading Google Sheet...', type: 'info' });
    const { data, headers } = await readGoogleSheet();
    updates.push({ message: `✓ Loaded ${data.length} rows`, type: 'success' });

    let successCount = 0;
    let errorCount = 0;

    // Process grouped calendars
    updates.push({ message: '', type: 'info' });
    updates.push({ message: 'Syncing grouped calendars...', type: 'info' });

    for (const calendar of CALENDAR_CONFIG.grouped) {
      try {
        let totalDates = [];
        let totalSlots = [];

        // Collect all dates and slots for this calendar
        data.forEach(row => {
          const calendarColumn = headers.find(h => h.includes(calendar.name.split('/')[0]?.toUpperCase() || calendar.name.toUpperCase()));
          
          if (row[calendarColumn] === 'TRUE' || row[calendarColumn] === true) {
            const dates = parseDateString(row['DATE']);
            const slots = parseTimeSlots(row['TIMES']);
            totalDates = [...new Set([...totalDates, ...dates.map(d => d.toISOString().split('T')[0])])];
            totalSlots = [...new Set([...totalSlots, ...slots])];
          }
        });

        if (totalDates.length > 0 && totalSlots.length > 0 && calendar.ghlId) {
          await addToGHLCalendar(calendar.ghlId, 
            totalDates.map(d => new Date(d)), 
            totalSlots);
          updates.push({ message: `✓ ${calendar.name} - ${totalDates.length} dates, ${totalSlots.length} slots added`, type: 'success' });
          successCount++;
        }
      } catch (error) {
        updates.push({ message: `✗ ${calendar.name} - ${error.message}`, type: 'error' });
        errorCount++;
      }
    }

    // Process individual calendars
    updates.push({ message: '', type: 'info' });
    updates.push({ message: 'Syncing individual calendars...', type: 'info' });

    for (const calendar of CALENDAR_CONFIG.individual) {
      try {
        let totalDates = [];
        let totalSlots = [];

        data.forEach(row => {
          const calendarColumn = headers.find(h => h.includes(calendar.type));
          
          if (row[calendarColumn] === 'TRUE' || row[calendarColumn] === true) {
            const dates = parseDateString(row['DATE']);
            const slots = parseTimeSlots(row['TIMES']);
            totalDates = [...new Set([...totalDates, ...dates.map(d => d.toISOString().split('T')[0])])];
            totalSlots = [...new Set([...totalSlots, ...slots])];
          }
        });

        if (totalDates.length > 0 && totalSlots.length > 0 && calendar.ghlId) {
          await addToGHLCalendar(calendar.ghlId, 
            totalDates.map(d => new Date(d)), 
            totalSlots);
          updates.push({ message: `✓ ${calendar.name} - ${totalDates.length} dates, ${totalSlots.length} slots added`, type: 'success' });
          successCount++;
        }
      } catch (error) {
        updates.push({ message: `✗ ${calendar.name} - ${error.message}`, type: 'error' });
        errorCount++;
      }
    }

    updates.push({ message: '', type: 'info' });
    updates.push({ message: '═════════════════════════════════════', type: 'success' });
    updates.push({ message: `✅ SYNC COMPLETE! (${successCount} successful, ${errorCount} errors)`, type: 'success' });
    updates.push({ message: '═════════════════════════════════════', type: 'success' });

    res.json({ success: true, updates });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      updates: [{ message: `❌ Sync failed: ${error.message}`, type: 'error' }]
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GHL Calendar Sync server running on port ${PORT}`);
});

module.exports = app;
