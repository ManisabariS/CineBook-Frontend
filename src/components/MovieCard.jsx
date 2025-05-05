import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCalendarAlt, FaFilm } from 'react-icons/fa';
import { motion } from 'framer-motion';

function MovieCard({ movie }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col h-full"
    >
      {/* Image Section - Fixed Height */}
      <div className="relative group h-64">
        <img
          src={movie.poster || "https://i.imgur.com/placeholder.jpg"}
          alt={`${movie.title} Poster`}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
          onError={(e) => {
            e.target.src = "https://i.imgur.com/placeholder.jpg";
            e.target.alt = "Poster not available";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {movie.rating && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full flex items-center text-sm font-bold">
            <FaStar className="mr-1" /> {movie.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content Section - Flex Grow for consistent height */}
      <div className="p-4 text-white flex flex-col flex-grow">
        {/* Title - Fixed height with truncation */}
        <h2 className="text-xl font-bold mb-2 line-clamp-1 min-h-[28px]">
          {movie.title}
        </h2>
        
        {/* Genre/Duration Badges - Fixed height */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
          <span className="px-2 py-1 bg-blue-600/80 rounded-full text-xs flex items-center">
            <FaFilm className="mr-1" /> {movie.genre.split(',')[0].trim()}
          </span>
          <span className="px-2 py-1 bg-purple-600/80 rounded-full text-xs flex items-center">
            <FaClock className="mr-1" /> {movie.duration} mins
          </span>
        </div>

        {/* Description - Fixed height with line clamp */}
        <p className="text-gray-300 text-sm line-clamp-3 mb-4 min-h-[60px]">
          {movie.description || 'No description available'}
        </p>

        {/* Date and Button - Fixed at bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <FaCalendarAlt />
            <span>
              {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              {movie.showtimes?.length > 0 ? (
                <span>{movie.showtimes.length} showtimes</span>
              ) : (
                <span className="text-red-400">No showtimes</span>
              )}
            </div>
            
            <Link
              to={`/movie/${movie._id}`}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg font-medium text-sm transition-all flex items-center justify-center whitespace-nowrap"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;