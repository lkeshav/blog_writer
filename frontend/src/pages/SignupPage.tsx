import { FormEvent, useState } from 'react';
import { useAppDispatch } from '../shared/hooks';
import { signup } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await dispatch(signup({ name, email, password }));
    if (signup.fulfilled.match(res)) navigate('/feed');
  }

  return (
    <div className="auth">
      <h1>Signup</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}


