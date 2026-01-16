import { Project, AgentResult } from "../context/GlobalStore";

/**
 * Generates deterministic agent outputs based on project input.
 * This ensures the same project always produces the same verification results.
 */
export const generateAgentOutputs = (project: Project): AgentResult[] => {
    // Simple seed from project ID
    const seed = project.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Deterministic "random" helper
    const random = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    const baselineConfidence = 85 + random(seed) * 10;
    const baselineAnomaly = random(seed + 1) * 15;
    const baselineTons = project.claimedReduction * (0.9 + random(seed + 2) * 0.1);

    const satelliteConfidence = 80 + random(seed + 3) * 15;
    const satelliteAnomaly = random(seed + 4) * 20;
    const satelliteTons = project.claimedReduction * (0.85 + random(seed + 5) * 0.15);

    const anomalyConfidence = 90 + random(seed + 6) * 8;
    const anomalyScore = random(seed + 7) * 10;
    const anomalyTons = project.claimedReduction * (0.95 + random(seed + 8) * 0.05);

    return [
        {
            agentName: "Baseline Agent",
            confidenceScore: Math.round(baselineConfidence * 10) / 10,
            anomalyScore: Math.round(baselineAnomaly * 10) / 10,
            estimatedVerifiedTons: Math.round(baselineTons),
            weight: 0.4,
        },
        {
            agentName: "Satellite Agent",
            confidenceScore: Math.round(satelliteConfidence * 10) / 10,
            anomalyScore: Math.round(satelliteAnomaly * 10) / 10,
            estimatedVerifiedTons: Math.round(satelliteTons),
            weight: 0.35,
        },
        {
            agentName: "Anomaly detection Agent",
            confidenceScore: Math.round(anomalyConfidence * 10) / 10,
            anomalyScore: Math.round(anomalyScore * 10) / 10,
            estimatedVerifiedTons: Math.round(anomalyTons),
            weight: 0.25,
        },
    ];
};

/**
 * Calculates consensus result based on agent outputs.
 */
export const calculateConsensus = (agentResults: AgentResult[]) => {
    const weightedConfidence = agentResults.reduce((acc, res) => acc + res.confidenceScore * res.weight, 0);
    const maxAnomaly = Math.max(...agentResults.map(res => res.anomalyScore));
    const weightedTons = agentResults.reduce((acc, res) => acc + res.estimatedVerifiedTons * res.weight, 0);

    let status: Project["status"] = "verified";
    let reductionReason = "";
    let finalVerifiedTons = Math.round(weightedTons);

    if (weightedConfidence < 70 || maxAnomaly > 30) {
        status = "frozen";
        reductionReason = `Critical anomalies detected (${maxAnomaly.toFixed(1)}%) or low aggregate confidence (${weightedConfidence.toFixed(1)}%). Project frozen pending manual audit.`;
        finalVerifiedTons = 0;
    } else if (weightedConfidence < 85 || maxAnomaly > 15) {
        status = "approved-reduced";
        reductionReason = `Moderate anomalies detected (${maxAnomaly.toFixed(1)}%). Credits awarded with conservative reduction based on multi-agent consensus.`;
        // Apply additional reduction buffer
        finalVerifiedTons = Math.round(finalVerifiedTons * 0.9);
    }

    return {
        weightedConfidence: Math.round(weightedConfidence * 10) / 10,
        maxAnomaly: Math.round(maxAnomaly * 10) / 10,
        finalVerifiedTons,
        status,
        reductionReason: reductionReason || undefined,
    };
};

/**
 * Generates a deterministic attestation hash.
 */
export const generateDeterministicHash = (project: Project, agentResults: AgentResult[], consensus: any) => {
    const data = JSON.stringify({
        id: project.id,
        claimed: project.claimedReduction,
        agents: agentResults.map(r => r.estimatedVerifiedTons),
        final: consensus.finalVerifiedTons,
    });

    // Simple deterministic hash simulation
    let hashValue = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hashValue = ((hashValue << 5) - hashValue) + char;
        hashValue |= 0; // Convert to 32bit integer
    }

    const hex = Math.abs(hashValue).toString(16).padStart(8, '0');
    return `0xattestation_${hex}${hex}${hex}${hex}`;
};
