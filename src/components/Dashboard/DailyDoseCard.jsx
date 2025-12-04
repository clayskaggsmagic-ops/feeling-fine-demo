import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

const DailyDoseCard = ({ message, date, onPrev, onNext }) => {
    const isMobile = useIsMobile();

    return (
        <div className="card" style={{
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))',
            color: 'white',
            textAlign: 'center',
            padding: isMobile ? '1rem' : '2rem',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: isMobile ? '0.75rem' : '1rem'
            }}>
                <button
                    onClick={onPrev}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        cursor: 'pointer',
                        opacity: 0.8,
                        padding: '0.5rem'
                    }}
                >
                    ←
                </button>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: isMobile ? '1.1rem' : '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '0.2rem',
                        lineHeight: '1.4'
                    }}>
                        {date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : 'Today'}'s <span style={{ whiteSpace: 'nowrap' }}>Daily Dose</span>

                    </h2>
                </div>

                <button
                    onClick={onNext}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        cursor: 'pointer',
                        opacity: 0.8,
                        padding: '0.5rem'
                    }}
                >
                    →
                </button>
            </div>

            <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? '1rem' : '1.4rem',
                fontStyle: 'italic',
                lineHeight: '1.5',
                marginTop: isMobile ? '0.5rem' : '1rem',
                padding: isMobile ? '0' : '0'
            }}>
                "{message}"
            </p>
        </div >
    );
};

export default DailyDoseCard;
