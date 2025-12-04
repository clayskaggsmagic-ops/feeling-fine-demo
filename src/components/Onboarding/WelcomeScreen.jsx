import React from 'react';

const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="card text-center animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 className="mb-2" style={{ color: 'var(--color-brand-primary)' }}>Welcome to Feeling Fine</h2>
            <p className="mb-2 text-secondary" style={{ fontSize: '1.1rem' }}>
                Your journey to a healthier, happier life begins here.
                Join our community and discover the power of small daily acts.
            </p>

            <div className="mb-2" style={{ textAlign: 'left', background: 'rgba(44, 122, 123, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 className="mb-1">What to expect:</h4>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-primary)' }}>
                    <li className="mb-1">Daily inspirational doses</li>
                    <li className="mb-1">Simple behavioral assignments (SmallActs)</li>
                    <li className="mb-1">Track your progress and feeling score</li>
                    <li>60-day free provisional trial</li>
                </ul>
            </div>

            <button className="btn-primary mt-2" onClick={onStart}>
                Start Your Journey
            </button>
        </div>
    );
};

export default WelcomeScreen;
