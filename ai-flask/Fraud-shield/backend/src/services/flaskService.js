const axios = require('axios');
const { FLASK_SERVICE_URL } = require('../config/env');

/**
 * Service to communicate with the Flask AI Microservice
 * @param {Object} scanData 
 * @param {number} retries - Number of retry attempts
 * @param {number} timeout - Request timeout in milliseconds
 */
const analyzeScan = async (scanData, retries = 3, timeout = 5000) => {
  const payload = {
    upiId: scanData.upiId,
    merchantName: scanData.merchantName,
    amount: scanData.amount,
    reportsCount: scanData.reportsCount || 0
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(FLASK_SERVICE_URL, payload, {
        timeout: timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      console.warn(`Flask service call failed (Attempt ${attempt}/${retries}): ${error.message}`);
      
      if (isLastAttempt) {
        console.error('All retries exhausted for Flask AI service.');
        // If it completely fails, we can either throw or return a safe default
        throw new Error('Could not analyze the scan risk after multiple attempts');
      }

      // Exponential backoff delay: 500ms, 1000ms...
      const backoffDelay = attempt * 500;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};

module.exports = {
  analyzeScan
};
