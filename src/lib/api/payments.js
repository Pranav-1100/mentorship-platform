import axios from '@/lib/axios';

/**
 * Check if payment system is enabled
 * This is useful to conditionally show payment features in the UI
 */
export const isPaymentEnabled = () => {
  // You can add a check here or just try the API and handle 503 errors
  return true;
};

/**
 * Create a payment order for a session
 * @param {number} sessionId - The session ID
 * @returns {Promise} Order data including Razorpay order ID
 */
export const createOrder = async (sessionId) => {
  try {
    const response = await axios.post('/payments/create-order', {
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to create payment order.');
  }
};

/**
 * Verify payment after Razorpay checkout
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Razorpay order ID
 * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
 * @param {string} paymentData.razorpay_signature - Razorpay signature
 * @returns {Promise} Payment verification result
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post('/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to verify payment.');
  }
};

/**
 * Get payment history for the current user
 * @param {string} role - 'mentor' or 'mentee'
 * @returns {Promise} Array of payment records
 */
export const getPaymentHistory = async (role = 'mentee') => {
  try {
    const response = await axios.get('/payments/history', {
      params: { role }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch payment history.');
  }
};

/**
 * Get payment details by ID
 * @param {number} paymentId - The payment ID
 * @returns {Promise} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch payment details.');
  }
};

/**
 * Get mentor earnings summary
 * @returns {Promise} Earnings data
 */
export const getMentorEarnings = async () => {
  try {
    const response = await axios.get('/payments/mentor/earnings');
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch mentor earnings.');
  }
};

/**
 * Get mentor current balance
 * @returns {Promise} Balance data
 */
export const getMentorBalance = async () => {
  try {
    const response = await axios.get('/payments/mentor/balance');
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch mentor balance.');
  }
};

/**
 * Request payout as a mentor
 * @param {Object} payoutData - Payout request data
 * @param {number} payoutData.amount - Amount to withdraw
 * @param {string} payoutData.payment_method - 'bank' or 'upi'
 * @param {Object} payoutData.account_details - Account details
 * @returns {Promise} Payout request data
 */
export const requestPayout = async (payoutData) => {
  try {
    const response = await axios.post('/payments/payout/request', payoutData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to request payout.');
  }
};

/**
 * Get payout history for mentor
 * @returns {Promise} Array of payout records
 */
export const getPayoutHistory = async () => {
  try {
    const response = await axios.get('/payments/payout/history');
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch payout history.');
  }
};

/**
 * Request a refund for a payment
 * @param {number} paymentId - The payment ID
 * @param {string} reason - Refund reason
 * @returns {Promise} Refund data
 */
export const refundPayment = async (paymentId, reason) => {
  try {
    const response = await axios.post(`/payments/${paymentId}/refund`, {
      reason
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Payment system is currently disabled');
    }
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to process refund.');
  }
};

/**
 * Process payment for a session (creates order and returns Razorpay config)
 * This is a helper function that combines order creation with Razorpay initialization
 * @param {number} sessionId - The session ID
 * @returns {Promise} Razorpay configuration object
 */
export const initiatePayment = async (sessionId) => {
  try {
    const order = await createOrder(sessionId);

    return {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency || 'INR',
      order_id: order.razorpay_order_id,
      name: 'MentorMate',
      description: 'Session Payment',
      prefill: order.prefill || {},
    };
  } catch (error) {
    throw error;
  }
};
