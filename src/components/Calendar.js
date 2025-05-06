import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function InteractiveCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); 

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
    const checkAuthenticationSources = () => {
        console.log("=== Authentication Check ===");
        const sessionEmail = sessionStorage.getItem('userEmail');
        console.log("Session Storage email:", sessionEmail);

        const localEmail = localStorage.getItem('userEmail');
        console.log("Local Storage email:", localEmail);

        console.log("Current User State:", currentUser);

        const firebaseUser = auth.currentUser;
        console.log("Firebase Current User:", firebaseUser);

        return {
            sessionEmail,
            localEmail,
            currentUser,
            firebaseUser
        };
    };

    useEffect(() => {
        console.log("Calendar component mounted or user changed");
        const authInfo = checkAuthenticationSources();
        
        const userEmail = authInfo.sessionEmail || authInfo.localEmail || 
                         (authInfo.firebaseUser && authInfo.firebaseUser.email);
        
        if (userEmail) {
            console.log("Found user email:", userEmail);
            setCurrentUser(userEmail);
            fetchAssignmentsFromFirestore();
        } else {
            console.log("No user email found in any storage");
            setIsLoading(false);
        }
    }, [currentUser]); // Add currentUser as dependency

// Modify fetchAssignmentsFromFirestore to be more robust
const fetchAssignmentsFromFirestore = async () => {
    try {
        setIsLoading(true);
        const authInfo = checkAuthenticationSources();
        console.log("Auth info when fetching:", authInfo);

        const userEmail = authInfo.sessionEmail || authInfo.localEmail || 
                         (authInfo.firebaseUser && authInfo.firebaseUser.email);

        if (!userEmail) {
            console.error("No user email found in any storage");
            setError("User not authenticated");
            return;
        }

        console.log("Fetching assignments for:", userEmail);
        

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size); // Debug log

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const assignmentsRef = collection(userDoc.ref, 'assignments');
            const assignmentsSnapshot = await getDocs(assignmentsRef);
            console.log("Found assignments:", assignmentsSnapshot.size); // Debug log

            const newEvents = {};
            assignmentsSnapshot.forEach(doc => {
                const assignment = doc.data();
                console.log("Processing assignment:", assignment); // Debug log
                
                if (assignment.due_date) {
                    const formattedDate = formatDate(assignment.due_date);
                    console.log(`Formatting date ${assignment.due_date} to ${formattedDate}`); // Debug log
                    
                    if (formattedDate) {
                        newEvents[formattedDate] = assignment.title;
                    }
                }
            });

            console.log("Setting events:", newEvents); // Debug log
            setEvents(newEvents);
        } else {
            console.log("No user document found for email:", userEmail); // Debug log
        }
    } catch (error) {
        console.error('Error fetching assignments:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};
const handleOutlookLogin = () => {
    window.open('http://localhost:4999/login', '_blank');
    setIsLoading(true);
    console.log("Starting Outlook login process");

    const pollInterval = setInterval(async () => {
        try {
            const response = await fetch('http://localhost:4999/emails', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Received data from Outlook:", data);
                
                clearInterval(pollInterval);
                setIsLoading(false);
                
                // Modified section
                if (data.user_email) {
                    console.log("Storing user email:", data.user_email);
                    sessionStorage.setItem('userEmail', data.user_email);
                    setCurrentUser(data.user_email);
                }

                // // Then fetch assignments from Firestore
                // if (data.status === "success") {
                //     await fetchAssignmentsFromFirestore();
                // }

                // Finally process any new assignments from Outlook
                if (data.assignments && data.assignments.length > 0) {
                    const newEvents = {};
                    data.assignments.forEach(assignment => {
                        const formattedDate = formatDate(assignment.due_date);
                        if (formattedDate) {
                            newEvents[formattedDate] = assignment.title;
                        }
                    });
                    console.log("Setting new events from Outlook:", newEvents);
                    setEvents(newEvents);
                }
            } else if (response.status === 302) {
                console.log("Waiting for authentication...");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error in polling:', error);
            setError(error.message);
            clearInterval(pollInterval);
            setIsLoading(false);
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
            {/* {currentUser && <UserInfo>Signed in as: {currentUser}</UserInfo>} */}
            {isLoading ? (
                <LoadingOverlay>Loading assignments...</LoadingOverlay>
            ) : (
                <>
                    <StyledCalendar 
                        onChange={setSelectedDate} 
                        value={selectedDate}
                        tileContent={tileContent}
                        tileClassName={tileClassName}
                    />
                    <EventDetails>
                        <h3>Selected Date: {selectedDate.toISOString().split('T')[0]}</h3>
                        {error ? (
                            <ErrorMessage>{error}</ErrorMessage>
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
                </>
            )}
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

const LoadingOverlay = styled.div`
    padding: 20px;
    text-align: center;
    background: white;
    border-radius: 8px;
    margin: 10px 0;
`;

const ErrorMessage = styled.p`
    color: red;
    margin: 10px 0;
`;

const UserInfo = styled.div`
    padding: 8px;
    margin-bottom: 10px;
    background: white;
    border-radius: 4px;
    text-align: center;
    width: 100%;
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
    display: none;
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
