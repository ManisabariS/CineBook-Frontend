import React, { useState, useEffect } from 'react';
import { FaChair, FaMoneyBillWave, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

function SeatSelection({ totalSeats = 30, onSeatSelectionChange, seatPrice = 10, bookedSeats = [] }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [screenPosition] = useState('center');

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  useEffect(() => {
    if (onSeatSelectionChange) {
      onSeatSelectionChange(selectedSeats);
    }
  }, [selectedSeats, onSeatSelectionChange]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat) 
        : [...prev, seat]
    );
  };

  const calculateTotalPrice = () => selectedSeats.length * seatPrice;

  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaChair className="text-blue-500" />
        Select Your Seats
      </h2>

      {/* Screen Visualization */}
      <div className={`mb-8 relative ${screenPosition === 'center' ? 'mx-auto' : ''}`}>
        <div className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-t-full shadow-inner">
          <div className="text-center text-xs font-medium text-gray-500 mt-1">SCREEN</div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-8 gap-3 mb-8">
        {seats.map(seat => {
          const status = getSeatStatus(seat);
          return (
            <motion.button
              key={seat}
              whileHover={{ scale: status === 'available' ? 1.1 : 1 }}
              whileTap={{ scale: status === 'available' ? 0.95 : 1 }}
              onMouseEnter={() => setHoveredSeat(seat)}
              onMouseLeave={() => setHoveredSeat(null)}
              onClick={() => toggleSeat(seat)}
              disabled={status === 'booked'}
              className={`relative p-3 rounded-lg flex items-center justify-center transition-all
                ${status === 'booked' ? 'bg-red-100 cursor-not-allowed' : 
                  status === 'selected' ? 'bg-green-500 text-white' : 
                  'bg-gray-100 hover:bg-blue-100'}`}
            >
              {status === 'selected' && (
                <FaCheck className="absolute top-1 right-1 text-xs" />
              )}
              {seat}
              {hoveredSeat === seat && status === 'booked' && (
                <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Already booked
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex items-center gap-1 text-sm">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-gray-700">
            <FaChair />
            <span>Seats Selected:</span>
          </div>
          <span className="font-medium">
            {selectedSeats.length} × ${seatPrice}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <div className="flex items-center gap-2 text-blue-700">
            <FaMoneyBillWave />
            <span>Total Price:</span>
          </div>
          <span className="text-blue-700">${calculateTotalPrice()}</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Selected seats: {selectedSeats.sort((a,b) => a-b).join(', ')}
        </div>
      )}
    </motion.div>
  );
}

export default SeatSelection;