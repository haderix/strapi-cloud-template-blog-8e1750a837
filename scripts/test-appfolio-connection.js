const axios = require('axios').default;

async function testAppFolioConnection() {
  try {
    console.log('🔍 Testing AppFolio plugin connection...\n');
    
    const axiosConfig = {
      timeout: 30000,
      validateStatus: function (status) {
        return status >= 200 && status < 600; // Don't throw for any HTTP status
      }
    };
    
    const response = await axios.get('http://localhost:1337/appfolio-sync/test-connection', axiosConfig);
    
    if (response.status !== 200) {
      console.log('❌ HTTP Error:', response.status, response.statusText);
      console.log('Response:', response.data);
      return;
    }
    
    const result = response.data;
    
    if (result.success) {
      console.log('✅ Connection test successful!');
      console.log('📊 Results:');
      console.log(`   Status: ${result.data.status}`);
      console.log(`   API URL: ${result.data.apiUrl}`);
      console.log(`   Response Status: ${result.data.responseStatus}`);
      console.log(`   Data Received: ${result.data.dataReceived} items (${result.data.dataType})`);
      console.log(`   Sample Data:`, JSON.stringify(result.data.sampleData, null, 2));
    } else {
      console.log('❌ Connection test failed!');
      console.log('🔥 Error:', result.error);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to Strapi server. Make sure Strapi is running on http://localhost:1337');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ Request timed out. The server might be taking too long to respond.');
    } else {
      console.error('❌ Test script failed:', error.message);
      if (error.response?.data) {
        console.error('Response data:', error.response.data);
      }
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAppFolioConnection();
}

module.exports = { testAppFolioConnection };
