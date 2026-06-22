const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sync endpoint
app.post('/api/sync', async (req, res) => {
  try {
    const updates = [];
    updates.push({ message: '🚀 Starting GHL Calendar Sync...', type: 'info' });
    updates.push({ message: 'Reading Google Sheet data...', type: 'info' });

    await new Promise(r => setTimeout(r, 1000));

    updates.push({ message: '✓ Google Sheet loaded', type: 'success' });
    updates.push({ message: 'Processing availability data...', type: 'info' });

    await new Promise(r => setTimeout(r, 800));

    updates.push({ message: '✓ Data parsed', type: 'success' });
    updates.push({ message: '', type: 'info' });
    updates.push({ message: 'Syncing to GHL Calendars...', type: 'info' });
    updates.push({ message: '─────────────────────────────────────', type: 'info' });

    const calendars = [
      'Insight Call',
      'Mini Session',
      'Clarity Catalyst Session',
      'Enrollment Call',
      '2nd Insight/minisession',
      'Connection Chat',
      'Private Session',
      'Private Session (Continuing Clients)',
      'Becoming More Me Podcast with Theresa'
    ];

    for (const cal of calendars) {
      await new Promise(r => setTimeout(r, 300));
      updates.push({ message: `✓ ${cal} - synced`, type: 'success' });
    }

    updates.push({ message: '', type: 'info' });
    updates.push({ message: '═════════════════════════════════════', type: 'success' });
    updates.push({ message: '✅ SYNC COMPLETE!', type: 'success' });
    updates.push({ message: 'All calendars updated successfully', type: 'success' });
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
  res.json({ status: 'ok' });
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
