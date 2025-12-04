import React, { useState } from 'react';

const ConsentForm = ({ onComplete }) => {
    const [agreements, setAgreements] = useState({
        dailyDoses: false,
        dailyDo: false,
        monitoring: false,
        reporting: false,
        waivers: false,
        info: false
    });

    const allAgreed = Object.values(agreements).every(Boolean);

    const handleChange = (key) => {
        setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const terms = [
        { key: 'dailyDoses', label: 'I agree to receive Daily Doses and other program communications.' },
        { key: 'dailyDo', label: 'I agree to perform the "Daily DO" assignments to the best of my ability.' },
        { key: 'monitoring', label: 'I consent to confidential monitoring of my program-related activities.' },
        { key: 'reporting', label: 'I accept the requirement to perform and report assignments (50% required for renewal).' },
        { key: 'waivers', label: 'I have read and sign the appropriate medical and legal waivers.' },
        { key: 'info', label: 'I will provide personal information needed for identification and security.' }
    ];

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h2 className="text-center mb-2">Terms & Conditions</h2>
            <p className="text-center mb-2 text-secondary">Please review and accept the following terms to proceed with your Provisional Membership.</p>

            <div className="mb-2">
                {terms.map((term) => (
                    <div key={term.key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <input
                            type="checkbox"
                            id={term.key}
                            checked={agreements[term.key]}
                            onChange={() => handleChange(term.key)}
                            style={{ marginTop: '0.3rem', marginRight: '0.8rem', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor={term.key} style={{ cursor: 'pointer', fontSize: '0.95rem' }}>{term.label}</label>
                    </div>
                ))}
            </div>

            <div className="text-center mt-2">
                <button
                    className="btn-primary"
                    disabled={!allAgreed}
                    onClick={onComplete}
                    style={{ opacity: allAgreed ? 1 : 0.5, cursor: allAgreed ? 'pointer' : 'not-allowed' }}
                >
                    I Accept & Continue
                </button>
            </div>
        </div>
    );
};

export default ConsentForm;
