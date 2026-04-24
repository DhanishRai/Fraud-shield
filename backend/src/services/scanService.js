const History = require('../models/History');
const { checkBlacklist } = require('./blacklistService');
const { analyzeScan } = require('./flaskService');

/**
 * Process a new QR scan
 * @param {Object} scanData - The scan details payload
 * @returns {Object} Final scan evaluation result
 */
const processScan = async (scanData) => {
  const { upiId, merchantName, amount, userId } = scanData;
  
  // 1. Check local Blacklist first
  const blacklistEntry = await checkBlacklist(upiId);
  if (blacklistEntry && blacklistEntry.riskLevel === 'HIGH RISK') {
    // Save history as high risk immediately
    const history = await History.create({
      userId,
      upiId,
      merchantName,
      amount,
      riskScore: 100,
      status: 'HIGH RISK',
      reason: 'UPI ID is blacklisted'
    });

    return {
      risk_score: 100,
      status: 'HIGH RISK',
      reason: 'UPI ID is blacklisted',
      historyId: history._id
    };
  }

  // 2. Call Flask AI Microservice (Mocked in flaskService)
  const flaskResponse = await analyzeScan({ upiId, merchantName, amount });
  
  // 3. Save scan history
  const history = await History.create({
    userId,
    upiId,
    merchantName,
    amount,
    riskScore: flaskResponse.risk_score,
    status: flaskResponse.status,
    reason: flaskResponse.reason
  });

  return {
    ...flaskResponse,
    historyId: history._id
  };
};

module.exports = {
  processScan
};
