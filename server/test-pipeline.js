// Quick test script to verify the backend pipeline
// Run this with: node test-pipeline.js

const testVerification = async () => {
    try {
        console.log('🧪 Testing MRV Verification Pipeline...\n');

        const response = await fetch('http://localhost:3001/api/verify/test-project-123', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'AWD',
                area: 100,
                projectName: 'Test Rice Farm',
                location: 'Madhya Pradesh, India',
            }),
        });

        const result = await response.json();
        console.log('✅ API Response:', result);
        console.log('\n👀 Check the backend terminal for real-time agent logs!\n');
        console.log('⏱️  Pipeline will complete in ~10 seconds...\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure the backend server is running on port 3001');
        console.log('   Run: cd server && npm start\n');
    }
};

testVerification();
