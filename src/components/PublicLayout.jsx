import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const signOut = () => { logout(); navigate('/'); close(); };
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" onClick={close}><span className="brand-icon"><Zap size={18} fill="currentColor" /></span><span>ARENA<span className="brand-dot">.</span></span></Link>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
        <nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/tournaments" onClick={close}>Tournaments</NavLink><NavLink to="/about" onClick={close}>About</NavLink><NavLink to="/faq" onClick={close}>FAQ</NavLink><NavLink to="/contact" onClick={close}>Contact</NavLink>
          <div className="nav-actions">{currentUser ? <><Link className="button button-quiet" to="/dashboard" onClick={close}>Dashboard</Link><button className="button button-primary small" onClick={signOut}>Log out</button></> : <><Link className="button button-quiet" to="/login" onClick={close}>Log in</Link><Link className="button button-primary small" to="/signup" onClick={close}>Get started</Link></>}</div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer"><div className="footer-main"><div><Link to="/" className="brand"><span className="brand-icon"><Zap size={18} fill="currentColor" /></span><span>ARENA<span className="brand-dot">.</span></span></Link><p>The next match is yours to win.</p></div><div className="footer-links"><Link to="/tournaments">Find tournaments</Link><Link to="/about">About</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link></div><span className="demo-caption">A student demonstration project · no real payments</span></div><div className="footer-bottom"><span>© 2026 Arena Tournament Portal</span><span>Play fair. Play together.</span></div></footer>
    </>
  );
}
