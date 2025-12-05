import React, { useState, useEffect } from 'react';
import DailyDoseCard from './DailyDoseCard';
import CornerstoneTracker from './CornerstoneTracker';
import FeelingFineInput from './FeelingFineInput';
import WeeklyReport from '../Reporting/WeeklyReport';
import Community from '../Community/Community';

import { DAILY_DOSES } from '../../data/models';
import useIsMobile from '../../hooks/useIsMobile';

const Dashboard = ({ user, onLogout }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeView, setActiveView] = useState('home'); // 'home', 'community', 'report'
    const isMobile = useIsMobile();

    // Get a random dose based on the date (simple hash)
    const doseIndex = currentDate.getDate() % DAILY_DOSES.length;
    const dailyDose = DAILY_DOSES[doseIndex];

    const navItems = [
        { id: 'home', label: 'My Wellness', icon: '🏠' },
        { id: 'community', label: 'Community', icon: '👥' },
        { id: 'report', label: 'Report', icon: '📊' }
    ];

    const renderContent = () => {
        if (activeView === 'home') {
            return (
                <>
                    {/* Day Switcher for Demo */}
                    <DailyDoseCard
                        message={dailyDose}
                        date={currentDate}
                        onPrev={() => {
                            const newDate = new Date(currentDate);
                            newDate.setDate(currentDate.getDate() - 1);
                            setCurrentDate(newDate);
                        }}
                        onNext={() => {
                            const newDate = new Date(currentDate);
                            newDate.setDate(currentDate.getDate() + 1);
                            setCurrentDate(newDate);
                        }}
                    />
                    <div className="mt-1">
                        <FeelingFineInput date={currentDate} />
                    </div>
                    <div className="mt-1">
                        <CornerstoneTracker date={currentDate} />
                    </div>
                </>
            );
        }
        if (activeView === 'community') return <Community user={user} />;
        if (activeView === 'report') return <WeeklyReport user={user} />;
    };

    return (
        <>
            <div className={`animate-fade-in ${isMobile ? 'mobile-content-padding' : ''}`} style={{ paddingBottom: isMobile ? '90px' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', fontSize: isMobile ? '1rem' : '1.5rem', lineHeight: '1.4' }}>Hello, {user?.name || 'Member'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    </div>
                </div>

                {/* Desktop Navigation - Fixed at bottom */}
                {!isMobile && (
                    <div style={{
                        position: 'relative',
                        marginBottom: '2rem',
                        width: '100%',
                        background: 'white',
                        padding: '1rem 2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: activeView === item.id ? 'white' : 'transparent',
                                    color: activeView === item.id ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                                    fontWeight: activeView === item.id ? '600' : '400',
                                    boxShadow: activeView === item.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                    textTransform: 'capitalize',
                                    border: 'none'
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                {renderContent()}
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <div className="mobile-bottom-nav" style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                    zIndex: 9999
                }}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                                color: activeView === item.id ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                                fontSize: '0.7rem',
                                fontWeight: activeView === item.id ? '600' : '400',
                                gap: '2px',
                                padding: '0.25rem',
                                minWidth: '60px',
                                border: 'none',
                                opacity: activeView === item.id ? 1 : 0.7,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{
                                fontSize: '1.5rem',
                                transform: activeView === item.id ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.2s ease'
                            }}>{item.icon}</span>
                            <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Dashboard;
