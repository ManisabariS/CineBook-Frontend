import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/api';
import { FaSearch, FaFilter, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaFilm } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterReleaseDate, setFilterReleaseDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [uniqueGenres, setUniqueGenres] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies();
        setMovies(data);
        setFilteredMovies(data);
        
        // Extract unique genres
        const genres = [...new Set(data.flatMap(movie => movie.genre.split(',').map(g => g.trim())))];
        setUniqueGenres(genres);
        setError(null);
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = movies;

    // Search by title
    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (filterGenre) {
      filtered = filtered.filter((movie) =>
        movie.genre.split(',').map(g => g.trim()).includes(filterGenre)
      );
    }

    // Filter by release date
    if (filterReleaseDate) {
      filtered = filtered.filter((movie) => {
        const movieDate = new Date(movie.releaseDate);
        const filterDate = new Date(filterReleaseDate);
        return movieDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredMovies(filtered);
  }, [searchQuery, filterGenre, filterReleaseDate, movies]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterGenre('');
    setFilterReleaseDate('');
    setFilteredMovies(movies);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh]"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading movies...</p>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaFilm className="text-3xl text-blue-500" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Now Showing</h1>
      </div>

      {/* Search Section */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search movies by title..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Controls */}
      <div className="mb-8">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 mb-4"
        >
          <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Genre</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {uniqueGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Release Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterReleaseDate}
                    onChange={(e) => setFilterReleaseDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {(filterGenre || filterReleaseDate) && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Movie List */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <motion.div
              key={movie._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
        >
          <FaFilm className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No movies found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterGenre || filterReleaseDate
              ? 'Try adjusting your search or filters'
              : 'There are currently no movies available'}
          </p>
          {(searchQuery || filterGenre || filterReleaseDate) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset Filters
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Home;