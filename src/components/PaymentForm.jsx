import React, { useState } from 'react';
import { FaCreditCard, FaCalendarAlt, FaLock, FaCheckCircle, FaSpinner, FaReceipt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function PaymentForm({ onPaymentSuccess, totalAmount, isProcessing }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return +year > currentYear || (+year === currentYear && +month >= currentMonth);
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value.replace(/(\d{2})(\d{0,2})/, '$1/$2'));
    }
  };

  const generateBookingReference = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'card') {
      if (!validateCardNumber(cardNumber)) {
        setError('Please enter a valid 16-digit card number');
        return;
      }

      if (!validateExpiryDate(expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return;
      }

      if (!validateCVV(cvv)) {
        setError('Please enter a valid 3 or 4-digit CVV');
        return;
      }

      if (!cardHolder.trim()) {
        setError('Please enter card holder name');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingReference(generateBookingReference());
      setIsConfirmed(true);
      onPaymentSuccess();
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPayment = () => {
    setIsConfirmed(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolder('');
    setBookingReference('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {isConfirmed ? <FaReceipt /> : <FaCreditCard />}
          {isConfirmed ? 'Booking Confirmation' : 'Payment Details'}
        </h2>
        {totalAmount && !isConfirmed && (
          <p className="text-lg font-semibold mt-1">Total: ${totalAmount.toFixed(2)}</p>
        )}
      </div>

      <div className="p-6">
        {isConfirmed ? (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Confirmed!</h3>
            <p className="text-gray-600 mb-6">Your booking has been successfully processed.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Booking Reference:</span>
                <span className="font-bold">#{bookingReference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Amount Paid:</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-left">
                We've sent the booking details to your email. Please present your booking reference at the theater.
              </p>
            </div>

            <button
              onClick={handleNewPayment}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Make Another Payment
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('card')}
              >
                Credit/Debit Card
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                Digital Wallet
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <form onSubmit={handlePayment}>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Name on card"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                    />
                    <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                      />
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <div className="relative">
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        maxLength="4"
                      />
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="saveCard"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                    Save card for future payments
                  </label>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${(loading || isProcessing) ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {(loading || isProcessing) ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaCheckCircle /> Pay Now
                    </span>
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Digital wallet payment coming soon</p>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to card payment
                </button>
              </div>
            )}
          </>
        )}

{!isConfirmed && (
  <div className="mt-4 flex items-center justify-center gap-4">
    <img src="./images/visa-card.png" alt="Visa" className="h-10 w-auto" />
    <img src="./images/master-card.png" alt="Mastercard" className="h-10 w-auto" />
    <img src="./images/american-express-card.png" alt="American Express" className="h-10 w-auto" />
  </div>
)}
      </div>
    </motion.div>
  );
}

export default PaymentForm;