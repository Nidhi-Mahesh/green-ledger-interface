// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Deterministic consensus algorithm
function calculateConsensus(baselineResults, satelliteResults) {
    // Weighted confidence calculation
    const baselineWeight = 0.6;
    const satelliteWeight = 0.4;

    // Assume baseline has implicit 92% confidence
    const baselineConfidence = 92;
    const satelliteConfidence = satelliteResults.confidence;

    const weightedConfidence = (
        baselineConfidence * baselineWeight +
        satelliteConfidence * satelliteWeight
    ).toFixed(1);

    // Apply confidence factor to verified credits
    const confidenceFactor = parseFloat(weightedConfidence) / 100;
    const verifiedCredits = (baselineResults.reduction * confidenceFactor).toFixed(2);

    return {
        weightedConfidence: parseFloat(weightedConfidence),
        verifiedCredits: parseFloat(verifiedCredits),
        baselineConfidence,
        satelliteConfidence,
        algorithm: 'Weighted Deterministic Consensus',
        timestamp: new Date().toISOString()
    };
}

export async function runConsensusAgent(baselineResults, satelliteResults) {
    console.log(`\n[BACKEND] 🧮 Running Deterministic Consensus...`);

    await sleep(400);
    console.log(`[BACKEND] ⚖️ Weighing baseline and satellite data...`);

    await sleep(400);
    console.log(`[BACKEND] 📐 Calculating weighted confidence...`);

    await sleep(200);

    const results = calculateConsensus(baselineResults, satelliteResults);

    console.log(`[BACKEND] ✅ Consensus Achieved`);
    console.log(`   - Algorithm: ${results.algorithm}`);
    console.log(`   - Baseline Confidence: ${results.baselineConfidence}%`);
    console.log(`   - Satellite Confidence: ${results.satelliteConfidence}%`);
    console.log(`   - Weighted Confidence: ${results.weightedConfidence}%`);
    console.log(`   - 📦 Verified Credits: ${results.verifiedCredits} tCO2e`);

    return results;
}
