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
            <style>{`
                .desktop-view { display: flex; }
                .mobile-view { display: none; }
                
                @media (max-width: 768px) {
                    .desktop-view { display: none !important; }
                    .mobile-view { display: block !important; }
                }
                
                input[type=range] {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--color-brand-secondary);
                    outline: none;
                    -webkit-appearance: none;
                }
                
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--color-brand-primary);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
            <h4 className="mb-1 text-center" style={{ lineHeight: '1.4' }}>How "Fine" are you feeling today?</h4>

            {/* Desktop View - Buttons */}
            <div className="desktop-view" style={{ justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto' }}>
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

            {/* Mobile View - Slider (compact, no number) */}
            <div className="mobile-view" style={{ maxWidth: '400px', margin: '0 auto', padding: '0 10px' }}>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={score || 5}
                    onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0.5rem auto 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <span>Not Fine</span>
                <span>Super Fine</span>
            </div>
        </div>
    );
};

export default FeelingFineInput;
