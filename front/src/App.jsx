import './App.css'
import { Link, Route, Routes } from "react-router-dom";
import React from 'react'
import Data from './Data'

function App() {
  const handleLoginClick =  () => {
    //not working
    const parentWindow = window.parent;
    // Close the parent window
    if (parentWindow) {
      parentWindow.close();
    }
    // Open the backend's /login route in a new tab
    const loginWindow = window.open('http://localhost:3000', '_blank');
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
