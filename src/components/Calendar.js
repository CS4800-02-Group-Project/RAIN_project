import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useCalendar } from "../context/CalendarContext";

export default function InteractiveCalendar() {
    const { selectedDate, setSelectedDate, events, setEvents } = useCalendar();
    /* Hardcoded Testing */
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [events, setEvents] = useState({
    //     "2025-03-05": "Project Deadline",
    //     "2025-03-10": "Assignment Due",
    //     "2025-03-15": "Exam Date",
    // });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatDate = (dateStr) => {
        // Convert "Apr 23 at 11:59pm" to "2024-04-23"
        const months = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const [month, day] = dateStr.split(' ');
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${months[month]}-${day.padStart(2, '0')}`;
    };

    const handleOutlookLogin = () => {
        // Open the Outlook authentication window
        window.open('http://localhost:4999/login', '_blank');
        setIsLoading(true);
        console.log("polling");

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:4999/emails', {
                    credentials: 'include'  // Important for session cookies
                });
                
                if (response.ok) {
                    const data = await response.json();
                    clearInterval(pollInterval);
                    setIsLoading(false);
                    // Update events with the fetched data
                    if (data.assignments && data.assignments.length > 0) {
                        const newEvents = {};
                        data.assignments.forEach(assignment => {
                            const formattedDate = formatDate(assignment.due_date);
                            newEvents[formattedDate] = assignment.title;
                        });
                        console.log(newEvents);
                        setEvents(newEvents);
                    }
                } else if (response.status === 302) {
                    // Still waiting for authentication
                    console.log("Waiting for authentication...");
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setError(error.message);
            }
        }, 2000);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            if (events[dateStr]) {
                return <EventDot />;
            }
        }
        return null;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            if (events[dateStr]) {
                return 'has-event';
            }
        }
        return null;
    };
    
    return (
        <CalendarContainer>
            <StyledCalendar 
                onChange={setSelectedDate} 
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
            />
            <EventDetails>
                <h3>Selected Date: {selectedDate.toISOString().split('T')[0]}</h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>Error: {error}</p>
                ) : (
                    <div>
                        {events[selectedDate.toISOString().split('T')[0]] ? (
                            <p>{events[selectedDate.toISOString().split('T')[0]]}</p>
                        ) : (
                            "No events"
                        )}
                    </div>
                )}
            </EventDetails>
            <ButtonContainer>
                <OutlookButton onClick={handleOutlookLogin} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Sync with Outlook'}
                </OutlookButton>
            </ButtonContainer>
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
    padding: 37px;
`;

const StyledCalendar = styled(Calendar)`
    width: 100%;
    border: none;
    background: white;
    border-radius: 8px;

    .has-event {
        background-color:rgb(69, 201, 57); /* Highlight color for event days */
        color: black; /* Text color for better contrast */
        font-weight: bold; /* Make the text bold */
        border-radius: 50%; /* Make the highlight circular */
    }

    .react-calendar__tile--now {
        background: #ffff76;
    }

    .react-calendar__tile--active {
        background: #006edc;
        color: white;
    }
`;

const EventDot = styled.div`
    height: 8px;
    width: 8px;
    background-color: #0078d4;
    border-radius: 50%;
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
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

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
`;

const AddEventButton = styled.button`
    padding: 8px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const OutlookButton = styled(AddEventButton)`
    background-color: #0078d4;

    &:hover {
        background-color: #106ebe;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;
