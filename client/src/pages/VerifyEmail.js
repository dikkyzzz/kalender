import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    // Prevent double call in React StrictMode
    if (hasVerified.current) return;
    
    if (token) {
      hasVerified.current = true;
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      console.log('Verifying email with token...');
      
      const response = await fetch(`${API_URL}/auth/verify-email/${verificationToken}`);
      const data = await response.json();

      console.log('Verification response:', data);

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Countdown timer
        let timeLeft = 5;
        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            navigate('/login');
          }
        }, 1000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const email = prompt('Please enter your email address:');
      if (!email) {
        setResending(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            {status === 'verifying' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h1 className="login-title">Email Verification</h1>
          <p className="login-subtitle">
            {status === 'verifying' && 'Please wait...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Verification Failed'}
          </p>
        </div>

        <div className="login-form" style={{textAlign: 'center'}}>
          <div style={{
            padding: '20px',
            background: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#fff3cd',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <p style={{
              margin: 0,
              color: status === 'success' ? '#155724' : status === 'error' ? '#721c24' : '#856404',
              fontSize: '1rem'
            }}>
              {message}
            </p>
          </div>

          {status === 'success' && (
            <div>
              <p style={{color: '#155724', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px'}}>
                ✅ Verification Successful!
              </p>
              <p style={{color: '#666', fontSize: '1rem'}}>
                Redirecting to login page in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
              <Link 
                to="/login" 
                className="link" 
                style={{marginTop: '15px', display: 'inline-block'}}
              >
                Or click here to login now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div style={{marginTop: '20px'}}>
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="login-button"
                style={{marginBottom: '10px'}}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              
              <p style={{margin: '10px 0', color: '#666'}}>or</p>
              
              <Link to="/login" className="link">
                Back to Login
              </Link>
            </div>
          )}

          {status === 'verifying' && (
            <div style={{marginTop: '20px'}}>
              <div className="spinner" style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
