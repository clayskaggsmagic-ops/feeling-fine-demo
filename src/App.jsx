import { useState, useEffect } from 'react'
import './App.css'
import WelcomeScreen from './components/Onboarding/WelcomeScreen'
import ConsentForm from './components/Onboarding/ConsentForm'
import IntakeQuestionnaire from './components/Onboarding/IntakeQuestionnaire'
import Dashboard from './components/Dashboard/Dashboard'

const NameScreen = ({ onContinue }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onContinue(name.trim());
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
        <p className="text-center mb-2 text-secondary">Welcome! What's your name?</p>

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

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [appState, setAppState] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  // Auto-authenticate if a cached user profile exists in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('feelingFineUser') !== null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('feelingFineUser');
    if (savedUser) {
      setUserProfile(JSON.parse(savedUser));
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem('feelingFineUser');
    localStorage.removeItem('feelingFineTracking');
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <NameScreen onContinue={(name) => {
      const profile = {
        name: name,
        email: "demo@feelingfine.com",
        joinDate: new Date().toISOString(),
        membershipType: 'provisional',
        healthGoals: 'energy'
      };
      setUserProfile(profile);
      localStorage.setItem('feelingFineUser', JSON.stringify(profile));
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
        {appState === 'dashboard' && <Dashboard user={userProfile} onLogout={handleReset} />}
      </main>
    </div>
  )
}

export default App
