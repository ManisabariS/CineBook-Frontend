import React, { useState } from 'react';
import { FaClock, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ShowtimeSelector({ showtimes, onSelectShowtime, theaterName, movieTitle }) {
  const [currentPage, setCurrentPage] = useState(0);
  const showtimesPerPage = 6;
  const totalPages = Math.ceil(showtimes.length / showtimesPerPage);

  const handleSelect = (showtime) => {
    onSelectShowtime(showtime);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const paginatedShowtimes = showtimes.slice(
    currentPage * showtimesPerPage,
    (currentPage + 1) * showtimesPerPage
  );

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaTicketAlt className="text-yellow-300" />
          {movieTitle ? `Showtimes for ${movieTitle}` : 'Available Showtimes'}
        </h2>
        {theaterName && (
          <p className="text-sm opacity-90 mt-1 flex items-center">
            <FaClock className="mr-1" /> {theaterName}
          </p>
        )}
      </div>

      <div className="p-6">
        {showtimes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No showtimes available for this movie
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {paginatedShowtimes.map((showtime, index) => (
                <motion.button
                  key={`${showtime}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(showtime)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 
                    bg-white hover:bg-blue-50 transition-all flex flex-col items-center"
                >
                  <span className="font-bold text-blue-600">
                    {formatTime(showtime)}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Available
                  </span>
                </motion.button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed
                    bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed
                    bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ShowtimeSelector;