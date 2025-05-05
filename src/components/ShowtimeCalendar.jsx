import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { fetchTheaterSchedules } from '../services/api';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { FaSpinner, FaCalendarAlt, FaMoneyBillWave, FaTheaterMasks, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ShowtimeCalendar.css'; // Custom CSS for calendar

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ShowtimeCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week');

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        setLoading(true);
        const schedules = await fetchTheaterSchedules();
        
        const formattedEvents = schedules.flatMap((schedule) =>
          schedule.showtimes.map((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            const eventDate = new Date();
            eventDate.setHours(hours, minutes, 0, 0);
            
            return {
              id: `${schedule._id}-${time}`,
              title: (
                <div className="p-1">
                  <div className="font-bold truncate">{schedule.name}</div>
                  <div className="flex items-center text-sm">
                    <FaMoneyBillWave className="mr-1 text-green-500" />
                    <span>${schedule.seatPrice}</span>
                  </div>
                </div>
              ),
              start: eventDate,
              end: addHours(eventDate, 2), // 2-hour duration
              theater: schedule.name,
              price: schedule.seatPrice,
              allDay: false,
            };
          })
        );
        
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        console.error('Error loading showtimes:', err);
        setError('Failed to load showtimes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, []);

  const handleSelectEvent = (event) => {
    alert(`Selected: ${event.theater} at ${format(event.start, 'h:mm a')}\nPrice: $${event.price}`);
  };

  const handleNavigate = (date) => {
    setSelectedDate(date);
  };

  const customDayPropGetter = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return {
        className: 'today-cell',
        style: {
          backgroundColor: '#f0f9ff',
          borderLeft: '3px solid #3b82f6',
        },
      };
    }
    return {};
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.theater.includes('IMAX') ? '#6366f1' : 
                          event.theater.includes('Premium') ? '#10b981' : '#3b82f6';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        padding: '2px',
      },
    };
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading showtimes...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-red-500 p-4"
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
        <div className="flex items-center mb-4 md:mb-0">
          <FaCalendarAlt className="text-2xl text-blue-500 mr-3" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Showtime Calendar</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setView('day')}
            className={`px-3 py-1 rounded-lg ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Day
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 rounded-lg ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 rounded-lg ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          onNavigate={handleNavigate}
          date={selectedDate}
          view={view}
          onView={setView}
          dayPropGetter={customDayPropGetter}
          eventPropGetter={eventStyleGetter}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
          max={new Date(0, 0, 0, 23, 0, 0)} // 11 PM
          defaultView="week"
          toolbar={true}
          popup={true}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span>Standard</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-indigo-500 rounded mr-2"></div>
          <span>IMAX</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Premium</span>
        </div>
      </div>
    </motion.div>
  );
}

// Custom components
const CustomEvent = ({ event }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full p-1 overflow-hidden"
    >
      {event.title}
    </motion.div>
  );
};

const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
      <div className="flex space-x-2">
        <button
          onClick={() => onNavigate('PREV')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
      <h2 className="text-xl font-semibold">{label}</h2>
      <div></div> {/* Spacer */}
    </div>
  );
};

export default ShowtimeCalendar;