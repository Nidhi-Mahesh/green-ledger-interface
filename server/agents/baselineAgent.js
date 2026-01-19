// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate realistic baseline emissions data
function generateBaselineData(params) {
    const area = params.area || 100; // hectares
    const method = params.method || 'AWD';

    // Baseline: traditional continuous flooding
    const baselineEmissionFactor = 70 + Math.random() * 20; // 70-90 kg CH4/ha
    const baselineEmissions = (area * baselineEmissionFactor).toFixed(2);

    // Project: AWD or other improved method
    const reductionFactor = method === 'AWD' ? 0.5 : 0.6; // 40-50% reduction
    const projectEmissions = (baselineEmissions * reductionFactor).toFixed(2);

    // Convert CH4 to CO2e (GWP of CH4 = 28)
    const reduction = ((baselineEmissions - projectEmissions) * 28 / 1000).toFixed(2);

    return {
        baselineEmissions: parseFloat(baselineEmissions),
        projectEmissions: parseFloat(projectEmissions),
        reduction: parseFloat(reduction),
        area,
        method,
        emissionFactor: baselineEmissionFactor.toFixed(2)
    };
}

export async function runBaselineAgent(projectId, params) {
    console.log(`[BACKEND] ⏳ Running Baseline Agent...`);

    await sleep(500);
    console.log(`[BACKEND] 🔍 Analyzing project methodology: ${params.method || 'AWD'}`);

    await sleep(800);
    console.log(`[BACKEND] 📐 Calculating emission factors...`);

    await sleep(700);
    console.log(`[BACKEND] 🧮 Computing baseline vs project emissions...`);

    await sleep(500);

    const results = generateBaselineData(params);

    console.log(`[BACKEND] 📊 Baseline Results:`);
    console.log(`   - Area: ${results.area} hectares`);
    console.log(`   - Methodology: ${results.method}`);
    console.log(`   - Baseline Emissions: ${results.baselineEmissions} kg CH4`);
    console.log(`   - Project Emissions: ${results.projectEmissions} kg CH4`);
    console.log(`   - Reduction: ${results.reduction} tCO2e`);
    console.log(`[BACKEND] ✅ Baseline Agent Completed`);

    return results;
}
