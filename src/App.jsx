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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<div className="pt-16"><Team /></div>} />
        <Route path="/news" element={<div className="pt-16"><News /></div>} />
        <Route path="/calendar" element={<div className="pt-16"><Calendar /></div>} />
        <Route path="/history" element={<div className="pt-16"><History /></div>} />
        <Route path="/contact" element={<div className="pt-16"><Contact /></div>} />
        <Route path="/admin" element={<div className="pt-16"><Admin /></div>} />
        <Route path="/tactics" element={<div className="pt-16"><Tactics /></div>} />
        <Route path="/statistics" element={<div className="pt-16"><Statistics /></div>} />
      </Routes>
    </div>
  );
}