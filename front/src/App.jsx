import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login.jsx'
import { Route, Routes } from "react-router-dom";

function App() {

  const handleLoginClick = async () => {
    // Open the backend's /login route in a new tab
    const loginWindow = window.open('http://localhost:3000', '_blank');
    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 600));
    // Close the window
    loginWindow.close();
    window.location.href = '/info';
  }
  return (
    <>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a> */}
        <Routes>
          <Route path='/' element={
            <>
              <h1>Spotify Project</h1>
              <button className = "SpBtn" onClick={handleLoginClick}>Log in with Spotify</button>
            </>
          } />
          <Route path='/info' element= {<Login/>} />
        </Routes>
    </>
  )
}

export default App
