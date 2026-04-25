const History = require('../models/History');

// @desc    Get scan history for a user
// @route   GET /api/history/:userId
// @access  Public
const getUserHistory = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const history = await History.find({ userId }).sort({ scannedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserHistory
};
