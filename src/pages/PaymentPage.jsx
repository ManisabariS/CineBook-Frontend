import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { bookTickets } from '../services/api';
import { FaFilm, FaTheaterMasks, FaClock, FaChair, FaMoneyBillWave, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, theater, showtime, seats, totalPrice } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        toast.error('Please log in to complete your booking');
        navigate('/login');
        return;
      }

      const bookingData = {
        movie: movie._id,
        theater: theater.id,
        showtime,
        seats,
        user: user._id,
        totalPrice,
      };

      // Call your actual API here
      const response = await bookTickets(bookingData);
      
      // Store booking details for confirmation display
      setBookingDetails({
        reference: response.data.bookingId || generateRandomReference(),
        movie: movie.title,
        theater: theater.name,
        showtime,
        seats,
        totalPrice
      });

      setBookingConfirmed(true);
      
      toast.success('Payment successful! Your tickets have been booked.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete booking. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRandomReference = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleGoBack = () => {
    if (bookingConfirmed) {
      navigate('/booking-management');
    } else {
      navigate(-1);
    }
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  if (!movie || !theater || !showtime || !seats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Invalid Booking Details</h2>
          <p className="text-red-600">Please select your seats and showtime again.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6"
    >
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft /> {bookingConfirmed ? 'Back to bookings' : 'Back to seat selection'}
      </button>

      {bookingConfirmed ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <FaCheckCircle className="text-5xl mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="mt-2">Your tickets have been successfully booked</p>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Booking Reference</h3>
              <p className="text-2xl font-mono text-blue-600">#{bookingDetails.reference}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Movie Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Movie</p>
                    <p className="font-medium">{bookingDetails.movie}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Theater</p>
                    <p className="font-medium">{bookingDetails.theater}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Showtime</p>
                    <p className="font-medium">{bookingDetails.showtime}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Booking Summary</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {bookingDetails.seats.sort((a, b) => a - b).map((seat) => (
                        <span key={seat} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">${bookingDetails.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-gray-700">
                Your e-ticket has been sent to your email. Please present your booking reference at the theater.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleNewBooking}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Book Another Movie
              </button>
              <button
                onClick={() => navigate('/booking-management')}
                className="flex-1 py-3 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaFilm className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Movie</h3>
                    <p className="font-semibold">{movie.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaTheaterMasks className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Theater</h3>
                    <p className="font-semibold">{theater.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaClock className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Showtime</h3>
                    <p className="font-semibold">{showtime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaChair className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Seats</h3>
                    <div className="flex flex-wrap gap-2">
                      {seats.sort((a, b) => a - b).map((seat) => (
                        <span key={seat} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaMoneyBillWave className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Total Price</h3>
                    <p className="font-bold text-2xl text-blue-600">${totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Payment Information</h2>
              <PaymentForm 
                onPaymentSuccess={handlePaymentSuccess} 
                totalAmount={totalPrice}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default PaymentPage;