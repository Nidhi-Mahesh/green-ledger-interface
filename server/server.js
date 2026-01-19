import express from 'express';
import cors from 'cors';
import { runVerificationPipeline } from './pipeline/verificationPipeline.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[BACKEND] 📥 ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// Verification endpoint - triggers full pipeline
app.post('/api/verify/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const params = req.body;

    console.log(`\n[BACKEND] 📡 Received Verification Request for Project ID: ${projectId}`);
    console.log(`[BACKEND] 🔢 Parameters:`, JSON.stringify(params, null, 2));

    // Send immediate acknowledgment
    res.json({
        status: 'started',
        message: 'Verification pipeline initiated',
        projectId
    });

    // Run pipeline asynchronously (continues after response sent)
    try {
        const result = await runVerificationPipeline(projectId, params);
        console.log(`\n[BACKEND] 🎉 Pipeline completed successfully for Project ${projectId}`);
        console.log(`[BACKEND] 📋 Final Result:`, JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(`\n[BACKEND] ❌ Pipeline failed for Project ${projectId}:`, error.message);
    }
});

// MRV analysis endpoint
app.post('/api/mrv/run', async (req, res) => {
    const { projectId, ...params } = req.body;

    console.log(`\n[BACKEND] 📡 Received MRV Analysis Request for Project ID: ${projectId}`);

    res.json({
        status: 'started',
        message: 'MRV analysis initiated',
        projectId
    });

    try {
        const result = await runVerificationPipeline(projectId, params);
        console.log(`\n[BACKEND] 🎉 MRV Analysis completed for Project ${projectId}`);
    } catch (error) {
        console.error(`\n[BACKEND] ❌ MRV Analysis failed:`, error.message);
    }
});

// Credit minting endpoint
app.post('/api/credits/mint', async (req, res) => {
    const { projectId, amount, ...params } = req.body;

    console.log(`\n[BACKEND] 📡 Received Minting Request for Project ID: ${projectId}`);
    console.log(`[BACKEND] 💰 Amount: ${amount} tons`);

    res.json({
        status: 'started',
        message: 'Credit minting initiated',
        projectId,
        amount
    });

    try {
        const result = await runVerificationPipeline(projectId, { ...params, mintAmount: amount });
        console.log(`\n[BACKEND] 🎉 Minting completed for Project ${projectId}`);
    } catch (error) {
        console.error(`\n[BACKEND] ❌ Minting failed:`, error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`[BACKEND] 🚀 Green Ledger MRV Server Started`);
    console.log(`[BACKEND] 🌐 Listening on port ${PORT}`);
    console.log(`[BACKEND] 📍 Health check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60) + '\n');
});
