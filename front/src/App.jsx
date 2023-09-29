import './App.css'
import { Link, Route, Routes } from "react-router-dom";
import React from 'react'
import Data from './Data'
function App() {

  const handleLoginClick = async () => {
    // Open the backend's /login route in a new tab
    const loginWindow = window.open('http://localhost:3000', '_blank');
    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 600));
    // Close the window
    loginWindow.close();
    window.location.href = '/data';
  }
  return (
    <>
        <Routes>
          <Route path='/' element={
            <>
              <h1>Spotify Project</h1>
              <button className = "SpBtn" onClick={handleLoginClick}>Log in with Spotify</button>
            </>
          } />
          <Route path='/data' element={
            <Data/>
          }/>
        </Routes>
    </>
  )
}

export default App
