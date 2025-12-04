import React, { useState, useEffect } from 'react';

const FeelingFineInput = ({ date }) => {
    const [score, setScore] = useState(null);
    const dateKey = date.toISOString().split('T')[0];

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('feelingFineTracking') || '{}');
        const dayData = savedData[dateKey] || {};
        setScore(dayData.feelingScore || null);
    }, [dateKey]);

    const handleScoreChange = (newScore) => {
        setScore(newScore);
        const savedData = JSON.parse(localStorage.getItem('feelingFineTracking') || '{}');
        const dayData = savedData[dateKey] || {};

        savedData[dateKey] = {
            ...dayData,
            feelingScore: newScore
        };

        localStorage.setItem('feelingFineTracking', JSON.stringify(savedData));
    };

    return (
        <div className="card">
            <h4 className="mb-1 text-center">How "Fine" are you feeling today?</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleScoreChange(num)}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid var(--color-brand-secondary)',
                            background: score === num ? 'var(--color-brand-primary)' : 'transparent',
                            color: score === num ? 'white' : 'var(--color-brand-primary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0.5rem auto 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <span>Not Fine</span>
                <span>Super Fine</span>
            </div>
        </div>
    );
};

export default FeelingFineInput;
