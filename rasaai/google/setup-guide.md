# RASAAI - Google Cloud & Sheets Setup Guide

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "New Project" → Name: `RASAAI`
3. Note your Project ID

## Step 2: Enable Required APIs

Go to APIs & Services → Library, enable:
- Google Sheets API
- Google Drive API
- Google Identity Services

## Step 3: Create OAuth 2.0 Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth Client ID
3. Application Type: Web Application
4. Name: `RASAAI Web App`
5. Authorized JavaScript Origins:
   - `https://rizvi.store`
   - `http://localhost:5500`
6. Authorized Redirect URIs:
   - `https://rizvi.store/rasaai/`
7. Copy the **Client ID**

## Step 4: Create API Key

1. Credentials → Create Credentials → API Key
2. Restrict to Google Sheets API
3. Copy the **API Key**

## Step 5: Create Google Sheet

1. Go to https://sheets.google.com/
2. Create new spreadsheet: `RASAAI_DATABASE`
3. Create these tabs:
   - Users, Campaigns, Invoices, Payments
   - Leads, Tasks, Referrals, Commissions, Withdrawals
   - AudioAds, AudioLogs, ScanLogs
   - Attendance, Inventory, Settings, AuditLogs
   - PriceHistory, Notifications, BackupHistory
4. Copy the Spreadsheet ID from URL:
   `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## Step 6: Deploy Apps Script

1. Go to https://script.google.com/
2. New Project → Name: `RASAAI Backend`
3. Paste `apps-script.gs` code
4. Create new file `triggers.gs` → paste code
5. Replace `YOUR_SPREADSHEET_ID` with your actual ID
6. Deploy → New Deployment → Web App
   - Execute as: Me
   - Access: Anyone
7. Copy the **Deployment URL**

## Step 7: Update config.js

Edit `/js/core/config.js`:
```javascript
clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
spreadsheetId: 'YOUR_SPREADSHEET_ID',
apiKey: 'YOUR_API_KEY',
appsScriptUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
