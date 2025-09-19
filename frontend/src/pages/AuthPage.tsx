import { useState, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../shared/hooks';
import { login, signup } from '../features/auth/authSlice';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (tab === 'signup') {
      if (password.length < 8) return setError('Password must be at least 8 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
      const res = await dispatch(signup({ name, email, password }));
      if (signup.fulfilled.match(res)) { setSuccess('Account created!'); navigate('/'); } else setError('Signup failed.');
    } else {
      const res = await dispatch(login({ email, password }));
      if (login.fulfilled.match(res)) { setSuccess('Logged in!'); navigate('/'); } else setError('Login failed.');
    }
  }

  // Initialize tab from route and keep URL in sync when switching tabs
  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setTab('signup');
    } else if (location.pathname.includes('login')) {
      setTab('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchTab(next: 'login' | 'signup') {
    setTab(next);
    navigate(next === 'login' ? '/login' : '/signup', { replace: true });
  }

  return (
    <div className="auth-screen">
      <div className="auth-split">
        <div className="auth-split__image" aria-hidden="true">
          <div className="overlay">
            <div className="overlay__title">Share Your Stories</div>
            <div className="overlay__subtitle">Inspire the world with your ideas.</div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-card__brand">
            <div className="logo">✍️</div>
            <div className="name">MERN Blog</div>
          </div>

          <div className="tabs">
            <button className={`tab ${tab === 'login' ? 'is-active' : ''}`} onClick={() => switchTab('login')}>Login</button>
            <button className={`tab ${tab === 'signup' ? 'is-active' : ''}`} onClick={() => switchTab('signup')}>Signup</button>
          </div>

          <div className="social">
            <button className="social__btn">
              <img alt="" src="https://www.svgrepo.com/show/475656/google-color.svg" />
              <span>Google</span>
            </button>
            <button className="social__btn">
              <img alt="" src="https://www.svgrepo.com/show/349375/github.svg" />
              <span>GitHub</span>
            </button>
            <button className="social__btn">
              <img alt="" src="https://www.svgrepo.com/show/475647/facebook-color.svg" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="divider"><span>or</span></div>

          <form className={`form ${tab}`} onSubmit={onSubmit}>
            {tab === 'signup' && (
              <div className="field">
                <label>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {tab === 'login' && (
                <div className="aux"><a href="#">Forgot Password?</a></div>
              )}
            </div>
            {tab === 'signup' && (
              <div className="field">
                <label>Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
              </div>
            )}
            {error && <div className="alert alert--error">{error}</div>}
            {success && <div className="alert alert--success">{success}</div>}
            <button type="submit" className="btn btn--primary">{tab === 'login' ? 'Login' : 'Create Account'}</button>
          </form>

          <div className="terms">By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy</a>.</div>
        </div>
      </div>
    </div>
  );
}


