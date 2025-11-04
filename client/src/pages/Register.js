import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      // Show success message for 3 seconds then redirect
      setSuccess('Registration successful! Please check your email to verify your account before logging in.');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">✏️</div>
          <h1 className="login-title">Progres Tracker</h1>
          <p className="login-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '12px',
              color: '#155724',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '24px',
              animation: 'slideUp 0.4s ease-out'
            }}>
              <span style={{fontSize: '1.2rem'}}>✅</span>
              <div>
                <div>{success}</div>
                <div style={{fontSize: '0.8rem', marginTop: '5px', opacity: 0.8}}>
                  📧 Check your inbox (and spam folder!)
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="form-input"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, uppercase, lowercase, number"
              className="form-input"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="form-input"
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || success}
          >
            {loading ? 'Creating account...' : success ? 'Redirecting to login...' : 'Create Account'}
          </button>
        </form>

        <div className="login-footer">
          <p className="register-link">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
