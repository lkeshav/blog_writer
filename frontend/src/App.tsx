import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import PostPage from './pages/PostPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/editor/:id?" element={<EditorPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}


