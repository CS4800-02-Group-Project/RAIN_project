import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CalendarProvider } from '../context/CalendarContext';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';

const Layout = () => {
    return (
        <>
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
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Route>
                </Routes>
            </CalendarProvider>
        </Router>
    );
}
