import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_UPI_ID, initialState } from '../data/seed';
import { makeId } from '../utils/format';

const STORAGE_KEY = 'gtp-demo-v1';
const AppContext = createContext(null);

function normalizeUser(user = {}) {
  return {
    gameId: user.gameId || '',
    gameIds: user.gameIds || {},
    ...user,
  };
}

function normalizeTournament(tournament) {
  const seededTournament = initialState.tournaments.find((item) => item.id === tournament.id);
  return {
    paymentUpi: tournament.entryFee ? DEMO_UPI_ID : '',
    ...tournament,
    maxPlayers: tournament.maxPlayers ?? seededTournament?.maxPlayers ?? tournament.slots,
  };
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.tournaments) || !Array.isArray(saved.users)) return initialState;
    return {
      ...initialState,
      ...saved,
      tournaments: saved.tournaments.map(normalizeTournament),
      users: saved.users.map(normalizeUser),
    };
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(readState);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {
      console.error('Unable to persist demo portal data:', error);
    }
  }, [state]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const saved = JSON.parse(event.newValue);
          if (Array.isArray(saved.tournaments) && Array.isArray(saved.users)) {
            setState({
              ...initialState,
              ...saved,
              tournaments: saved.tournaments.map(normalizeTournament),
              users: saved.users.map(normalizeUser),
            });
          }
        } catch { /* Keep current valid in-memory state. */ }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = useCallback((email, password, role) => {
    const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password && item.role === role);
    if (!user) return { ok: false, message: 'We could not find a matching demo account. Check your details and role.' };
    setState((current) => ({ ...current, currentUser: user }));
    return { ok: true, user };
  }, [state.users]);

  const signup = useCallback(({ name, email, password, role }) => {
    if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: 'An account with this email already exists.' };
    const user = { id: makeId('user'), name, email, password, role, nickname: name.split(' ')[0], gameId: '', gameIds: {} };
    setState((current) => ({ ...current, users: [...current.users, user], currentUser: user }));
    return { ok: true, user };
  }, [state.users]);

  const logout = useCallback(() => setState((current) => ({ ...current, currentUser: null })), []);
  const updateUser = useCallback((updates) => {
    setState((current) => {
      const updated = { ...current.currentUser, ...updates };
      return { ...current, currentUser: updated, users: current.users.map((user) => user.id === updated.id ? updated : user) };
    });
  }, []);
  const saveTournament = useCallback((tournament) => setState((current) => ({
    ...current,
    tournaments: tournament.id
      ? current.tournaments.map((item) => item.id === tournament.id ? { ...item, ...tournament } : item)
      : [...current.tournaments, { ...tournament, id: makeId('tournament'), accent: 'violet', icon: '✦' }],
  })), []);
  const deleteTournament = useCallback((id) => setState((current) => ({
    ...current,
    tournaments: current.tournaments.filter((item) => item.id !== id),
    registrations: current.registrations.filter((item) => item.tournamentId !== id),
  })), []);
  const register = useCallback((tournamentId, gameId, paymentConfirmed = false) => {
    const user = state.currentUser;
    const tournament = state.tournaments.find((item) => item.id === tournamentId);
    if (!user || !tournament) return { ok: false, message: 'Sign in and select a valid tournament to continue.' };
    if (typeof gameId !== 'string' || gameId.trim().length < 2) return { ok: false, message: 'Enter a valid in-game ID before registering.' };
    if (state.registrations.some((item) => item.userId === user.id && item.tournamentId === tournamentId && item.status !== 'Cancelled')) return { ok: false, message: 'You are already registered for this tournament.' };
    if (tournament.deadline < new Date().toISOString().slice(0, 10)) return { ok: false, message: 'The registration deadline for this tournament has passed.' };
    const count = state.registrations.filter((item) => item.tournamentId === tournamentId && item.status !== 'Cancelled').length;
    if (count >= tournament.slots) return { ok: false, message: 'This tournament is full. Try another event.' };
    if (tournament.status !== 'Registration open') return { ok: false, message: 'Registration is not open for this tournament.' };
    if (tournament.entryFee > 0 && !tournament.paymentUpi?.trim()) return { ok: false, message: 'The admin has not added a UPI ID for this paid tournament yet.' };
    if (tournament.entryFee > 0 && !paymentConfirmed) return { ok: false, message: 'Confirm the demo payment step to continue.' };
    setState((current) => {
      const tournamentName = current.tournaments.find((item) => item.id === tournamentId)?.name || 'your tournament';
      const updatedUser = { ...user, gameId: gameId.trim(), gameIds: { ...(user.gameIds || {}), [tournament.game]: gameId.trim() } };
      return {
        ...current,
        users: current.users.map((item) => item.id === user.id ? updatedUser : item),
        currentUser: updatedUser,
        registrations: [...current.registrations, { id: makeId('reg'), userId: user.id, userName: user.name, tournamentId, gameId: gameId.trim(), status: 'Confirmed', payment: tournament.entryFee ? 'Demo confirmed' : 'Free', createdAt: new Date().toISOString() }],
        notifications: [
          ...current.notifications,
          { id: makeId('notification'), userId: user.id, title: 'Spot confirmed', detail: `You’re registered for ${tournamentName}.`, createdAt: new Date().toISOString(), read: false },
          ...current.users.filter((item) => item.role === 'Admin').map((admin) => ({ id: makeId('notification'), userId: admin.id, title: 'New tournament registration', detail: `${user.name} registered for ${tournamentName}.`, createdAt: new Date().toISOString(), read: false })),
        ],
      };
    });
    return { ok: true, message: tournament.entryFee ? 'Demo registration confirmed. No real payment was processed.' : 'You are in! Your registration is confirmed.' };
  }, [state]);
  const cancelRegistration = useCallback((registrationId) => setState((current) => ({
    ...current,
    registrations: current.registrations.map((item) => item.id === registrationId ? { ...item, status: 'Cancelled' } : item),
    notifications: [...current.notifications, ...current.registrations.filter((item) => item.id === registrationId).map((item) => ({ id: makeId('notification'), userId: item.userId, title: 'Registration cancelled', detail: `Your spot for ${current.tournaments.find((tournament) => tournament.id === item.tournamentId)?.name || 'a tournament'} was cancelled.`, createdAt: new Date().toISOString(), read: false }))],
  })), []);
  const updateRegistration = useCallback((registrationId, updates) => setState((current) => ({
    ...current,
    registrations: current.registrations.map((item) => item.id === registrationId ? { ...item, ...updates } : item),
    notifications: updates.status ? [...current.notifications, ...current.registrations.filter((item) => item.id === registrationId && item.status !== updates.status).map((item) => ({ id: makeId('notification'), userId: item.userId, title: `Registration ${updates.status.toLowerCase()}`, detail: `Your registration status for ${current.tournaments.find((tournament) => tournament.id === item.tournamentId)?.name || 'a tournament'} changed to ${updates.status.toLowerCase()}.`, createdAt: new Date().toISOString(), read: false }))] : current.notifications,
  })), []);
  const saveTeam = useCallback((team) => setState((current) => ({ ...current, teams: team.id ? current.teams.map((item) => item.id === team.id ? team : item) : [...current.teams, { ...team, id: makeId('team'), memberIds: [current.currentUser.id] }] })), []);
  const resetDemo = useCallback(() => setState(initialState), []);
  const addResult = useCallback((result) => setState((current) => ({
    ...current,
    results: [...current.results, { ...result, id: makeId('result') }],
    notifications: [...current.notifications, ...current.users.filter((user) => user.role === 'Player').map((user) => ({ id: makeId('notification'), userId: user.id, title: 'Tournament result published', detail: `${result.winnerName} won ${result.tournamentName}.`, createdAt: new Date().toISOString(), read: false }))],
  })), []);
  const markNotificationsRead = useCallback((userId) => setState((current) => ({
    ...current,
    notifications: current.notifications.map((item) => item.userId === userId ? { ...item, read: true } : item),
  })), []);

  const value = useMemo(() => ({ ...state, login, signup, logout, updateUser, saveTournament, deleteTournament, register, cancelRegistration, updateRegistration, saveTeam, resetDemo, addResult, markNotificationsRead }), [state, login, signup, logout, updateUser, saveTournament, deleteTournament, register, cancelRegistration, updateRegistration, saveTeam, resetDemo, addResult, markNotificationsRead]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
