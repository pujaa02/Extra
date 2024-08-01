import React from 'react';

const YearView = ({ year, onMonthClick }) => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  return (
    <div className="year-view">
      {months.map((monthDate, index) => (
        <div key={index} className="month" onClick={() => onMonthClick(monthDate)}>
          {monthDate.toLocaleString('default', { month: 'long' })}
        </div>
      ))}
    </div>
  );
};

export default YearView;

import React from 'react';

const MonthView = ({ month, year, onDayClick, events }) => {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDate = startOfMonth.getDay() === 0 ? startOfMonth : new Date(year, month, 1 - startOfMonth.getDay());
  const endDate = endOfMonth.getDay() === 6 ? endOfMonth : new Date(year, month + 1, 6 - endOfMonth.getDay());

  const days = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return (
    <div className="month-view">
      {days.map((day, index) => (
        <div key={index} className={`day ${day.getMonth() !== month ? 'other-month' : ''}`} onClick={() => onDayClick(day)}>
          {day.getDate()}
          {events.filter(event => new Date(event.date).toDateString() === day.toDateString()).map((event, index) => (
            <div key={index} className="event">{event.title}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MonthView;

import React from 'react';

const WeekView = ({ startDate, onDayClick, events }) => {
  const days = Array.from({ length: 7 }, (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));

  return (
    <div className="week-view">
      {days.map((day, index) => (
        <div key={index} className="day" onClick={() => onDayClick(day)}>
          {day.toDateString()}
          {events.filter(event => new Date(event.date).toDateString() === day.toDateString()).map((event, index) => (
            <div key={index} className="event">{event.title}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeekView;

import React from 'react';

const DayView = ({ date, events }) => {
  return (
    <div className="day-view">
      <h2>{date.toDateString()}</h2>
      <div className="events">
        {events.map((event, index) => (
          <div key={index} className="event">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;


import React, { useState, useEffect } from 'react';
import YearView from './YearView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'year', 'month', 'week', 'day'
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Fetch events from the server for the current view and date
    // For simplicity, assuming a fetchEvents function is available
    fetchEvents(currentDate, view).then(setEvents);
  }, [currentDate, view]);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  const saveEvent = (event) => {
    // Save event to server and update state
    // Assuming saveEvent function is available
    saveEvent(event).then(() => {
      setEvents((prevEvents) => [...prevEvents, event]);
      closeModal();
    });
  };

  const renderView = () => {
    switch (view) {
      case 'year':
        return <YearView year={currentDate.getFullYear()} onMonthClick={(date) => { handleDateChange(date); handleViewChange('month'); }} />;
      case 'month':
        return <MonthView month={currentDate.getMonth()} year={currentDate.getFullYear()} onDayClick={(date) => { handleDateChange(date); handleViewChange('day'); }} events={events} />;
      case 'week':
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        return <WeekView startDate={startOfWeek} onDayClick={(date) => { handleDateChange(date); handleViewChange('day'); }} events={events} />;
      case 'day':
        return <DayView date={currentDate} events={events.filter(event => new Date(event.date).toDateString() === currentDate.toDateString())} />;
      default:
        return null;
    }
  };

  return (
    <div className="calendar-app">
      <header>
        <button onClick={() => handleViewChange('year')}>Year</button>
        <button onClick={() => handleViewChange('month')}>Month</button>
        <button onClick={() => handleViewChange('week')}>Week</button>
        <button onClick={() => handleViewChange('day')}>Day</button>
        <button onClick={() => openModal()}>New Event</button>
      </header>
      {renderView()}
      {modalVisible && <EventModal show={modalVisible} onClose={closeModal} onSave={saveEvent} event={selectedEvent} />}
    </div>
  );
};

export default CalendarApp;

****backend*****

  
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/calendar', { useNewUrlParser: true, useUnifiedTopology: true });

// Event Model
const Event = mongoose.model('Event', new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  user: String,
}));

// Routes
app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/events', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json(newEvent);
});

app.put('/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import React, { useState, useEffect } from 'react';
import DayCell from './DayCell';

const CalendarGrid = ({ month, year, events, onDayClick }) => {
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Calculate the days to display for the given month and year
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = [];

    // Logic to add days from previous and next month if needed
    // ...

    setDays(daysInMonth);
  }, [month, year]);

  return (
    <div className="calendar-grid">
      {days.map((day, index) => (
        <DayCell
          key={index}
          date={day.date}
          events={events.filter(event => event.date === day.date)}
          onClick={() => onDayClick(day.date)}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;


import React from 'react';

const DayCell = ({ date, events, onClick }) => {
  return (
    <div className="day-cell" onClick={onClick}>
      <span>{date.getDate()}</span>
      {events.map((event, index) => (
        <div key={index} className="event">
          {event.title}
        </div>
      ))}
    </div>
  );
};

export default DayCell;


import React, { useState } from 'react';

const EventModal = ({ show, onClose, onSave, event }) => {
  const [title, setTitle] = useState(event ? event.title : '');
  const [description, setDescription] = useState(event ? event.description : '');

  const handleSave = () => {
    // Validate and save the event
    onSave({ title, description });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{event ? 'Edit Event' : 'New Event'}</h2>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Event Title"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Event Description"
        />
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EventModal;
