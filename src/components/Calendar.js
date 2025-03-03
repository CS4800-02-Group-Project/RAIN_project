import React, { useState } from "react";
import styled from "styled-components";

import Calendar from "react-calendar";

// Default style from React-calendar library
import "react-calendar/dist/Calendar.css";

export default function InteractiveCalendar() {

    // allows for dates to be set 
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({
        "2025-03-05": "Project Deadline",
        "2025-03-10": "Assignment Due",
        "2025-03-15": "Exam Date",
    });

    // on event a date is clicked
    const handleDateClick = (selectedDate) => {
        setDate(selectedDate);
    };

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0]; 

    return (
        <CalendarContainer>
            <StyledCalendar onChange={handleDateClick} value={date} />
            <EventDetails>
                <h3>Selected Date: {formattedDate}</h3>
                <p>{events[formattedDate] ? `📌 ${events[formattedDate]}` : "No events"}</p>
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
    padding: 10px;
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

