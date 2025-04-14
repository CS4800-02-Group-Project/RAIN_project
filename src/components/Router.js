import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CalendarProvider } from '../context/CalendarContext';
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login"

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
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Login/>} />
                    </Route>
                </Routes>
            </CalendarProvider>
        </Router>
    );
}
