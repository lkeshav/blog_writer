import { Link } from 'react-router-dom';
import { useAppSelector } from '../shared/hooks';

export default function LandingPage() {
  const user = useAppSelector(s => s.auth.user);
  return (
    <div className="landing">
      <nav className="landing__nav">
        <div className="brand">
          <span className="logo">✍️</span>
          <span className="name">Blog to Blog</span>
        </div>
        <ul className="links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/feed">Blogs</Link></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="cta">
          {user ? (
            <Link to="/profile" className="profile-chip" title={user.name}>
              <span className="avatar" aria-hidden>👤</span>
              <span className="label">{user.name}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Log in</Link>
              <Link to="/signup" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      <header className="hero">
        <div className="hero__content">
          <h1>Share Your Stories, Inspire the World</h1>
          <p>Write, discover, and connect with readers across the globe.</p>
          <div className="hero__actions">
            <Link to="/editor" className="btn">Start Writing</Link>
            <Link to="/feed" className="btn btn--ghost">Explore Blogs</Link>
          </div>
        </div>
      </header>

      <section className="featured" aria-labelledby="featured-title">
        <h2 id="featured-title">Featured Blogs</h2>
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="card">
              <div className="card__image" />
              <div className="card__body">
                <h3>Sample Blog Title {i + 1}</h3>
                <p>Short description of a compelling blog post that teases the content.</p>
                <Link to="/feed" className="btn btn--link">Read More →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="categories" className="categories" aria-labelledby="categories-title">
        <h2 id="categories-title">Trending Categories</h2>
        <div className="chips">
          {['Tech', 'Travel', 'Lifestyle', 'Food', 'Education', 'Health'].map(cat => (
            <Link key={cat} to="/feed" className="chip">{cat}</Link>
          ))}
        </div>
      </section>

      <section className="why" aria-labelledby="why-title">
        <h2 id="why-title">Why choose MERN Blog?</h2>
        <div className="grid grid--3">
          <div className="why__item">
            <h3>Simple & Fast</h3>
            <p>Start writing in seconds with a clean editor and instant publishing.</p>
          </div>
          <div className="why__item">
            <h3>Discoverable</h3>
            <p>Your stories reach readers via categories, tags, and search.</p>
          </div>
          <div className="why__item">
            <h3>Community</h3>
            <p>Follow authors, comment on posts, and build your audience.</p>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer__inner">
          <div>© {new Date().getFullYear()} MERN Blog</div>
          <div className="social">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:contact@example.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


