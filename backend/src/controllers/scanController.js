const History = require('../models/History');
const { validationResult } = require('express-validator');

// @desc    Scan QR and analyze risk
// @route   POST /api/scan
// @access  Public (should be protected in prod)
const scanQR = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { upiId, merchantName, amount, userId } = req.body;

  try {
    // Mock Response for Step 1
    // In Step 2, this will call the Flask AI microservice via flaskService.js
    
    // Mock logic based on rules
    let risk_score = 15;
    let status = 'SAFE';
    let reason = 'Trusted merchant and low amount';

    if (amount > 5000) {
      risk_score = 45;
      status = 'SUSPICIOUS';
      reason = 'Unusual amount';
    }

    if (upiId.includes('customercare') || upiId.includes('support')) {
      risk_score = 85;
      status = 'HIGH RISK';
      reason = 'Reported suspicious UPI formatting';
    }

    // Save scan history
    const history = await History.create({
      userId,
      upiId,
      merchantName,
      amount,
      riskScore: risk_score,
      status,
      reason
    });

    // Return the response matching the required sample format
    res.status(200).json({
      risk_score,
      status,
      reason,
      historyId: history._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanQR
};
