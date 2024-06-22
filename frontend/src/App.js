import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import EditProfilePage from './components/EditProfile';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/land" element={<LandingPage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
  );
}

export default App;
