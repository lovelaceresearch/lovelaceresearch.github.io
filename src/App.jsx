import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Prototypes from './pages/Prototypes';
import Publications from './pages/Publications';
import OpinionNotes from './pages/OpinionNotes';
import ReadingList from './pages/ReadingList';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prototypes" element={<Prototypes />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/opinion-notes" element={<OpinionNotes />} />
        <Route path="/reading-list" element={<ReadingList />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
