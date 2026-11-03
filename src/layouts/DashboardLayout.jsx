import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Bell, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Gamepad2, LayoutDashboard, LogOut, Menu, Settings, Shield, Swords, Trophy, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initials } from '../utils/format';

const playerLinks = [
  ['overview', 'Overview', LayoutDashboard], ['tournaments', 'My tournaments', Trophy], ['teams', 'My teams', Users], ['matches', 'Matches & results', Swords], ['leaderboard', 'Leaderboard', BarChart3], ['profile', 'My profile', Settings],
];
const adminLinks = [
  ['overview', 'Overview', LayoutDashboard], ['tournaments', 'Tournaments', Trophy], ['players', 'Players', Users], ['registrations', 'Registrations', ClipboardList], ['teams', 'Teams', Gamepad2], ['matches', 'Matches', Swords], ['leaderboard', 'Leaderboards', BarChart3], ['reports', 'Reports', BarChart3], ['settings', 'Settings', Settings],
];

export default function DashboardLayout({ children }) {
  const { currentUser, logout, registrations, notifications, markNotificationsRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'Admin';
  const links = isAdmin ? adminLinks : playerLinks;
  const myNotifications = notifications.filter((item) => item.userId === currentUser?.id).slice().reverse();
  const unreadCount = myNotifications.filter((item) => !item.read).length;
  const signOut = () => { logout(); navigate('/'); };
  return <div className={`dashboard-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand"><span className="brand-icon">A</span><span className="sidebar-brand-name">ARENA<span>.</span></span><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close dashboard menu"><X size={18} /></button></div>
      <div className="sidebar-season"><span className="season-icon"><Shield size={15} /></span><span><small>DEMO SEASON</small><strong>Season 01</strong></span></div>
      <div className="sidebar-section-label">{isAdmin ? 'MANAGEMENT' : 'PLAYER SPACE'}</div>
      <nav className="dashboard-nav" aria-label="Dashboard navigation">{links.map(([path, label, Icon]) => <NavLink key={path} to={`/dashboard/${path}`} onClick={() => setMobileOpen(false)} className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{path === 'registrations' && isAdmin && registrations.length > 0 && <b>{registrations.filter((item) => item.status !== 'Cancelled').length}</b>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="demo-sidebar-note"><span className="pulse-dot" /><span><strong>Demo mode</strong><small>Local data only</small></span></div><button className="sidebar-logout" onClick={signOut}><LogOut size={17} /><span>Sign out</span></button></div>
      <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
    </aside>
    {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu overlay" />}
    <div className="dashboard-main"><header className="dashboard-topbar"><button className="dashboard-menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open dashboard menu"><Menu size={20} /></button><div className="breadcrumb"><span>ARENA</span><i>/</i><strong>{links.find(([path]) => window.location.pathname.endsWith(`/${path}`))?.[1] || 'Overview'}</strong></div><div className="topbar-right"><span className="topbar-demo"><span className="pulse-dot" /> DEMO MODE</span><div className="notification-wrap"><button className="topbar-notice" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationsOpen}><Bell size={18} />{unreadCount > 0 && <i />}</button>{notificationsOpen && <div className="notification-popover"><div className="notification-heading"><span><strong>Notifications</strong><small>{unreadCount ? `${unreadCount} unread` : 'You’re all caught up'}</small></span>{unreadCount > 0 && <button onClick={() => markNotificationsRead(currentUser.id)}>Mark read</button>}</div>{myNotifications.length ? myNotifications.slice(0, 6).map((item) => <div className={`notification-item ${item.read ? '' : 'unread'}`} key={item.id}><i /><span><strong>{item.title}</strong><small>{item.detail}</small><time>{new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time></span></div>) : <div className="notification-empty">Registration and match updates will appear here.</div>}</div>}</div><div className="topbar-user"><span className="user-avatar">{initials(currentUser?.name)}</span><span><strong>{currentUser?.name}</strong><small>{isAdmin ? 'Administrator' : 'Player'}</small></span></div></div></header><main className="dashboard-content">{children}</main><footer className="dashboard-footer"><span>ARENA · STUDENT DEMO PORTAL</span><span><CircleHelp size={13} /> No real payments or production security</span></footer></div>
  </div>;
}
