import axios from 'axios';

// Backend Node.js API URL
// For Android emulator: use 10.0.2.2 instead of localhost
// For physical device: use your computer's local IP (e.g., 192.168.1.100)
// For iOS simulator: localhost works
// Using local IPv4 address directly since tunnels crash
const API_BASE_URL = 'http://10.10.10.176:3000/api';

/**
 * Sends parsed QR code data to the Node.js backend for AI risk analysis.
 * @param {Object} data - Contains upiId, name, amount from QR parser
 * @returns {Promise<Object>} The risk assessment result
 */
export const analyzeQR = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan`, {
      upiId: data.upiId,
      merchantName: data.name,
      amount: parseFloat(data.amount) || 0,
    }, {
      timeout: 15000, // 15s timeout for Flask AI analysis
    });

    return response.data;
  } catch (error) {
    console.error('API Integration Error:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis timed out. Please try again.');
    }

    if (!error.response) {
      throw new Error('Server unavailable. Make sure backend is running.');
    }

    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Analysis failed. Please try again.';
    throw new Error(errorMessage);
  }
};

/**
 * Fetches scan history for a user.
 * @param {string} userId
 * @returns {Promise<Object>} History data
 */
export const getHistory = async (userId = 'demo-user') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${userId}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('History fetch error:', error);
    throw new Error('Could not load history.');
  }
};

/**
 * Reports a suspicious UPI ID.
 * @param {Object} data - { upiId, reason }
 * @returns {Promise<Object>}
 */
export const reportScam = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/report`, {
      upiId: data.upiId,
      reason: data.reason,
    }, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Report error:', error);
    throw new Error('Failed to submit report.');
  }
};

/**
 * Login / Register user.
 * @param {Object} data - { phone, name }
 * @returns {Promise<Object>}
 */
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: data.phone,
      name: data.name || 'User',
    }, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed. Please try again.');
  }
};
