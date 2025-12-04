import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { getChatResponse } from '../../services/GeminiService';
import useIsMobile from '../../hooks/useIsMobile';

const Community = ({ user }) => {
    const [activeTab, setActiveTab] = useState('social');
    const isMobile = useIsMobile();
    const [chatFriend, setChatFriend] = useState(null); // The friend we are chatting with
    const [viewingProfile, setViewingProfile] = useState(null); // The friend whose profile we are viewing
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [webinars, setWebinars] = useState([
        { id: 1, title: "The Power of Small Acts", speaker: "Dr. Wellness", date: "Dec 5, 2025", time: "10:00 AM PST", registered: false },
        { id: 2, title: "Nutrition for Longevity", speaker: "Jane Doe, RD", date: "Dec 8, 2025", time: "2:00 PM PST", registered: false },
        { id: 3, title: "Sleep Hygiene Masterclass", speaker: "Sleep Lab Team", date: "Dec 12, 2025", time: "6:00 PM PST", registered: true },
    ]);

    const toggleWebinarRegistration = (webinarId) => {
        setWebinars(webinars.map(w =>
            w.id === webinarId ? { ...w, registered: !w.registered } : w
        ));
    };

    const podcasts = [
        { id: 4, title: "Secrets of Super Agers", duration: "Living Well Past 100", url: `${import.meta.env.BASE_URL}podcast.m4a` },
        { id: 5, title: "Rewire Your Brain", duration: "Neuroplasticity & Aging", url: `${import.meta.env.BASE_URL}neuroplasticity.m4a` },
    ];

    const friends = [
        {
            id: 1,
            name: "Sarah J.",
            status: "online",
            avatar: `${import.meta.env.BASE_URL}images/avatar_sarah.jpg`,
            bio: "Retired school teacher who loves gardening and baking. Believes that kindness is the secret ingredient to a happy life.",
            recentActivity: [
                { act: "Watered the garden", type: "standard", time: "2h ago" },
                { act: "Baked oatmeal cookies for neighbor", type: "custom", time: "4h ago" },
                { act: "Morning stretch routine", type: "standard", time: "6h ago" }
            ],
            weeklyChallenge: {
                prompt: "Take a picture of healthy food",
                image: `${import.meta.env.BASE_URL}images/meal_sarah_lofi.png`
            }
        },
        {
            id: 2,
            name: "Mike T.",
            status: "offline",
            avatar: `${import.meta.env.BASE_URL}images/avatar_mike.jpg`,
            bio: "Vietnam veteran and woodworking enthusiast. A bit grumpy before his morning coffee, but loyal to a fault.",
            recentActivity: [
                { act: "Built a birdhouse", type: "custom", time: "1h ago" },
                { act: "15 min brisk walk", type: "standard", time: "3h ago" },
                { act: "Called an old friend", type: "standard", time: "Yesterday" }
            ],
            weeklyChallenge: {
                prompt: "Take a picture of healthy food",
                image: `${import.meta.env.BASE_URL}images/meal_mike_lofi.png`
            }
        },
        {
            id: 3,
            name: "Emma W.",
            status: "online",
            avatar: `${import.meta.env.BASE_URL}images/avatar_emma.jpg`,
            bio: "Former jazz singer who still loves to hum a tune. Energetic, social, and always ready for a game of bingo.",
            recentActivity: [
                { act: "Attended choir practice", type: "custom", time: "30m ago" },
                { act: "Ate a healthy lunch", type: "standard", time: "2h ago" },
                { act: "Meditated for 10 mins", type: "standard", time: "5h ago" }
            ],
            weeklyChallenge: {
                prompt: "Take a picture of healthy food",
                image: `${import.meta.env.BASE_URL}images/meal_emma_lofi.png`
            }
        },
    ];

    const startChat = (friend) => {
        setChatFriend(friend);
        setViewingProfile(null);
        // Load saved chat history or start with greeting
        const savedHistory = localStorage.getItem(`chat_history_${friend.id}`);
        if (savedHistory) {
            setChatMessages(JSON.parse(savedHistory));
        } else {
            setChatMessages([
                { role: 'model', text: `Hi there! It's ${friend.name.split(' ')[0]}. How are you doing today?` }
            ]);
        }
    };

    const viewProfile = (friend) => {
        setViewingProfile(friend);
        setChatFriend(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: 'user', text: inputMessage };
        const newMessages = [...chatMessages, userMsg];
        setChatMessages(newMessages);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Convert history to Gemini format
            const history = chatMessages.map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));

            const responseText = await getChatResponse(chatFriend.name, inputMessage, history, user?.name || 'friend');

            const finalMessages = [...newMessages, { role: 'model', text: responseText }];
            setChatMessages(finalMessages);
            // Save chat history to localStorage
            localStorage.setItem(`chat_history_${chatFriend.id}`, JSON.stringify(finalMessages));
        } catch (error) {
            const errorMessages = [...newMessages, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }];
            setChatMessages(errorMessages);
            localStorage.setItem(`chat_history_${chatFriend.id}`, JSON.stringify(errorMessages));
        } finally {
            setIsTyping(false);
        }
    };

    if (chatFriend) {
        return (
            <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '60vh' : '80vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button onClick={() => setChatFriend(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem' }}>←</button>
                    {chatFriend.avatar.startsWith('http') || chatFriend.avatar.includes('/') ? (
                        <img src={chatFriend.avatar} alt={chatFriend.name} style={{ width: isMobile ? '35px' : '40px', height: isMobile ? '35px' : '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-brand-primary)' }} />
                    ) : (
                        <span style={{ fontSize: '1.5rem' }}>{chatFriend.avatar}</span>
                    )}
                    <div>
                        <h3 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.5rem' }}>{chatFriend.name}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>● Online</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '0.75rem' : '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', maxHeight: isMobile ? '250px' : '400px' }}>
                    {chatMessages.map((msg, i) => (
                        <div key={i} style={{
                            marginBottom: '0.6rem',
                            textAlign: msg.role === 'user' ? 'right' : 'left'
                        }}>
                            <div style={{
                                display: 'inline-block',
                                padding: isMobile ? '0.5rem 0.75rem' : '0.6rem 1rem',
                                borderRadius: '12px',
                                background: msg.role === 'user' ? 'var(--color-brand-primary)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                maxWidth: '85%',
                                textAlign: 'left',
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                            {chatFriend.name.split(' ')[0]} is typing...
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ flex: 1, padding: isMobile ? '0.6rem' : '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e0', fontSize: '16px' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.5rem' }}>Send</button>
                </form>
            </div>
        );
    }

    if (viewingProfile) {
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <button onClick={() => setViewingProfile(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem' }}>← Back</button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: isMobile ? '1rem' : '2rem', padding: isMobile ? '1rem' : '2rem', marginBottom: '1rem' }}>
                    {viewingProfile.avatar.startsWith('http') || viewingProfile.avatar.includes('/') ? (
                        <img src={viewingProfile.avatar} alt={viewingProfile.name} style={{ width: isMobile ? '80px' : '180px', height: isMobile ? '80px' : '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--color-brand-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0 }} />
                    ) : (
                        <div style={{ fontSize: isMobile ? '3rem' : '6rem', width: isMobile ? '80px' : '180px', height: isMobile ? '80px' : '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{viewingProfile.avatar}</div>
                    )}
                    <div style={{ textAlign: 'left', flex: 1 }}>
                        <h2 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem', fontSize: isMobile ? '1.5rem' : '2rem', lineHeight: 1.2 }}>{viewingProfile.name}</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontStyle: 'italic', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            "{viewingProfile.bio}"
                        </p>
                        <button className="btn-primary" onClick={() => startChat(viewingProfile)} style={{ width: isMobile ? '100%' : 'auto' }}>
                            Chat with {viewingProfile.name.split(' ')[0]}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', alignItems: 'flex-start' }}>
                    {viewingProfile.weeklyChallenge && (
                        <div style={{ flex: 1, width: '100%' }}>
                            <div className="card mb-2" style={{ padding: '1.5rem', height: '100%', border: '1px solid var(--color-brand-secondary)', boxShadow: '0 4px 15px rgba(44, 122, 123, 0.1)' }}>
                                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🥗</span> Weekly Challenge
                                </h3>
                                <div style={{ background: 'var(--glass-background)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.8rem' }}>
                                    <p style={{ margin: 0, fontWeight: '500', color: 'var(--color-brand-primary)', fontSize: '0.9rem' }}>
                                        Prompt: "{viewingProfile.weeklyChallenge.prompt}"
                                    </p>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={viewingProfile.weeklyChallenge.image}
                                        alt="Weekly Challenge Meal"
                                        className="nano-banana"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ flex: 1, width: '100%' }}>
                        <h3 className="mb-2">Today's Wins</h3>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {viewingProfile.recentActivity.map((activity, index) => (
                                <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                                    <div style={{
                                        fontSize: '1.2rem',
                                        width: '40px',
                                        height: '40px',
                                        background: activity.type === 'custom' ? 'var(--color-accent-light)' : 'var(--glass-background)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {activity.type === 'custom' ? '✨' : '✅'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{activity.act}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                            {activity.type === 'custom' ? 'Custom Act • ' : 'Standard Act • '} {activity.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: currentPlayingId ? '120px' : '0' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                {['social', 'podcasts', 'webinars'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                            fontWeight: activeTab === tab ? '600' : '400',
                            padding: '0.5rem 1rem',
                            textTransform: 'capitalize',
                            fontSize: '1rem'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'webinars' && (
                <div className="animate-fade-in">
                    <h3 className="mb-2">Upcoming Live Events</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {webinars.map(webinar => (
                            <div key={webinar.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.2rem', lineHeight: '1.4' }}>{webinar.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>with {webinar.speaker}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{webinar.date} • {webinar.time}</p>
                                </div>
                                <button
                                    className={webinar.registered ? "btn-secondary" : "btn-primary"}
                                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    onClick={() => toggleWebinarRegistration(webinar.id)}
                                >
                                    {webinar.registered ? "Registered ✓" : "Register"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'podcasts' && (
                <div className="animate-fade-in">
                    <h3 className="mb-2">Latest Episodes</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {podcasts.map(podcast => {
                            const isPlaying = currentPlayingId === podcast.id;
                            return (
                                <div key={podcast.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setCurrentPlayingId(podcast.id)}>
                                    <div style={{
                                        width: '50px', height: '50px', background: 'var(--color-brand-secondary)',
                                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                    }}>
                                        {isPlaying ? '⏸' : '▶'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem', lineHeight: '1.4' }}>{podcast.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{podcast.duration}</p>
                                    </div>
                                    <button style={{ background: 'none', color: 'var(--color-brand-primary)', fontSize: '1.5rem' }}>
                                        +
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {currentPlayingId && (
                <AudioPlayer
                    podcast={podcasts.find(p => p.id === currentPlayingId)}
                    onClose={() => setCurrentPlayingId(null)}
                />
            )}

            {activeTab === 'social' && (
                <div className="animate-fade-in">
                    <h3 className="mb-2">My Community</h3>
                    <div className="card mb-2" style={{ background: 'rgba(237, 137, 54, 0.1)', border: 'none' }}>
                        <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                            <strong>Weekly Challenge:</strong> Share a photo of your healthy meal! 🥗
                        </p>
                    </div>

                    <h4 className="mb-1">Friends</h4>
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        {friends.map(friend => (
                            <div key={friend.id} className="card" style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => viewProfile(friend)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {friend.avatar.startsWith('http') || friend.avatar.includes('/') ? (
                                        <img src={friend.avatar} alt={friend.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-brand-primary)' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.5rem' }}>{friend.avatar}</span>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{friend.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: friend.status === 'online' ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                                            ● {friend.status}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
