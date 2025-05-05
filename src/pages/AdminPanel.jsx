import React, { useState, useEffect } from 'react';
import {
  fetchTheaterSchedules,
  addTheaterSchedule,
  updateTheaterSchedule,
  deleteTheaterSchedule,
} from '../services/api';
import { FaTheaterMasks, FaPlus, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPanel() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSchedule, setNewSchedule] = useState({ 
    name: '', 
    showtimes: '', 
    seatPrice: '' 
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ 
    showtimes: '', 
    seatPrice: '' 
  });

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const data = await fetchTheaterSchedules();
        setSchedules(data);
        setError(null);
      } catch (err) {
        console.error('Error loading schedules:', err);
        setError('Failed to fetch theater schedules');
        toast.error('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const handleAddSchedule = async () => {
    if (!newSchedule.name || !newSchedule.showtimes || !newSchedule.seatPrice) {
      toast.warning('Please fill all fields');
      return;
    }

    try {
      setIsAdding(true);
      const showtimesArray = newSchedule.showtimes.split(',').map((time) => time.trim());
      const schedule = { 
        ...newSchedule, 
        showtimes: showtimesArray,
        seatPrice: parseFloat(newSchedule.seatPrice)
      };
      
      const addedSchedule = await addTheaterSchedule(schedule);
      setSchedules((prev) => [...prev, addedSchedule]);
      setNewSchedule({ name: '', showtimes: '', seatPrice: '' });
      toast.success('Schedule added successfully');
    } catch (err) {
      console.error('Error adding schedule:', err);
      toast.error('Failed to add schedule');
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (schedule) => {
    setEditingId(schedule._id);
    setEditValues({
      showtimes: schedule.showtimes.join(', '),
      seatPrice: schedule.seatPrice.toString()
    });
  };

  const handleUpdateSchedule = async (id) => {
    try {
      const showtimesArray = editValues.showtimes.split(',').map((time) => time.trim());
      const updatedData = {
        showtimes: showtimesArray,
        seatPrice: parseFloat(editValues.seatPrice)
      };
      
      const updatedSchedule = await updateTheaterSchedule(id, updatedData);
      setSchedules((prev) =>
        prev.map((schedule) => (schedule._id === id ? updatedSchedule : schedule))
      );
      setEditingId(null);
      toast.success('Schedule updated successfully');
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast.error('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await deleteTheaterSchedule(id);
      setSchedules((prev) => prev.filter((schedule) => schedule._id !== id));
      toast.success('Schedule deleted successfully');
    } catch (err) {
      console.error('Error deleting schedule:', err);
      toast.error('Failed to delete schedule');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaTheaterMasks className="text-3xl text-blue-500" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Manage Theater Schedules</h1>
      </div>

      {/* Add New Schedule */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaPlus className="text-blue-500" /> Add New Theater Schedule
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
            <input
              type="text"
              placeholder="e.g., Cineplex Downtown"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Showtimes (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., 10:00, 13:30, 17:00, 20:30"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newSchedule.showtimes}
              onChange={(e) => setNewSchedule({ ...newSchedule, showtimes: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seat Price ($)</label>
            <input
              type="number"
              placeholder="e.g., 12.99"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newSchedule.seatPrice}
              onChange={(e) => setNewSchedule({ ...newSchedule, seatPrice: e.target.value })}
            />
          </div>
        </div>
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddSchedule}
            disabled={isAdding}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${isAdding ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Adding...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaPlus /> Add Schedule
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Existing Schedules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Theater Schedules</h2>
        
        {schedules.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700">No theater schedules found. Add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <motion.div
                key={schedule._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
                  <h3 className="font-bold text-lg text-gray-800">{schedule.name}</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaClock className="text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Showtimes</h4>
                      {editingId === schedule._id ? (
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={editValues.showtimes}
                          onChange={(e) => setEditValues({...editValues, showtimes: e.target.value})}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {schedule.showtimes.map((time, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {time}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-green-500" />
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Seat Price</h4>
                      {editingId === schedule._id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={editValues.seatPrice}
                          onChange={(e) => setEditValues({...editValues, seatPrice: e.target.value})}
                        />
                      ) : (
                        <p className="font-bold text-green-600">${schedule.seatPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                  {editingId === schedule._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateSchedule(schedule._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(schedule)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AdminPanel;