# Green Ledger Backend Server

## Quick Start

### Install Dependencies
```bash
cd server
npm install
```

### Start the Server
```bash
npm start
```

The server will start on **port 3001** and display:
```
============================================================
[BACKEND] 🚀 Green Ledger MRV Server Started
[BACKEND] 🌐 Listening on port 3001
[BACKEND] 📍 Health check: http://localhost:3001/api/health
============================================================
```

## API Endpoints

### 1. Verify Project
```bash
POST /api/verify/:projectId
```

Triggers the full MRV verification pipeline with real-time terminal logging.

**Example:**
```bash
curl -X POST http://localhost:3001/api/verify/proj-123 \
  -H "Content-Type: application/json" \
  -d '{"method":"AWD","area":100,"projectName":"Test Project"}'
```

### 2. Run MRV Analysis
```bash
POST /api/mrv/run
```

### 3. Mint Credits
```bash
POST /api/credits/mint
```

## Real-Time Logging

When you trigger a verification from the frontend, watch the backend terminal for:

1. **Baseline Agent** (~2.5s) - Emission calculations
2. **Satellite Agent** (~4s) - NDVI and environmental analysis
3. **Consensus Agent** (~1s) - Weighted confidence calculation
4. **Blockchain Agent** (~2.3s) - Mock transaction minting

**Total pipeline time: ~10 seconds**

## Running Both Frontend and Backend

### Terminal 1 - Backend:
```bash
cd server
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

Then navigate to the Verify page and click "Run Multi-agent Consensus" on any unverified project!
