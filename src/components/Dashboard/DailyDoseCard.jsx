import React from 'react';

const DailyDoseCard = ({ message, date, onPrev, onNext }) => {
    return (
        <div className="card" style={{
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))',
            color: 'white',
            textAlign: 'center',
            padding: '2rem',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <button
                    onClick={onPrev}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        opacity: 0.8
                    }}
                >
                    ←
                </button>

                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '0.2rem'
                    }}>
                        {date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : 'Today'}'s Daily Dose
                    </h2>
                </div>

                <button
                    onClick={onNext}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        opacity: 0.8
                    }}
                >
                    →
                </button>
            </div>

            <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontStyle: 'italic',
                lineHeight: '1.4',
                marginTop: '1rem'
            }}>
                "{message}"
            </p>
        </div >
    );
};

export default DailyDoseCard;
