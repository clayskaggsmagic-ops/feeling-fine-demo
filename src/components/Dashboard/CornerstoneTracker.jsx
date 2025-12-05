import React, { useState, useEffect } from 'react';
import { CORNERSTONE_CATEGORIES, SMALL_ACTS, DAY_FOCUS_MAPPING } from '../../data/models';
import useIsMobile from '../../hooks/useIsMobile';

const CornerstoneTracker = ({ date }) => {
    const isMobile = useIsMobile();
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [completedActs, setCompletedActs] = useState({});
    const [customActs, setCustomActs] = useState({}); // { categoryId: [ {id, text} ] }
    const [newActInputs, setNewActInputs] = useState({}); // { categoryId: string }
    const [showOthers, setShowOthers] = useState(false);

    const dateKey = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const focusedCategoryId = DAY_FOCUS_MAPPING[dayOfWeek];

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('feelingFineTracking') || '{}');
        const dayData = savedData[dateKey] || {};
        setCompletedActs(dayData.completedActs || {});

        // Load custom acts from storage (global, not per day)
        const savedCustomActs = JSON.parse(localStorage.getItem('feelingFineCustomActs') || '{}');
        setCustomActs(savedCustomActs);

        // Auto-expand the focused category
        setExpandedCategory(focusedCategoryId);
    }, [dateKey, focusedCategoryId]);

    const toggleCategory = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    const toggleAct = (categoryId, actId) => {
        const currentCategoryActs = completedActs[categoryId] || [];
        let newCategoryActs;

        if (currentCategoryActs.includes(actId)) {
            newCategoryActs = currentCategoryActs.filter(id => id !== actId);
        } else {
            newCategoryActs = [...currentCategoryActs, actId];
        }

        const newCompletedActs = {
            ...completedActs,
            [categoryId]: newCategoryActs
        };

        setCompletedActs(newCompletedActs);

        // Persist
        const savedData = JSON.parse(localStorage.getItem('feelingFineTracking') || '{}');
        const dayData = savedData[dateKey] || {};
        savedData[dateKey] = {
            ...dayData,
            completedActs: newCompletedActs
        };
        localStorage.setItem('feelingFineTracking', JSON.stringify(savedData));
    };

    const handleAddCustomAct = (categoryId) => {
        const text = newActInputs[categoryId];
        if (!text || !text.trim()) return;

        const newAct = {
            id: `custom_${categoryId}_${Date.now()}`,
            text: text.trim(),
            category: categoryId
        };

        const updatedCustomActs = {
            ...customActs,
            [categoryId]: [...(customActs[categoryId] || []), newAct]
        };

        setCustomActs(updatedCustomActs);
        localStorage.setItem('feelingFineCustomActs', JSON.stringify(updatedCustomActs));

        // Clear input
        setNewActInputs({ ...newActInputs, [categoryId]: '' });

        // Auto-check the new act
        toggleAct(categoryId, newAct.id);
    };

    const renderCategoryCard = (category, isFocused = false) => {
        const isExpanded = expandedCategory === category.id;
        const defaultActs = SMALL_ACTS[category.id] || [];
        const userActs = customActs[category.id] || [];
        const allActs = [...userActs, ...defaultActs]; // Show user acts first

        const checkedCount = (completedActs[category.id] || []).length;
        const isComplete = checkedCount > 0; // "At least one SmallAct" rule

        return (
            <div key={category.id} className="card" style={{
                padding: isMobile ? '0' : 'var(--spacing-md)',
                overflow: 'hidden',
                border: isComplete ? '1px solid var(--color-success)' : (isFocused ? '2px solid var(--color-brand-primary)' : '1px solid var(--glass-border)'),
                boxShadow: isFocused ? '0 4px 12px rgba(44, 122, 123, 0.15)' : 'none',
                marginBottom: '1rem'
            }}>
                <div
                    onClick={() => toggleCategory(category.id)}
                    style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isExpanded ? 'rgba(44, 122, 123, 0.05)' : 'transparent'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                        <div>
                            <h4 style={{ margin: 0, color: isFocused ? 'var(--color-brand-primary)' : 'inherit' }}>
                                {category.name} {isFocused && <span style={{ fontSize: '0.7rem', background: 'var(--color-brand-primary)', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: '8px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>TODAY'S FOCUS</span>}

                            </h4>
                            {!isMobile && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{category.description}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isComplete && <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Done</span>}
                        <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="animate-fade-in" style={{ padding: isMobile ? '0.75rem' : '1rem', borderTop: '1px solid var(--glass-border)' }}>
                        {/* Custom Act Input */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: isMobile ? '0.75rem' : '1rem' }}>
                            <input
                                type="text"
                                placeholder="Add your own..."
                                value={newActInputs[category.id] || ''}
                                onChange={(e) => setNewActInputs({ ...newActInputs, [category.id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAct(category.id)}
                                style={{ flex: 1, padding: isMobile ? '0.4rem' : '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e0', fontSize: '16px' }}
                            />
                            <button
                                onClick={() => handleAddCustomAct(category.id)}
                                className="btn-primary"
                                style={{ padding: isMobile ? '0.4rem 0.75rem' : '0.5rem 1rem', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
                            >
                                Add
                            </button>
                        </div>

                        <p style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', marginBottom: isMobile ? '0.5rem' : '1rem', color: 'var(--color-brand-primary)' }}>
                            Select at least one:
                        </p>

                        {isMobile ? (
                            /* Mobile: Horizontal swipeable container showing 4 tasks at a time */
                            <>
                                <div style={{
                                    display: 'flex',
                                    overflowX: 'auto',
                                    scrollSnapType: 'x mandatory',
                                    gap: '0.5rem',
                                    paddingBottom: '0.5rem',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none'
                                }} className="hide-scrollbar">
                                    {/* Group acts into pages of 4 */}
                                    {Array.from({ length: Math.ceil(allActs.length / 4) }).map((_, pageIndex) => (
                                        <div
                                            key={pageIndex}
                                            style={{
                                                flex: '0 0 100%',
                                                scrollSnapAlign: 'start',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            {allActs.slice(pageIndex * 4, (pageIndex + 1) * 4).map((act) => (
                                                <label key={act.id} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    cursor: 'pointer',
                                                    padding: '0.35rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: (completedActs[category.id] || []).includes(act.id) ? 'rgba(44, 122, 123, 0.1)' : 'rgba(255,255,255,0.5)',
                                                    border: (completedActs[category.id] || []).includes(act.id) ? '1px solid var(--color-brand-primary)' : '1px solid transparent'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={(completedActs[category.id] || []).includes(act.id)}
                                                        onChange={() => toggleAct(category.id, act.id)}
                                                        style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                                    />
                                                    <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>{act.text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {allActs.length > 4 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem',
                                        marginTop: '0.5rem',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-secondary)'
                                    }}>
                                        <span>Swipe for more</span>
                                        <span style={{ fontSize: '0.9rem' }}>→</span>
                                        <span style={{ marginLeft: '0.5rem' }}>
                                            {Array.from({ length: Math.ceil(allActs.length / 4) }).map((_, i) => (
                                                <span key={i} style={{
                                                    display: 'inline-block',
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: i === 0 ? 'var(--color-brand-primary)' : '#ccc',
                                                    marginLeft: '3px'
                                                }}></span>
                                            ))}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Desktop: Grid Layout */
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                                    {allActs.slice(0, 15).map((act) => (
                                        <label key={act.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            background: (completedActs[category.id] || []).includes(act.id) ? 'rgba(44, 122, 123, 0.1)' : 'rgba(255,255,255,0.5)',
                                            border: (completedActs[category.id] || []).includes(act.id) ? '1px solid var(--color-brand-primary)' : '1px solid transparent'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={(completedActs[category.id] || []).includes(act.id)}
                                                onChange={() => toggleAct(category.id, act.id)}
                                                style={{ width: '18px', height: '18px', flexShrink: 0 }}
                                            />
                                            <span style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>{act.text}</span>
                                        </label>
                                    ))}
                                </div>
                                {allActs.length > 15 && (
                                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                        + {allActs.length - 15} more available
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const focusedCategory = CORNERSTONE_CATEGORIES.find(c => c.id === focusedCategoryId);
    const otherCategories = CORNERSTONE_CATEGORIES.filter(c => c.id !== focusedCategoryId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {focusedCategory && renderCategoryCard(focusedCategory, true)}

            <button
                onClick={() => setShowOthers(!showOthers)}
                className="btn-primary"
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                {showOthers ? 'Hide Other Cornerstones' : 'Show Other Cornerstones'}
                <span style={{ transform: showOthers ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {showOthers && (
                <div className="animate-fade-in">
                    {otherCategories.map(category => renderCategoryCard(category, false))}
                </div>
            )}
        </div>
    );
};

export default CornerstoneTracker;
