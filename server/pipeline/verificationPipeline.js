import { runBaselineAgent } from '../agents/baselineAgent.js';
import { runSatelliteAgent } from '../agents/satelliteAgent.js';
import { runConsensusAgent } from '../agents/consensusAgent.js';
import { runBlockchainAgent } from '../agents/blockchainAgent.js';

/**
 * Main verification pipeline orchestrator
 * Executes agents in sequence: Baseline → Satellite → Consensus → Blockchain
 * 
 * @param {string} projectId - Unique project identifier
 * @param {object} params - Pipeline parameters (method, area, etc.)
 * @returns {object} Complete pipeline results
 */
export async function runVerificationPipeline(projectId, params = {}) {
    const startTime = Date.now();

    try {
        // Stage 1: Baseline/MRV Agent (~2.5s)
        const baselineResults = await runBaselineAgent(projectId, params);

        // Stage 2: Satellite Agent (~4s)
        const satelliteResults = await runSatelliteAgent(projectId, baselineResults);

        // Stage 3: Consensus Agent (~1s)
        const consensusResults = await runConsensusAgent(baselineResults, satelliteResults);

        // Stage 4: Blockchain Agent (~2.3s)
        const blockchainResults = await runBlockchainAgent(consensusResults, params);

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        // Final summary
        const finalResults = {
            projectId,
            status: 'success',
            duration: `${duration}s`,
            baseline: baselineResults,
            satellite: satelliteResults,
            consensus: consensusResults,
            blockchain: blockchainResults,
            summary: {
                verifiedCredits: consensusResults.verifiedCredits,
                confidence: consensusResults.weightedConfidence,
                txHash: blockchainResults.txHash,
                timestamp: new Date().toISOString()
            }
        };

        return finalResults;

    } catch (error) {
        console.error(`[BACKEND] ❌ Pipeline Error:`, error);
        throw error;
    }
}
