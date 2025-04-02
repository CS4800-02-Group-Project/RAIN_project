import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Calendar from "react-calendar";

// Default style from React-calendar library
import "react-calendar/dist/Calendar.css";

export default function InteractiveCalendar() {

    // allows for dates to be set, updates on date selected 
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({});

    // Format date as Year/Month/Day
    const formattedDate = date.toISOString().split("T")[0]; 

    // api/assignments
    useEffect(() => {
        fetch("http://localhost:3001/assignments") // Fetch from Express.js
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data.assignments.reduce((acc, event) => {
                    acc[event.due_date] = event.title;
                    return acc;
                }, {});
                setEvents(formattedEvents);
            })
            .catch(error => console.error("Error fetching assignments:", error));
    }, []);

    // on event a date is clicked
    const handleDateClick = (selectedDate) => {
        setDate(selectedDate);
    };

    // hardcoded example dates
    // const [events, setEvents] = useState({
    //     "2025-03-05": "Project Deadline",
    //     "2025-03-10": "Assignment Due",
    //     "2025-03-15": "Exam Date",
    // });

    return (
        <CalendarContainer>
            <StyledCalendar onChange={handleDateClick} value={date} />
            <EventDetails>
                <h3>Selected Date: {formattedDate}</h3>
                <p>{events[formattedDate] ? `${events[formattedDate]}` : "No events"}</p>
            </EventDetails>
        </CalendarContainer>
    );
}

const CalendarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: auto;
    border: 2px solid #ccc;
    border-radius: 8px;
    background: #E0E4EE;
    padding: 30px;
`;

const StyledCalendar = styled(Calendar)`
    width: 100%;
    border: none;
    background: white;
    border-radius: 8px;
`;

const EventDetails = styled.div`
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    background: white;
    padding: 10px;
    border-radius: 6px;
    width: 100%;
`;

const AddEventButton = styled.button`
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #4CAF50;
    color : white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`
