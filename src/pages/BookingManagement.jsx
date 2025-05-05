import React, { useEffect, useState } from 'react';
import { fetchUserBookings, cancelBooking } from '../services/api';
import { jsPDF } from 'jspdf';
import { FaTicketAlt, FaTrash, FaDownload, FaSpinner, FaExclamationTriangle, FaFilm, FaTheaterMasks, FaClock, FaChair, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          throw new Error('User not authenticated');
        }
        
        const data = await fetchUserBookings(user._id);
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to fetch bookings. Please try again later.');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancelingId(bookingId);
      await cancelBooking(bookingId);
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      toast.success('Booking canceled successfully');
    } catch (err) {
      console.error('Error canceling booking:', err);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setCancelingId(null);
    }
  };

  const handleDownloadConfirmation = (booking) => {
    try {
      const doc = new jsPDF();
      
      // Add logo or header
      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147);
      doc.text('CineBook Ticket Confirmation', 105, 20, { align: 'center' });
      
      // Add divider
      doc.setDrawColor(40, 53, 147);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Add booking details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      doc.setFontSize(14);
      doc.text('Booking Details', 20, 35);
      
      doc.setFontSize(12);
      doc.text(`Booking ID: ${booking._id}`, 20, 45);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);
      
      // Movie details
      doc.setFontSize(14);
      doc.text('Movie Information', 20, 70);
      
      doc.setFontSize(12);
      doc.text(`Title: ${booking.movie?.title || 'Unknown Movie'}`, 20, 80);
      doc.text(`Genre: ${booking.movie?.genre || 'N/A'}`, 20, 90);
      
      // Theater details
      doc.setFontSize(14);
      doc.text('Theater Information', 20, 105);
      
      doc.setFontSize(12);
      doc.text(`Name: ${booking.theater?.name || 'Unknown Theater'}`, 20, 115);
      doc.text(`Showtime: ${booking.showtime}`, 20, 125);
      
      // Seats and price
      doc.setFontSize(14);
      doc.text('Seating Information', 20, 140);
      
      doc.setFontSize(12);
      doc.text(`Seats: ${booking.seats?.join(', ') || 'No seats selected'}`, 20, 150);
      doc.text(`Total Price: $${booking.totalPrice}`, 20, 160);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for booking with CineBook!', 105, 280, { align: 'center' });
      
      doc.save(`CineBook_Ticket_${booking._id}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate ticket. Please try again.');
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh]"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading your bookings...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-red-500 p-4"
      >
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-lg font-medium mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] p-4"
      >
        <FaTicketAlt className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">No bookings found</h2>
        <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Browse Movies
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaTicketAlt className="text-3xl text-blue-500" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Your Bookings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <motion.div
            key={booking._id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <FaFilm className="text-blue-500" />
                {booking.movie?.title || 'Unknown Movie'}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaTheaterMasks className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Theater</h4>
                    <p>{booking.theater?.name || 'Unknown Theater'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Showtime</h4>
                    <p>{booking.showtime}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaChair className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Seats</h4>
                    <div className="flex flex-wrap gap-1">
                      {booking.seats?.map((seat, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {seat}
                        </span>
                      )) || 'No seats selected'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMoneyBillWave className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Total Price</h4>
                    <p className="font-bold text-green-600">${booking.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDownloadConfirmation(booking)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <FaDownload /> Download Ticket
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCancelBooking(booking._id)}
                disabled={cancelingId === booking._id}
                className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 ${
                  cancelingId === booking._id ? 'opacity-75' : ''
                }`}
              >
                {cancelingId === booking._id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
                Cancel Booking
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default BookingManagement;