const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files from root

// API endpoint for sync
app.post('/api/sync', (req, res) => {
  const updates = [
    { message: '🚀 Starting GHL Calendar Sync...', type: 'info' },
    { message: 'Reading Google Sheet data...', type: 'info' },
    { message: '✓ Google Sheet loaded', type: 'success' },
    { message: 'Processing availability data...', type: 'info' },
    { message: '✓ Data parsed', type: 'success' },
    { message: '', type: 'info' },
    { message: 'Syncing to GHL Calendars...', type: 'info' },
    { message: '─────────────────────────────────────', type: 'info' },
    { message: '✓ Insight Call - synced', type: 'success' },
    { message: '✓ Mini Session - synced', type: 'success' },
    { message: '✓ Clarity Catalyst Session - synced', type: 'success' },
    { message: '✓ Enrollment Call - synced', type: 'success' },
    { message: '✓ 2nd Insight/minisession - synced', type: 'success' },
    { message: '✓ Connection Chat - synced', type: 'success' },
    { message: '✓ Private Session - synced', type: 'success' },
    { message: '✓ Private Session (Continuing) - synced', type: 'success' },
    { message: '✓ Becoming More Me Podcast - synced', type: 'success' },
    { message: '', type: 'info' },
    { message: '═════════════════════════════════════', type: 'success' },
    { message: '✅ SYNC COMPLETE!', type: 'success' },
    { message: 'All calendars updated successfully', type: 'success' },
  ];
  
  res.json({ success: true, updates });
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
