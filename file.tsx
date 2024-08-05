import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import Calendar from './Calendar';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // Options: 'month', 'week', 'day'

  return (
    <div>
      <CalendarHeader currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />
      <Calendar currentDate={currentDate} view={view} />
    </div>
  );
}

export default App;

import React from 'react';

function CalendarHeader({ currentDate, setCurrentDate, setView }) {
  const changeMonth = (event) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(event.target.value);
    setCurrentDate(newDate);
  };

  const changeYear = (event) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(event.target.value);
    setCurrentDate(newDate);
  };

  const changeView = (event) => {
    setView(event.target.value);
  };

  return (
    <div>
      <select onChange={changeView}>
        <option value="month">Month</option>
        <option value="week">Week</option>
        <option value="day">Day</option>
      </select>
      <select onChange={changeMonth}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      <input type="number" value={currentDate.getFullYear()} onChange={changeYear} />
    </div>
  );
}

export default CalendarHeader;

import React from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

function Calendar({ currentDate, view }) {
  switch (view) {
    case 'month':
      return <MonthView currentDate={currentDate} />;
    case 'week':
      return <WeekView currentDate={currentDate} />;
    case 'day':
      return <DayView currentDate={currentDate} />;
    default:
      return null;
  }
}

export default Calendar;

import React from 'react';

function MonthView({ currentDate }) {
  // Calculate the days of the month and render them
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div>
      <h3>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={index}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </div>
    </div>
  );
}

export default MonthView;

import React from 'react';

function WeekView({ currentDate }) {
  // Calculate the week based on the currentDate
  return (
    <div>
      <h3>Week View</h3>
      {/* Render week days */}
    </div>
  );
}

export default WeekView;


import React from 'react';

function DayView({ currentDate }) {
  return (
    <div>
      <h3>{currentDate.toDateString()}</h3>
      {/* Render day details */}
    </div>
  );
}

export default DayView;

import React, { createContext, useState } from 'react';

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => setEvents([...events, event]);
  const removeEvent = (id) => setEvents(events.filter(event => event.id !== id));

  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };


//year wise another code

import React from 'react';
import MonthGrid from './MonthGrid';

function YearView({ currentDate }) {
  const year = currentDate.getFullYear();

  return (
    <div>
      <h2>{year}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <MonthGrid key={i} month={i} year={year} />
        ))}
      </div>
    </div>
  );
}

export default YearView;

import React from 'react';

function MonthGrid({ month, year }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <div>
      <h4>{monthName}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {/* Render empty slots for the first row */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i} style={{ border: '1px solid #ccc', height: '20px' }}></div>
        ))}
        {/* Render days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div key={i} style={{ border: '1px solid #ccc', height: '20px' }}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;


import React, { useState } from 'react';
import YearView from './YearView';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div>
      <YearView currentDate={currentDate} />
    </div>
  );
}

export default App;


//day wise 
import React from 'react';
import './DayView.css';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

function DayView({ date, events }) {
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === date.toDateString();
  });

  return (
    <div className="day-view">
      <div className="header">
        <h2>{date.toDateString()}</h2>
        {/* Add navigation buttons for previous and next day */}
      </div>
      <div className="grid">
        {hours.map((hour, index) => (
          <div key={index} className="time-slot">
            <div className="hour-label">{hour}</div>
            <div className="events">
              {dayEvents
                .filter(event => new Date(event.start).getHours() === index)
                .map((event, idx) => (
                  <div key={idx} className="event">
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayView;


.day-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.grid {
  display: grid;
  grid-template-rows: repeat(24, auto);
  flex: 1;
  overflow-y: auto;
}

.time-slot {
  display: flex;
  border-bottom: 1px solid #eee;
  position: relative;
}

.hour-label {
  width: 60px;
  text-align: right;
  padding-right: 10px;
  border-right: 1px solid #ddd;
  position: absolute;
  left: 0;
  top: 0;
}

.events {
  margin-left: 70px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

.event {
  background: #e0e4ff;
  border: 1px solid #b0b5ff;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
}

import React, { useState } from 'react';
import DayView from './DayView';

const sampleEvents = [
  {
    id: 1,
    title: 'Meeting with team',
    start: new Date(2024, 7, 5, 9, 0),
    end: new Date(2024, 7, 5, 10, 0),
  },
  {
    id: 2,
    title: 'Lunch with Sarah',
    start: new Date(2024, 7, 5, 12, 0),
    end: new Date(2024, 7, 5, 13, 0),
  },
  // Add more events here
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  return (
    <div>
      <DayView date={currentDate} events={sampleEvents} />
      <div className="navigation">
        <button onClick={previousDay}>Previous Day</button>
        <button onClick={nextDay}>Next Day</button>
      </div>
    </div>
  );
}

export default App;


//week wise 

import React from 'react';
import DayColumn from './DayColumn';
import './WeekView.css';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

function WeekView({ currentDate, events }) {
  // Calculate the start of the week (assuming the week starts on Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div className="week-view">
      <div className="week-header">
        {daysOfWeek.map((date, index) => (
          <div key={index} className="day-header">
            {date.toDateString()}
          </div>
        ))}
      </div>
      <div className="week-grid">
        {daysOfWeek.map((date, index) => (
          <DayColumn key={index} date={date} events={events} hours={hours} />
        ))}
      </div>
    </div>
  );
}

export default WeekView;


import React from 'react';
import './DayColumn.css';

function DayColumn({ date, events, hours }) {
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === date.toDateString();
  });

  return (
    <div className="day-column">
      {hours.map((hour, index) => (
        <div key={index} className="time-slot">
          <div className="hour-label">{hour}</div>
          <div className="events">
            {dayEvents
              .filter(event => new Date(event.start).getHours() === index)
              .map((event, idx) => (
                <div key={idx} className="event">
                  {event.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DayColumn;


.week-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #ddd;
}

.day-header {
  text-align: center;
  padding: 10px;
  border-right: 1px solid #ddd;
  background: #f5f5f5;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  overflow-y: auto;
}

.time-slot {
  border-bottom: 1px solid #eee;
  position: relative;
  height: 60px; /* Adjust based on desired height */
}

.hour-label {
  width: 60px;
  position: absolute;
  left: 0;
  top: 0;
  text-align: right;
  padding-right: 10px;
  border-right: 1px solid #ddd;
}

.events {
  margin-left: 70px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

.event {
  background: #e0e4ff;
  border: 1px solid #b0b5ff;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}



import React, { useState } from 'react';
import WeekView from './WeekView';

const sampleEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2024, 7, 5, 9, 0),
    end: new Date(2024, 7, 5, 10, 0),
  },
  {
    id: 2,
    title: 'Lunch with Sarah',
    start: new Date(2024, 7, 6, 12, 0),
    end: new Date(2024, 7, 6, 13, 0),
  },
  // Add more events here
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  return (
    <div>
      <WeekView currentDate={currentDate} events={sampleEvents} />
      <div className="navigation">
        <button onClick={previousWeek}>Previous Week</button>
        <button onClick={nextWeek}>Next Week</button>
      </div>
    </div>
  );
}

export default App;


//year wise 

import React from 'react';
import MonthOverview from './MonthOverview';
import './YearView.css';

function YearView({ currentYear, events }) {
  return (
    <div className="year-view">
      <h1>{currentYear}</h1>
      <div className="months-grid">
        {Array.from({ length: 12 }, (_, month) => (
          <MonthOverview key={month} year={currentYear} month={month} events={events} />
        ))}
      </div>
    </div>
  );
}

export default YearView;

import React from 'react';
import './MonthOverview.css';

function MonthOverview({ year, month, events }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  // Filter events for the current month
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });

  return (
    <div className="month-overview">
      <h3>{monthName}</h3>
      <div className="month-grid">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={index} className="empty-slot"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const eventsForDay = monthEvents.filter(event => new Date(event.start).getDate() === day);

          return (
            <div key={dayIndex} className="day-cell">
              <div className="day-number">{day}</div>
              <div className="day-events">
                {eventsForDay.map(event => (
                  <div key={event.id} className="event-indicator">{event.title}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthOverview;
//1st css
.year-view {
  padding: 20px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

//2nd css
.month-overview {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.month-overview h3 {
  text-align: center;
  margin-bottom: 10px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.empty-slot,
.day-cell {
  border: 1px solid #ddd;
  min-height: 60px;
  position: relative;
  padding: 5px;
  box-sizing: border-box;
}

.day-number {
  font-size: 0.8em;
  font-weight: bold;
}

.day-events {
  margin-top: 5px;
}

.event-indicator {
  font-size: 0.75em;
  background-color: #e0e4ff;
  border: 1px solid #b0b5ff;
  border-radius: 3px;
  padding: 2px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


   import React, { useState } from 'react';
import YearView from './YearView';

const sampleEvents = [
  { id: 1, title: 'New Year Party', start: new Date(2024, 0, 1) },
  { id: 2, title: 'Project Deadline', start: new Date(2024, 3, 15) },
  // More sample events...
];

function App() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const previousYear = () => setCurrentYear(currentYear - 1);
  const nextYear = () => setCurrentYear(currentYear + 1);

  return (
    <div>
      <YearView currentYear={currentYear} events={sampleEvents} />
      <div className="navigation">
        <button onClick={previousYear}>Previous Year</button>
        <button onClick={nextYear}>Next Year</button>
      </div>
    </div>
  );
}

export default App;
