const { validationResult } = require('express-validator');
const { processScan } = require('../services/scanService');

// @desc    Scan QR and analyze risk
// @route   POST /api/scan
// @access  Public (should be protected in prod)
const scanQR = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await processScan(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanQR
};
