import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Team from './pages/Team';
import News from './pages/News';
import Calendar from './pages/Calendar';
import History from './pages/History';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Tactics from './pages/Tactics';
import Statistics from './pages/Statistics';
import Navbar from './components/Navbar';

// Fix for special characters in player names
function normalizePlayerName(text) {
  if (!text) return '';
  
  // Direct handling for Jesse Höykinpuro
  if (text && typeof text === 'string' && text.includes('Jesse')) {
    return 'Jesse Höykinpuro';
  }
  
  return text;
}

// Make the function available globally for components to use
window.normalizePlayerName = normalizePlayerName;

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      <div className="pt-16"> {/* Add padding top to account for navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/news" element={<News />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tactics" element={<Tactics />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}