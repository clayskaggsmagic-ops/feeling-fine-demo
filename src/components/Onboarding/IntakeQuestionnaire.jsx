import React, { useState } from 'react';

const IntakeQuestionnaire = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        healthGoals: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            onSubmit(formData);
        }
    };

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 className="text-center mb-2">Member Profile</h2>
            <p className="text-center mb-2 text-secondary">Tell us a bit about yourself to personalize your experience.</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-1">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
                        placeholder="John Doe"
                    />
                </div>

                <div className="mb-1">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
                        placeholder="john@example.com"
                    />
                </div>

                <div className="mb-1">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
                        placeholder="Optional"
                    />
                </div>

                <div className="mb-2">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary Health Goal</label>
                    <select
                        name="healthGoals"
                        value={formData.healthGoals}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">Select a goal...</option>
                        <option value="energy">Increase Energy</option>
                        <option value="weight">Weight Management</option>
                        <option value="stress">Reduce Stress</option>
                        <option value="sleep">Better Sleep</option>
                        <option value="longevity">Healthy Aging</option>
                    </select>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Complete Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IntakeQuestionnaire;
