# GHL Calendar Availability Sync Tool

Automated calendar availability synchronization from Google Sheets to GoHighLevel (GHL). Deploy to Vercel for free - one-click monthly syncing.

---

## ⚡ Quick Start

### What You Have:
- **Full automation** - reads Google Sheet, syncs to all 13 GHL calendars
- **Cloud hosted** - runs on Vercel (free tier, no credit card needed)
- **13 calendars supported** - 6 grouped + 3 individual mappings
- **One-click operation** - click "Start Sync" each month, done in 30 seconds

---

## 🚀 Setup Instructions (5-10 minutes)

### Step 1: Get Your GHL Calendar IDs

You need to find the calendar ID for each of your 9 GHL calendars. Here's how:

1. Go to GHL calendar settings for each calendar
2. Look for the calendar ID (usually in the URL or calendar details)
3. Write down these 9 IDs:
   - Insight Call
   - Mini Session
   - Clarity Catalyst Session
   - Enrollment Call
   - 2nd Insight/minisession
   - Connection Chat
   - Private Session
   - Private Session (Continuing Clients)
   - Becoming More Me Podcast with Theresa

**If you can't find the calendar IDs**, I can help you locate them. Just let me know.

---

### Step 2: Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing one)
3. Enable "Google Sheets API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and save it somewhere safe

---

### Step 3: Deploy to Vercel

#### Option A: Using Git (Recommended)

1. **Create a GitHub repository:**
   - Go to [github.com/new](https://github.com/new)
   - Name it `ghl-calendar-sync`
   - Create repository
   - Clone it locally

2. **Add your files to the repo:**
   ```bash
   # Copy these files to your GitHub repo:
   - server.js
   - package.json
   - vercel.json
   - App.jsx
   - .env.example
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select `server.js` as the entry point
   - Click "Deploy"

#### Option B: Direct Upload to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Choose "Create with template"
4. Select "Node.js"
5. Upload your files
6. Set environment variables (see next step)
7. Deploy

---

### Step 4: Set Environment Variables in Vercel

After creating your Vercel project:

1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables (copy from `.env.example`):

| Variable | Value |
|----------|-------|
| `GOOGLE_SHEET_ID` | `1imMPHQJ99jCvA4uVV5F6KHpH6t4U2q_Kn3-fwvbHrtQ` |
| `GOOGLE_API_KEY` | Your API key from Step 2 |
| `GHL_API_KEY` | Your existing GHL API key |
| `GHL_LOCATION_ID` | `Qx20uEC12fz0F5Jfkaty` |
| `INSIGHT_CALL_ID` | Your calendar ID |
| `MINI_SESSION_ID` | Your calendar ID |
| `CLARITY_CATALYST_ID` | Your calendar ID |
| `ENROLLMENT_CALL_ID` | Your calendar ID |
| `SECOND_INSIGHT_ID` | Your calendar ID |
| `CONNECTION_CHAT_ID` | Your calendar ID |
| `PRIVATE_SESSION_ID` | Your calendar ID |
| `PRIVATE_SESSION_CONTINUING_ID` | Your calendar ID |
| `PODCAST_ID` | Your calendar ID |

---

### Step 5: Test Your Deployment

1. After deployment, you'll get a Vercel URL (like `https://ghl-calendar-sync.vercel.app`)
2. Open it in your browser
3. Click "Start Sync" button
4. Watch the status updates

If it works, you're all set!

---

## 📋 Monthly Usage

**Every month when you update your spreadsheet:**

1. Open the Vercel URL (bookmark it!)
2. Make sure your Google Sheet is updated with the month's availability
3. Click "Start Sync"
4. Watch it populate all 13 calendars automatically
5. Done! Takes about 30 seconds.

---

## 🔒 Security Notes

### API Keys
- Your GHL API key is stored securely in Vercel environment variables
- Never share or commit your `.env` file to GitHub
- I recommend regenerating your GHL API key after setup for extra security

### Data Privacy
- This tool only reads from your Google Sheet and writes to GHL
- It doesn't store any data permanently
- All processing happens on Vercel's secure servers

### After Setup
Once deployed, **regenerate your GHL API key**:
1. Go to GHL account settings
2. Generate a new API key
3. Update it in Vercel environment variables
4. The old key (shown to me during setup) will no longer work

---

## 🐛 Troubleshooting

### "API Key Invalid" Error
- Check that your GHL_API_KEY is correct in environment variables
- Make sure it hasn't expired in GHL settings

### "Google Sheet Not Found"
- Verify the GOOGLE_SHEET_ID matches your actual sheet
- Check that the Google API key has Sheets API enabled
- Ensure the sheet is shared (can be public or just to the API key email)

### "Calendar ID Not Found"
- Double-check each calendar ID from GHL settings
- Make sure you're using the correct calendar ID, not the calendar name

### Partial Sync (Some Calendars Missing)
- Check that all calendar IDs are filled in (no blanks)
- Verify your Google Sheet has the correct TRUE/FALSE flags per calendar

---

## 📊 What Gets Synced

**Your Google Sheet columns automatically map to:**

| Sheet Column | GHL Calendars |
|-------------|---------------|
| CALENDAR/INSIGHT CALL | Insight Call |
| CALENDAR/MINI SESSION | Mini Session |
| CALENDAR/CLARITY CATALYST | Clarity Catalyst Session |
| CALENDAR/ENROLLMENT CALL | Enrollment Call |
| CALENDAR/2ND INSIGHT CALL | 2nd Insight/minisession |
| CALENDAR/CONNECTION CHAT | Connection Chat |
| CALENDAR/PRIVATE SESSIONS | Private Session + Continuing Clients |
| CALENDAR/PODCAST | Becoming More Me Podcast with Theresa |

When a row has `TRUE` for a calendar column, those dates/times are added to that calendar.

---

## 💡 Tips

1. **Bookmark the Vercel URL** - save it in your browser for quick access each month
2. **Test first** - add a few dates to your sheet and do a test sync before relying on it
3. **Check GHL** - verify the calendars updated correctly after first sync
4. **Update credentials** - regenerate API keys every 6-12 months for security

---

## 🆘 Need Help?

If you encounter issues:

1. Check the status messages on the sync page (they're pretty detailed)
2. Verify all environment variables are set correctly
3. Make sure your Google Sheet is properly formatted
4. Confirm calendar IDs are correct

---

## 🔄 Future Updates

Want to add more calendars later? Just:
1. Add the calendar to your GHL account
2. Find its ID
3. Add it to the server.js CALENDAR_CONFIG
4. Add the environment variable to Vercel
5. Redeploy (Vercel does this automatically from GitHub)

---

**Deployed successfully? You're done! 🎉**

From now on, just update your Google Sheet each month and click the sync button.

