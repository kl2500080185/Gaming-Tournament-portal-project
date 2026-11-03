import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Auth({ mode, notify }) {
  const isSignup = mode === 'signup';
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', role: 'Player' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const target = location.state?.from || '/dashboard';
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (isSignup) {
      if (values.name.trim().length < 2) return setError('Please enter your name (at least 2 characters).');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter a valid email address.');
      if (values.password.length < 6) return setError('Your password must be at least 6 characters.');
      if (values.password !== values.confirm) return setError('Those passwords don’t match yet.');
      const result = signup({ name: values.name.trim(), email: values.email.trim(), password: values.password, role: values.role });
      if (!result.ok) return setError(result.message);
    } else {
      const result = login(values.email.trim(), values.password, values.role);
      if (!result.ok) return setError(result.message);
    }
    notify(isSignup ? 'Your demo account is ready. Welcome to the arena!' : 'You’re signed in. Your arena is ready.');
    navigate(target, { replace: true });
  };
  const useDemo = (role) => {
    setValues((current) => ({ ...current, role, email: role === 'Admin' ? 'admin@demo.com' : 'player@demo.com', password: role === 'Admin' ? 'admin123' : 'player123' }));
    setError('');
  };
  return <div className="auth-page page-wrap"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link><div className="auth-layout"><div className="auth-intro"><div className="eyebrow"><span className="pulse-dot" /> YOUR ARENA STARTS HERE</div><h1>{isSignup ? <>A new season.<br /><span>A new you.</span></> : <>Welcome back<br /><span>to the arena.</span></>}</h1><p>{isSignup ? 'Build your player profile, find your squad, and get ready to compete.' : 'Your next match is closer than you think. Sign in to pick up where you left off.'}</p><div className="auth-promise"><ShieldCheck size={18} /><span><strong>Demo-only authentication</strong><small>Credentials stay in this browser. Not production secure.</small></span></div></div><form className="auth-card" onSubmit={submit} noValidate><span className="auth-card-mark"><Zap size={18} fill="currentColor" /></span><div className="eyebrow muted-eyebrow">{isSignup ? 'JOIN THE COMMUNITY' : 'GOOD TO HAVE YOU BACK'}</div><h2>{isSignup ? 'Create your account' : 'Sign in'}</h2><p>{isSignup ? 'A few details and you’re in.' : 'Pick your role, then enter your demo credentials.'}</p>
    {isSignup && <label>Full name<input autoComplete="name" value={values.name} onChange={update('name')} placeholder="e.g. Alex Morgan" required /></label>}
    <label>Email address<input autoComplete="email" type="email" value={values.email} onChange={update('email')} placeholder="you@example.com" required /></label>
    <label>Password<span className="password-field"><input autoComplete={isSignup ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} value={values.password} onChange={update('password')} placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
    {isSignup && <label>Confirm password<input autoComplete="new-password" type="password" value={values.confirm} onChange={update('confirm')} placeholder="Re-enter your password" required /></label>}
    <fieldset className="role-picker"><legend>{isSignup ? 'I’m joining as a' : 'Sign in as'}</legend>{['Player', 'Admin'].map((role) => <label key={role} className={values.role === role ? 'role-option selected' : 'role-option'}><input type="radio" name="role" value={role} checked={values.role === role} onChange={update('role')} /><span>{role === 'Player' ? '🎮' : '⚙️'} {role}</span></label>)}</fieldset>
    {error && <div role="alert" className="form-error">{error}</div>}
    <button className="button button-primary button-full button-large" type="submit">{isSignup ? 'Create demo account' : 'Enter the arena'}<ArrowRight size={17} /></button>
    {!isSignup && <div className="demo-accounts"><div><strong>Quick-fill demo accounts</strong><span>Player: player@demo.com / player123</span><span>Admin: admin@demo.com / admin123</span></div><div className="demo-fill-actions"><button type="button" onClick={() => useDemo('Player')}>Player</button><button type="button" onClick={() => useDemo('Admin')}>Admin</button></div></div>}
    <div className="auth-switch">{isSignup ? 'Already have an account?' : 'New to the portal?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create account'}</Link></div>
    <div className="demo-disclaimer"><ShieldCheck size={14} /> Demonstration only · No real payment processing</div>
  </form></div></div>;
}
