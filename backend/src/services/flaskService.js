const axios = require('axios');
const { FLASK_SERVICE_URL } = require('../config/env');

/**
 * Service to communicate with the Flask AI Microservice
 * @param {Object} scanData
 */
const analyzeScan = async (scanData) => {
  try {
    const response = await axios.post(FLASK_SERVICE_URL, {
      upiId: scanData.upiId,
      merchantName: scanData.merchantName,
      amount: scanData.amount
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask service:', error.message);
    throw new Error('Could not analyze the scan risk');
  }
};

module.exports = {
  analyzeScan
};
