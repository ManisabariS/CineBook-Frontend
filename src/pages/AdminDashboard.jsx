import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  FaTicketAlt,
  FaChartLine,
  FaChartPie,
  FaUsers,
  FaMoneyBillWave,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFilm, // Add this import for FaFilm
} from "react-icons/fa";
import { fetchBookingTrends, fetchSalesPerformance, fetchUserActivity } from '../services/api';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [bookingTrends, setBookingTrends] = useState(null);
  const [salesPerformance, setSalesPerformance] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const [bookingData, salesData, userData] = await Promise.all([
          fetchBookingTrends(dateRange.startDate, dateRange.endDate),
          fetchSalesPerformance(dateRange.startDate, dateRange.endDate),
          fetchUserActivity(dateRange.startDate, dateRange.endDate)
        ]);

        setBookingTrends(bookingData);
        setSalesPerformance(salesData);
        setUserActivity(userData);
        setError(null);
      } catch (err) {
        console.error('Error loading reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [dateRange]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange({
      startDate: start,
      endDate: end
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
        <p className="text-lg">Loading dashboard data...</p>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-500" /> Admin Dashboard
        </h1>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <DatePicker
              selectsRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateChange}
              maxDate={new Date()}
              className="border rounded p-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`px-4 py-2 font-medium ${activeTab === 'detailed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Detailed Reports
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaMoneyBillWave className="text-2xl" />}
            title="Total Revenue"
            value={`$${salesPerformance?.totalRevenue?.toLocaleString() || '0'}`}
            change={salesPerformance?.revenueChange}
            period={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
          />
          <StatCard
            icon={<FaTicketAlt className="text-2xl" />}
            title="Total Bookings"
            value={bookingTrends?.totalBookings?.toLocaleString() || '0'}
            change={bookingTrends?.bookingChange}
            period={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
          />
          <StatCard
            icon={<FaUsers className="text-2xl" />}
            title="Active Users"
            value={userActivity?.totalUsers?.toLocaleString() || '0'}
            change={userActivity?.userChange}
            period={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Trends */}
        <ChartCard
          title="Booking Trends"
          icon={<FaChartLine className="text-blue-500" />}
          dateRange={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
        >
          <Bar
            data={{
              labels: bookingTrends?.labels || [],
              datasets: [
                {
                  label: 'Bookings',
                  data: bookingTrends?.data || [],
                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1,
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.y} bookings`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
            height={300}
          />
        </ChartCard>

        {/* Sales Performance */}
        <ChartCard
          title="Revenue Breakdown"
          icon={<FaMoneyBillWave className="text-green-500" />}
          dateRange={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
        >
          <Doughnut
            data={{
              labels: salesPerformance?.labels || [],
              datasets: [
                {
                  label: 'Revenue',
                  data: salesPerformance?.data || [],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(244, 63, 94, 0.7)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
            height={300}
          />
        </ChartCard>

        {/* User Activity */}
        <ChartCard
          title="User Activity"
          icon={<FaUsers className="text-purple-500" />}
          dateRange={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
        >
          <Bar
            data={{
              labels: userActivity?.labels || [],
              datasets: [
                {
                  label: 'Active Users',
                  data: userActivity?.data || [],
                  backgroundColor: 'rgba(139, 92, 246, 0.7)',
                  borderColor: 'rgba(139, 92, 246, 1)',
                  borderWidth: 1,
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.y} active users`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
            height={300}
          />
        </ChartCard>

        {/* Top Movies */}
        <ChartCard
          title="Top Performing Movies"
          icon={<FaFilm className="text-yellow-500" />}
          dateRange={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
        >
          <div className="space-y-3">
            {salesPerformance?.topMovies?.map((movie, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-500">{index + 1}.</span>
                  <span className="truncate">{movie.title}</span>
                </div>
                <span className="font-semibold">${movie.revenue.toLocaleString()}</span>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-8">
                No movie data available
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}

// Reusable components
const StatCard = ({ icon, title, value, change, period }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-gray-500 flex items-center gap-2 mb-1">
            {icon} {title}
          </div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {change !== undefined && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400">{period}</div>
    </motion.div>
  );
};

const ChartCard = ({ title, icon, dateRange, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon} {title}
        </h3>
        <span className="text-xs text-gray-500">{dateRange}</span>
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default AdminDashboard;