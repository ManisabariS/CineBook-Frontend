import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import BookingManagement from './pages/BookingManagement';
import TheaterSchedule from './pages/TheaterSchedule';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentPage from './pages/PaymentPage';
import Profile from './pages/Profile'; // Import Profile page
import AdminPanel from './pages/AdminPanel'; // Import Admin Panel
import ShowtimeCalendar from './components/ShowtimeCalendar'; // Import Showtime Calendar
import AdminDashboard from './pages/AdminDashboard'; // Import Admin Dashboard

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Check if user is logged in
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route
          path="/booking-management"
          element={
            <ProtectedRoute>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/theater-schedule" element={<TheaterSchedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ShowtimeCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="p-4 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;