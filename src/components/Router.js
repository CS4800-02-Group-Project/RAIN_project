import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CalendarProvider } from '../context/CalendarContext';
import Navbar from './Navbar';
import InteractiveCalendar from './Calendar';
import PromptMenu from './PromptMenu';
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login"

const Layout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default function AppRouter() {
    return (
        <Router>
            <CalendarProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={
                            <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                                <InteractiveCalendar />
                                <PromptMenu />
                            </div>
                        } />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login/>} />
                    </Route>
                </Routes>
            </CalendarProvider>
        </Router>
    );
}
