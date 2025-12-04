import React, { useRef, useEffect, useState } from 'react';

const AudioPlayer = ({ podcast, onClose }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, [podcast]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setDuration(total);
            setProgress((current / total) * 100);
        }
    };

    const handleProgressChange = (e) => {
        if (audioRef.current) {
            const newTime = (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(e.target.value);
        }
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="animate-slide-up" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--glass-border)',
            padding: '1rem',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'var(--color-brand-primary)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '1.2rem'
                    }}>
                        🎙️
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{podcast.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Now Playing</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        background: 'var(--color-brand-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', minWidth: '40px' }}>
                    {formatTime(audioRef.current?.currentTime)}
                </span>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleProgressChange}
                    style={{ flex: 1, accentColor: 'var(--color-brand-primary)' }}
                />

                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', minWidth: '40px' }}>
                    {formatTime(duration)}
                </span>
            </div>

            <audio
                ref={audioRef}
                src={podcast.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default AudioPlayer;
