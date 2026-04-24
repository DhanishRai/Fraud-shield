const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  upiId: {
    type: String,
    required: true
  },
  merchantName: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['SAFE', 'SUSPICIOUS', 'HIGH RISK'],
    required: true
  },
  reason: {
    type: String
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('History', historySchema);
