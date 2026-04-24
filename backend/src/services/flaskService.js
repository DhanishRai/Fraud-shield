const axios = require('axios');
const { FLASK_SERVICE_URL } = require('../config/env');

/**
 * Service to communicate with the Flask AI Microservice
 */
const analyzeScan = async (scanData) => {
  try {
    // For Step 2, this will be uncommented to make the actual call
    /*
    const response = await axios.post(FLASK_SERVICE_URL, {
      upiId: scanData.upiId,
      merchantName: scanData.merchantName,
      amount: scanData.amount
    });
    return response.data;
    */
    
    // Mock response for now
    return {
      risk_score: 10,
      status: 'SAFE',
      reason: 'Mock response from flaskService'
    };
  } catch (error) {
    console.error('Error calling Flask service:', error.message);
    throw new Error('Could not analyze the scan risk');
  }
};

module.exports = {
  analyzeScan
};
