import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import Nav from './components/Nav'
import Home from './pages/Home'
import OperatorOnboard from './pages/OperatorOnboard'
import OperatorProfile from './pages/OperatorProfile'
import Discover from './pages/Discover'
import Login from './pages/Login'
import SafariAI from './pages/SafariAI'
import SoloMatch from './pages/SoloMatch'

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/operators/join" element={<OperatorOnboard />} />
        <Route path="/operators/:id" element={<OperatorProfile />} />
        <Route path="/ai" element={<SafariAI />} />
        <Route path="/solo" element={<SoloMatch />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
