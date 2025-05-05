import React, { createContext, useState, useContext } from 'react';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <CalendarContext.Provider value={{ selectedDate, setSelectedDate, events, setEvents, selectedEvent, setSelectedEvent }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}; 