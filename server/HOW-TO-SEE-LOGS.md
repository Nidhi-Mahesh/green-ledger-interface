# 🔍 HOW TO SEE THE BACKEND LOGS

## The Problem
You have the backend server ALREADY RUNNING in a different terminal window. 
You're trying to start it again, which causes the "port already in use" error.

## The Solution

### Step 1: Find the Existing Backend Terminal
Look through your open terminal tabs/windows for one that shows:
```
============================================================
[BACKEND] 🚀 Green Ledger MRV Server Started
[BACKEND] 🌐 Listening on port 3001
============================================================
```

This terminal has been running for ~9 minutes.

### Step 2: Keep That Terminal Visible
- Don't close it
- Don't start a new server
- Just keep it open and visible

### Step 3: Trigger Verification from Frontend
1. Go to http://localhost:8080/app/verify
2. Click on any unverified project
3. Click "Run Multi-agent Consensus"
4. **IMMEDIATELY look at the backend terminal**

You'll see logs streaming like:
```
[BACKEND] 📡 Received Verification Request for Project ID: proj-xxx
[BACKEND] ⏳ Running Baseline Agent...
[BACKEND] 📊 Baseline Results:
   - Baseline Emissions: 7845.32 kg CH4
   - Project Emissions: 3922.66 kg CH4
   - Reduction: 109.83 tCO2e
[BACKEND] ✅ Baseline Agent Completed

[BACKEND] 🛰️ Initiating Satellite Analysis...
... (continues for ~10 seconds)
```

## Alternative: Restart Fresh

If you can't find the existing terminal:

1. **Kill the existing server:**
   ```powershell
   Get-Process -Name node | Where-Object {$_.Path -like "*server*"} | Stop-Process -Force
   ```

2. **Start a new one in THIS terminal:**
   ```powershell
   node server.js
   ```

3. **Keep this terminal open and visible**

4. **Trigger verification from frontend**

## Quick Test Right Now

I just triggered a test verification for you. 
**Check the terminal running `node server.js`** - you should see fresh logs from the last few seconds!
