import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../utils/customFetch';

export default function Login() {
  const [currentView, setCurrentView] = useState('signin'); 
  const [role, setRole] = useState('Attendee');
  const [showPassword, setShowPassword] = useState(false);
  
  // State input dan error terpisah untuk email dan password
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setIsLoading(true);

    try {
      const response = await customFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput
        })
      });

      if (response && response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userRole', response.user?.role || 'admin');
        localStorage.setItem('userData', JSON.stringify(response.user));

        if (response.user?.role === 'admin' || response.user?.role === 'organizer') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/Home', { replace: true });
        }
      } else {
        setPasswordError(response?.message || 'Email atau Password salah!');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setPasswordError(err.message || 'Email atau Password salah!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {currentView === 'signin' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={titleStyle}>
                Welcome NEXA <span style={{ color: '#8b5cf6' }}>EVENT</span>
              </h1>
              <p style={subtitleStyle}>Access your tickets & events</p>
            </div>

            <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Input Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{ 
                    ...inputStyle, 
                    borderColor: emailError ? '#ef4444' : '#cbd5e1' 
                  }} 
                />
                {emailError && <span style={errorTextStyle}>{emailError}</span>}
              </div>

              {/* Input Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    required 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ 
                      ...inputStyle, 
                      paddingRight: '38px',
                      borderColor: passwordError ? '#ef4444' : '#cbd5e1' 
                    }} 
                  />
                
                  <span 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      )}
                    </svg>
                  </span>
                </div>
                {passwordError && <span style={errorTextStyle}>{passwordError}</span>}
              
                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <span 
                    onClick={() => setCurrentView('forgot')} 
                    style={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Forgot password?
                  </span>
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ ...buttonStyle, marginTop: '4px', opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'Checking...' : 'Sign-in'}
              </button>
            </form>

            {/* Divider */}
            <div style={dividerContainerStyle}>
              <span style={dividerLineStyle}></span>
              <span style={dividerTextStyle}>Or continue with</span>
              <span style={dividerLineStyle}></span>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <button style={socialBtnStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 11.76s.43 3.63 1.18 5.15l4.09-2.67z"/>
                  <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </button>
              <button style={socialBtnStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 5.31c.57-.69.96-1.65.86-2.61-.84.04-1.85.56-2.45 1.25-.53.6-1 1.56-.91 2.5 0.94.07 1.92-.47 2.5-1.14z"/>
                </svg>
              </button>
              <button style={socialBtnStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Don't have an account?{' '}
              <span onClick={() => setCurrentView('signup')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>
                Sign-up
              </span>
            </p>
          </div>
        )}

        {currentView === 'signup' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h1 style={titleStyle}>
                Welcome NEXA <span style={{ color: '#8b5cf6' }}>EVENT</span>
              </h1>
              <p style={subtitleStyle}>Access your tickets & events</p>
              
              <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '3px', marginTop: '14px', backgroundColor: '#ffffff' }}>
                <button 
                  type="button"
                  onClick={() => setRole('Attendee')}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
                    backgroundColor: role === 'Attendee' ? '#2563eb' : 'transparent',
                    color: role === 'Attendee' ? '#fff' : '#64748b',
                    fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  Attendee
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('Organizer')}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
                    backgroundColor: role === 'Organizer' ? '#2563eb' : 'transparent',
                    color: role === 'Organizer' ? '#fff' : '#64748b',
                    fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  Organizer
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Registrasi Berhasil!'); setCurrentView('signin'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input type="text" placeholder="Enter your name" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="Enter your email" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" placeholder="Enter your password" required style={inputStyle} />
              </div>

              <button type="submit" style={{ ...buttonStyle, marginTop: '2px' }}>Sign-up</button>
            </form>

            <div style={dividerContainerStyle}>
              <span style={dividerLineStyle}></span>
              <span style={dividerTextStyle}>Or continue with</span>
              <span style={dividerLineStyle}></span>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Already have an account?{' '}
              <span onClick={() => setCurrentView('signin')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>
                Sign-in
              </span>
            </p>
          </div>
        )}

        {currentView === 'forgot' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Forgot Password?</h2>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '6px' }}>No worries, we'll send you reset instructions.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Instruksi reset telah dikirim ke email.'); setCurrentView('signin'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="Enter your email" required style={inputStyle} />
              </div>
              <button type="submit" style={buttonStyle}>Reset Password</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span onClick={() => setCurrentView('signin')} style={{ fontSize: '0.825rem', color: '#64748b', cursor: 'pointer' }}>
                &larr; Back to <strong style={{ color: '#2563eb' }}>Sign-in</strong>
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Styling Konfigurasi yang diperbaiki posisi tangahnya (Centered)
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  minHeight: '100vh',
  backgroundColor: '#e5ebf3',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box',
  margin: 0,
  padding: 0
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  backgroundColor: '#ffffff',
  padding: '36px 32px',
  borderRadius: '20px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
  boxSizing: 'border-box',
  margin: 'auto'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#0f172a',
  margin: 0,
  letterSpacing: '-0.3px'
};

const subtitleStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  marginTop: '6px',
  margin: 0
};

const labelStyle = {
  display: 'block',
  fontSize: '0.775rem',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '5px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.85rem',
  boxSizing: 'border-box',
  outline: 'none',
  backgroundColor: '#f8fafc',
  transition: 'border-color 0.2s'
};

const errorTextStyle = {
  display: 'block',
  fontSize: '0.725rem',
  color: '#ef4444',
  marginTop: '4px',
  fontWeight: '500'
};

const buttonStyle = {
  width: '100%',
  padding: '11px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
};

const dividerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '18px 0',
  color: '#94a3b8',
  fontSize: '0.725rem'
};

const dividerLineStyle = {
  flex: 1,
  height: '1px',
  backgroundColor: '#e2e8f0'
};

const dividerTextStyle = {
  padding: '0 10px',
  textTransform: 'none'
};

const socialBtnStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
};