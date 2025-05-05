import React, { useEffect, useState } from 'react';
import { fetchTheaterSchedules } from '../services/api';
import { FaTheaterMasks, FaClock, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TheaterSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const data = await fetchTheaterSchedules();
        setSchedules(data);
        setError(null);
        toast.success('Schedules loaded successfully');
      } catch (err) {
        console.error('Error loading schedules:', err);
        setError('Failed to fetch theater schedules. Please try again later.');
        toast.error('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading theater schedules...</p>
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

  if (schedules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <FaTheaterMasks className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">No schedules available</h2>
        <p className="text-gray-500">Check back later for updated schedules</p>
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
        <FaTheaterMasks className="text-3xl text-blue-500" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Theater Schedules</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaClock className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search theaters..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No theaters match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <motion.div
              key={schedule._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">{schedule.name}</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <FaClock className="text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Showtimes</h3>
                    <div className="flex flex-wrap gap-2">
                      {schedule.showtimes.map((time, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Seat Price:</span> ${schedule.seatPrice || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default TheaterSchedule;