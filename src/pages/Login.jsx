import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST to our new admin auth route
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.success && data.data.token) {
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_info', JSON.stringify(data.data.admin));
        
        // Force reload to update token in api interceptor and navigate
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}>
            Welcome back.
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
              EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px',
                  backgroundColor: '#f1f5f9',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="admin@freshsabjihub.com"
                onFocus={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.borderColor = '#3b82f6'; }}
                onBlur={(e) => { e.target.style.backgroundColor = '#f1f5f9'; e.target.style.borderColor = 'transparent'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px',
                  backgroundColor: '#f1f5f9',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="••••••••"
                onFocus={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.borderColor = '#3b82f6'; }}
                onBlur={(e) => { e.target.style.backgroundColor = '#f1f5f9'; e.target.style.borderColor = 'transparent'; }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '8px', 
              marginTop: '8px',
              padding: '16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
            onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.2)'; }}
            onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.15)'; }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
