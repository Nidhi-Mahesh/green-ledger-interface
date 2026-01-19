// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock transaction hash
function generateTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Generate mock blockchain data
function generateBlockchainData(consensusResults, params) {
    const mintAmount = params.mintAmount || consensusResults.verifiedCredits;

    return {
        txHash: generateTxHash(),
        blockNumber: Math.floor(15000000 + Math.random() * 1000000),
        mintAmount: parseFloat(mintAmount),
        gasUsed: '0.00' + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9),
        network: 'Polygon',
        contractAddress: '0x' + 'a'.repeat(40),
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
}

export async function runBlockchainAgent(consensusResults, params = {}) {
    console.log(`\n[BACKEND] ⛓️ Connecting to Blockchain...`);

    await sleep(500);
    console.log(`[BACKEND] 🌐 Network: Polygon Mainnet`);
    console.log(`[BACKEND] 🔗 Contract: Carbon Credit Registry`);

    await sleep(600);
    console.log(`[BACKEND] 🆔 Preparing Mint Transaction...`);

    const mintAmount = params.mintAmount || consensusResults.verifiedCredits;
    console.log(`[BACKEND] 💵 Minting Amount: ${mintAmount} tCO2e`);

    await sleep(500);
    console.log(`[BACKEND] ✍️ Signing transaction...`);

    await sleep(400);
    console.log(`[BACKEND] 📤 Broadcasting to network...`);

    await sleep(300);

    const results = generateBlockchainData(consensusResults, params);

    console.log(`[BACKEND] ✅ Transaction Confirmed`);
    console.log(`   - 🔗 Tx Hash: ${results.txHash}`);
    console.log(`   - 📦 Block Number: ${results.blockNumber}`);
    console.log(`   - 💰 Minted: ${results.mintAmount} tCO2e`);
    console.log(`   - ⛽ Gas Used: ${results.gasUsed} ETH`);
    console.log(`   - 🌐 Network: ${results.network}`);
    console.log(`   - ⏰ Timestamp: ${results.timestamp}`);

    return results;
}
