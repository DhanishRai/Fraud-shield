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
    
    // Mock logic based on rules
    let risk_score = 15;
    let status = 'SAFE';
    let reason = 'Trusted merchant and low amount';

    if (scanData.amount > 5000) {
      risk_score = 45;
      status = 'SUSPICIOUS';
      reason = 'Unusual amount';
    }

    if (scanData.upiId.includes('customercare') || scanData.upiId.includes('support')) {
      risk_score = 85;
      status = 'HIGH RISK';
      reason = 'Reported suspicious UPI formatting';
    }

    return {
      risk_score,
      status,
      reason
    };
  } catch (error) {
    console.error('Error calling Flask service:', error.message);
    throw new Error('Could not analyze the scan risk');
  }
};

module.exports = {
  analyzeScan
};
