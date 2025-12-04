import { useState, useEffect } from 'react'
import './App.css'
import WelcomeScreen from './components/Onboarding/WelcomeScreen'
import ConsentForm from './components/Onboarding/ConsentForm'
import IntakeQuestionnaire from './components/Onboarding/IntakeQuestionnaire'
import Dashboard from './components/Dashboard/Dashboard'

import { initializeGemini } from './services/GeminiService';

// Environment variables
// If .env is not working, paste your API key inside the quotes below:
const HARDCODED_API_KEY = "";
const GEMINI_API_KEY = "AIzaSyDPzMM38cupCylE2JDqhrTyHxTHqRB8D3k" || import.meta.env.VITE_GEMINI_API_KEY;
const ACCESS_PASSCODE = 'feelingfine2025';

const PasswordScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ACCESS_PASSCODE) {
      if (GEMINI_API_KEY !== "PASTE_YOUR_KEY_HERE") {
        initializeGemini(GEMINI_API_KEY);
        onUnlock(name);
      } else {
        setError('Setup Error: Please add your API Key to the code in App.jsx');
      }
    } else {
      setError('Incorrect Password');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdfbf7 0%, #e6fffa 100%)'
    }}>
      <div className="card animate-fade-in" style={{ maxWidth: '400px', width: '90%', padding: '2rem' }}>
        <h2 className="text-center mb-2" style={{ color: 'var(--color-brand-primary)' }}>Feeling Fine Demo</h2>
        <p className="text-center mb-2 text-secondary">Please enter the access password to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-2">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
              placeholder="Enter password"
            />
          </div>

          {error && <p style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Unlock Demo
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  // DEMO MODE: Default straight to dashboard
  const [appState, setAppState] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  // Check localStorage for existing auth session
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('feelingFineAuth') === 'true';
  });

  useEffect(() => {
    // Initialize Gemini if already authenticated
    if (isAuthenticated && GEMINI_API_KEY) {
      initializeGemini(GEMINI_API_KEY);
    }

    // Check for existing user, or create a mock one for the demo
    const savedUser = localStorage.getItem('feelingFineUser');
    if (savedUser) {
      setUserProfile(JSON.parse(savedUser));
    } else {
      // Create mock profile for demo
      const mockProfile = {
        name: "Demo User",
        email: "demo@feelingfine.com",
        joinDate: new Date().toISOString(),
        membershipType: 'provisional',
        healthGoals: 'energy'
      };
      localStorage.setItem('feelingFineUser', JSON.stringify(mockProfile));
      setUserProfile(mockProfile);
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem('feelingFineUser');
    localStorage.removeItem('feelingFineTracking');
    localStorage.removeItem('feelingFineAuth');
    // For demo, reset just reloads the page which will re-create the mock user
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <PasswordScreen onUnlock={(name) => {
      if (name) {
        const updatedProfile = { ...userProfile, name: name };
        setUserProfile(updatedProfile);
        localStorage.setItem('feelingFineUser', JSON.stringify(updatedProfile));
      }
      localStorage.setItem('feelingFineAuth', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="app-container">
      <header className="text-center mt-3 mb-2">
        <h1 style={{ color: 'var(--color-brand-primary)' }}>FEELING FINE</h1>
        <p className="text-secondary">Your daily dose of wellness</p>
      </header>

      <main className="container">
        {/* Onboarding skipped for demo */}
        {appState === 'dashboard' && <Dashboard user={userProfile} onLogout={handleReset} />}
      </main>
    </div>
  )
}

export default App
