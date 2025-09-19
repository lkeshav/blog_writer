import { FormEvent, useState } from 'react';
import { useAppDispatch } from '../shared/hooks';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) navigate('/feed');
  }

  return (
    <div className="auth">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}


