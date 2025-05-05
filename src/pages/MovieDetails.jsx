import React, { useState, useEffect } from 'react';
import { fetchTheaterSchedules, fetchMovieById } from '../services/api';
import SeatSelection from '../components/SeatSelection';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTicketAlt, FaClock, FaMapMarkerAlt, FaChair, FaArrowRight, FaSpinner, FaExclamationTriangle, FaFilm, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MovieDetails() {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch movie details
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [movieData, theaterData] = await Promise.all([
          fetchMovieById(movieId),
          fetchTheaterSchedules()
        ]);
        setMovie(movieData);
        setTheaters(theaterData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load movie details. Please try again.');
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  // Handle theater selection
  const handleTheaterChange = (theaterId) => {
    setSelectedTheater(theaterId);
    const theater = theaters.find((t) => t._id === theaterId);
    setShowtimes(theater ? theater.showtimes : []);
    setSelectedShowtime('');
    setSelectedSeats([]);
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
      toast.warning('Please select a theater, showtime, and at least one seat');
      return;
    }

    const theater = theaters.find(t => t._id === selectedTheater);
    
    navigate('/payment', {
      state: {
        movie,
        theater: {
          id: selectedTheater,
          name: theater?.name || 'Unknown Theater',
          seatPrice: theater?.seatPrice || 0
        },
        showtime: selectedShowtime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * (theater?.seatPrice || 0)
      },
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading movie details...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-red-500 p-4"
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

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FaTicketAlt className="text-4xl text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">Movie not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6 min-h-[80vh]"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Movie Poster and Info - Fixed height container */}
        <div className="lg:w-1/3 flex flex-col">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
          >
            <div className="h-96 overflow-hidden">
              <img
                src={movie.poster || "https://i.imgur.com/placeholder.jpg"}
                alt={`${movie.title} Poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.imgur.com/placeholder.jpg";
                  e.target.alt = "Poster not available";
                }}
              />
            </div>
            <div className="p-6 flex-grow">
              <h1 className="text-2xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {movie.genre.split(',')[0].trim()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {movie.duration} mins
                </span>
                {movie.rating && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    ★ {movie.rating}/10
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-4 min-h-[6rem]">
                {movie.description}
              </p>
              <div className="text-sm text-gray-500 mt-auto">
                <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Booking Section - Flex-grow to fill remaining space */}
        <div className="lg:w-2/3 flex-grow">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaTicketAlt className="text-blue-500" /> Book Tickets
            </h2>

            <div className="flex-grow space-y-6">
              {/* Theater Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Select Theater
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedTheater}
                  onChange={(e) => handleTheaterChange(e.target.value)}
                >
                  <option value="">-- Select a Theater --</option>
                  {theaters.map((theater) => (
                    <option key={theater._id} value={theater._id}>
                      {theater.name} (${theater.seatPrice}/seat)
                    </option>
                  ))}
                </select>
              </div>

              {/* Showtime Selection */}
              {selectedTheater && showtimes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-blue-500" /> Select Showtime
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {showtimes.map((showtime, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedShowtime(showtime)}
                        className={`p-3 rounded-lg border ${
                          selectedShowtime === showtime
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {showtime}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seat Selection */}
              {selectedShowtime && (
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaChair className="text-blue-500" /> Select Seats
                  </label>
                  <div className="min-h-[300px]">
                    <SeatSelection 
                      onSeatSelectionChange={setSelectedSeats}
                      seatPrice={theaters.find(t => t._id === selectedTheater)?.seatPrice || 0}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Proceed to Payment - Fixed at bottom */}
            {selectedSeats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Selected Seats:</p>
                  <p className="font-bold">
                    {selectedSeats.sort((a, b) => a - b).join(', ')}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Price per Seat:</p>
                  <p className="font-bold">
                    ${theaters.find(t => t._id === selectedTheater)?.seatPrice || 0}
                  </p>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <p className="font-medium">Total Price:</p>
                  <p className="text-blue-600">
                    ${selectedSeats.length * (theaters.find(t => t._id === selectedTheater)?.seatPrice || 0)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToPayment}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  Proceed to Payment <FaArrowRight />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieDetails;