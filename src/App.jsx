import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Summarizer from './components/Summarizer';
import ProtectedRoute from './components/ProtectedRoute';
import Pricing from './components/Pricing';
import Profile from './components/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/plans" element={<Pricing />} />
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <Summarizer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>

    );
}

export default App;
