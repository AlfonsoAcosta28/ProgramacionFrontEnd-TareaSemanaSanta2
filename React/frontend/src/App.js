import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainNavbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskManager from './components/projects/TaskManager/TaskList';
import CurrencyConverter from './components/projects/CurrencyConverter/CurrencyConverter';
import PasswordGenerator from './components/projects/PasswordGenerator/PasswordGenerator';
import SurveyManager from './components/projects/SurveyManager/SurveyManager';
import Calendar from './components/projects/Calendar/Calendar';
import Home from './components/pages/Home';
import CreateSurvey from './components/projects/SurveyManager/NewSurvey';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/tasks" element={
            <PrivateRoute>
              <TaskManager />
            </PrivateRoute>
          } />

          <Route path="/currency" element={
            <PrivateRoute>
              <CurrencyConverter />
            </PrivateRoute>
          } />

          <Route path="/password" element={
            <PrivateRoute>
              <PasswordGenerator />
            </PrivateRoute>
          } />

          <Route path="/surveys" element={
            <PrivateRoute>
              <SurveyManager />
            </PrivateRoute>
          } />


          <Route path="/survey/new" element={
            <PrivateRoute>
              < CreateSurvey/>
            </PrivateRoute>
          } />

          <Route path="/calendar" element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
