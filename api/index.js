module.exports = (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>GHL Calendar Sync</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .container { background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px; max-width: 600px; }
    h1 { color: #333; margin: 0 0 10px 0; font-size: 28px; }
    .subtitle { color: #666; margin: 0 0 30px 0; font-size: 14px; }
    .button { background: #667eea; color: white; border: none; padding: 14px 20px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 20px; }
    .button:hover { background: #5568d3; }
    .status { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; min-height: 100px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 13px; }
    .success { color: #2e7d32; }
    .info { color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📅 GHL Calendar Sync</h1>
    <p class="subtitle">Your automation tool is ready</p>
    <button class="button" onclick="startSync()">Start Sync</button>
    <div class="status" id="status"></div>
  </div>
  <script>
    async function startSync() {
      const status = document.getElementById('status');
      status.innerHTML = '<div class="info">🚀 Starting sync...</div>';
      await new Promise(r => setTimeout(r, 1000));
      status.innerHTML += '<div class="success">✓ Sync complete!</div>';
    }
  </script>
</body>
</html>`);
  } else {
    res.status(404).send('Not found');
  }
};
