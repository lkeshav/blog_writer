import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL as string;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const token = localStorage.getItem('token') || '';
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        setName(data.name || '');
        setBio(data.bio || '');
        setEmail(data.email || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    })();
  }, [token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API}/users/me`, { name, bio }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate('/');
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="profile__error">
          <h2>Please log in to view your profile</h2>
          <button onClick={() => navigate('/login')} className="btn btn--primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <header className="profile__header">
        <h1>Profile Settings</h1>
        <button onClick={handleLogout} className="btn btn--danger">
          Logout
        </button>
      </header>

      <div className="profile__content">
        <div className="profile__avatar">
          <div className="avatar">👤</div>
          <h2>{name || 'User'}</h2>
        </div>

        <form onSubmit={onSubmit} className="profile__form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              disabled
              className="disabled"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn--primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}


