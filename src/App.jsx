import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginSignup from './employee/loginsignup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './employee/dashboard'
import AdminLogin from './admin/loginsignup'
import AdminDashboard from './admin/dashboard'

//mongodb+srv://y96997306_db_user:<db_password>@cluster0.6cmxif3.mongodb.net/?appName=Cluster0

function App() {
  

  

  return (
    <>
      
      <BrowserRouter>
        <Routes>
            <Route path='/user/Dashboard'  element={<Dashboard />}/>
            <Route path='/'  element={<LoginSignup />}/>
            <Route path='/Admin'  element={<AdminLogin />}/>
            <Route path='/Admin/Dashboard'  element={<AdminDashboard />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
