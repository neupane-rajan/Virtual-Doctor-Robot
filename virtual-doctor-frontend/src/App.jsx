import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './components/home/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProfilePage from './components/profile/ProfilePage';
import Chat from './components/chat/Chat';
import SymptomForm from './components/symptoms/SymptomForm';
import SymptomHistory from './components/symptoms/SymptomHistory';
import MedicationList from './components/medications/MedicationList';
import MedicationForm from './components/medications/MedicationForm';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentForm from './components/appointments/AppointmentForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Check if the token exists and set it
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header token={token} setToken={setToken} />
      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register setToken={setToken} /> : <Navigate to="/dashboard" />} />
          
          {/* Protected routes with Container */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Container className="py-4">
                <Dashboard />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Container className="py-4">
                <ProfilePage />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <Container className="py-4">
                <Chat />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/symptoms/report" element={
            <PrivateRoute>
              <Container className="py-4">
                <SymptomForm />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/symptoms/history" element={
            <PrivateRoute>
              <Container className="py-4">
                <SymptomHistory />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/medications" element={
            <PrivateRoute>
              <Container className="py-4">
                <MedicationList />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/medications/add" element={
            <PrivateRoute>
              <Container className="py-4">
                <MedicationForm />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/medications/edit/:id" element={
            <PrivateRoute>
              <Container className="py-4">
                <MedicationForm />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/appointments" element={
            <PrivateRoute>
              <Container className="py-4">
                <AppointmentList />
              </Container>
            </PrivateRoute>
          } />
          
          <Route path="/appointments/schedule" element={
            <PrivateRoute>
              <Container className="py-4">
                <AppointmentForm />
              </Container>
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;