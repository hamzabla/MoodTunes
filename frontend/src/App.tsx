// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoginPage from './components/pages/LoginPage';
import CallbackPage from './components/pages/CallbackPage';
import MoodPage from './components/pages/MoodPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route 
              path="/mood" 
              element={
                <ProtectedRoute>
                  <MoodPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;