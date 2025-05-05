import axios from 'axios';

//const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL
const API_BASE_URL = 'https://cinebook-backend.onrender.com/api';

// Fetch movies
export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Fetch showtimes for a movie
export const fetchShowtimes = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/showtimes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Fetch movie details by ID
export const fetchMovieById = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Fetch bookings for a specific user


// Fetch theater schedules
export const fetchTheaterSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/theaters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching theater schedules:', error);
    throw error;
  }
};

// Book tickets
export const bookTickets = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking tickets:', error);
    throw error;
  }
};

// Cancel booking


// Add theater schedule
export const addTheaterSchedule = async (scheduleData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/theaters`, scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error adding theater schedule:', error);
    throw error;
  }
};

// Update theater schedule
export const updateTheaterSchedule = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/theaters/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating theater schedule:', error);
    throw error;
  }
};

// Delete theater schedule
export const deleteTheaterSchedule = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/theaters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting theater schedule:', error);
    throw error;
  }
};

// Fetch user profile
export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Fetch booking trends for reports
export const fetchBookingTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/booking-trends`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    throw error;
  }
};

// Fetch sales performance for reports
export const fetchSalesPerformance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/sales-performance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales performance:', error);
    throw error;
  }
};

// Fetch user activity for reports
export const fetchUserActivity = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/user-activity`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

// filepath: d:\Sabari\g_fsd\DEMO\capstone-frontend-main\src\services\api.js

// Fetch user bookings
export const fetchUserBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};