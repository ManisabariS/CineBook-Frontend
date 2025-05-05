import React, { useState } from 'react';
import { FaTicketAlt, FaCalendarAlt, FaChair, FaMoneyBillWave, FaPrint, FaShareAlt, FaCheckCircle, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

function BookingConfirmation({ bookingDetails }) {
  const [isCopied, setIsCopied] = useState(false);

  if (!bookingDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaTicketAlt className="text-blue-500" />
          Booking Confirmation
        </h2>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">No booking details available.</p>
        </div>
      </motion.div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `Booked ${bookingDetails.movie.title} at ${bookingDetails.showtime}. Seats: ${bookingDetails.seats.join(', ')}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg print:shadow-none print:bg-white"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Booking ID: {bookingDetails._id}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Share booking"
          >
            {isCopied ? (
              <span className="text-xs font-medium">Copied!</span>
            ) : (
              <FaShareAlt />
            )}
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Print ticket"
          >
            <FaPrint />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {bookingDetails.movie.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>{bookingDetails.movie.genre}</span>
              <span>•</span>
              <span>{bookingDetails.movie.duration} mins</span>
            </div>
            {bookingDetails.movie.poster && (
              <img
                src={bookingDetails.movie.poster}
                alt={bookingDetails.movie.title}
                className="w-full h-auto rounded-lg mb-4"
                onError={(e) => (e.target.src = '/default-movie.jpg')}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Show Details
            </h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Time:</span> {bookingDetails.showtime}
              </p>
              <p className="text-sm">
                <span className="font-medium">Theater:</span> {bookingDetails.theater.name}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaChair className="text-blue-500" />
              Seat Information
            </h4>
            <div className="flex flex-wrap gap-2">
              {bookingDetails.seats.map((seat) => (
                <span
                  key={seat}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                >
                  {seat}
                </span>
              ))}
            </div>
            <p className="text-sm mt-2">
              <span className="font-medium">Price per seat:</span> ${bookingDetails.theater.seatPrice}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              User Information
            </h4>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {bookingDetails.user.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {bookingDetails.user.email}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaMoneyBillWave className="text-blue-500" />
              Payment Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tickets ({bookingDetails.seats.length}):</span>
                <span>${bookingDetails.theater.seatPrice * bookingDetails.seats.length}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total Paid:</span>
                <span className="text-green-600">${bookingDetails.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <FaPrint /> Print Ticket
        </button>
        <button className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          View in App
        </button>
      </div>
    </motion.div>
  );
}

export default BookingConfirmation;