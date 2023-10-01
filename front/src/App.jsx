import './App.css'
import { Link, Route, Routes } from "react-router-dom";
import React from 'react'
import Data from './Data'

function App() {
  const handleLoginClick =  () => {
    window.location = 'http://localhost:3000';
  }
  return (
    <>
        <Routes>
          <Route path='/' element={
            <>
              <h1>Dive into your music history</h1>
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
