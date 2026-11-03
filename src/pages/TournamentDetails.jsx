import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Copy, ShieldCheck, Trophy, Users, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GameLogo from '../components/GameLogo';
import { money, prettyDate } from '../utils/format';

export default function TournamentDetails({ notify }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, registrations, currentUser, register } = useApp();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [gameId, setGameId] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const tournament = tournaments.find((item) => item.id === id);
  if (!tournament) return <div className="page-wrap not-found"><div className="eyebrow">404 / EVENT NOT FOUND</div><h1>This arena doesn’t exist.</h1><Link className="button button-primary" to="/tournaments">Back to tournaments</Link></div>;
  const count = registrations.filter((item) => item.tournamentId === id && item.status !== 'Cancelled').length;
  const ownRegistration = registrations.find((item) => item.tournamentId === id && item.userId === currentUser?.id && item.status !== 'Cancelled');
  const deadlinePassed = tournament.deadline < new Date().toISOString().slice(0, 10);
  const join = () => {
    if (!currentUser) { navigate('/login', { state: { from: `/tournaments/${id}` } }); return; }
    if (currentUser.role !== 'Player') { notify('Only player accounts can register for tournaments.', 'error'); return; }
    setGameId(currentUser.gameIds?.[tournament.game] || currentUser.gameId || '');
    setPaymentConfirmed(false);
    setRegistrationOpen(true);
  };
  const submitRegistration = (event) => {
    event.preventDefault();
    if (tournament.entryFee > 0 && !paymentConfirmed) {
      notify('Confirm the demo payment step to continue.', 'error');
      return;
    }
    const result = register(id, gameId, paymentConfirmed);
    notify(result.message, result.ok ? 'success' : 'error');
    if (result.ok) setRegistrationOpen(false);
  };
  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(tournament.paymentUpi || 'arena-demo@upi');
      notify('UPI ID copied to clipboard.');
    } catch {
      notify('Could not access the clipboard. Select and copy the UPI ID manually.', 'error');
    }
  };
  return <div className="details-page page-wrap">
    <Link to="/tournaments" className="back-link"><ArrowLeft size={16} /> All tournaments</Link>
    <section className={`detail-banner accent-${tournament.accent || 'violet'}`}><div className="art-grid" /><div className="detail-banner-content"><GameLogo className="detail-game-mark" game={tournament.game} imageUrl={tournament.gameIconUrl} /><div className="eyebrow">{tournament.game} <span className="eyebrow-line" /></div><h1>{tournament.name}</h1><p>{tournament.format}</p><span className={`status-pill ${tournament.status === 'Registration open' ? 'status-open' : 'status-soon'}`}>{tournament.status}</span></div><div className="detail-banner-side"><span>PRIZE POOL</span><strong>{money(tournament.prize)}</strong><small>Illustrative prize value</small></div></section>
    <div className="detail-columns"><div className="detail-main"><div className="detail-block"><div className="eyebrow muted-eyebrow">ABOUT THIS EVENT</div><h2>Bring your <span>A-game.</span></h2><p>{tournament.description}</p></div><div className="detail-block"><div className="eyebrow muted-eyebrow">TOURNAMENT RULES</div><h3><ShieldCheck size={19} /> Fair play, always.</h3><p>{tournament.rules}</p><ul className="rules-list"><li><Check size={15} /> Check in before your scheduled match</li><li><Check size={15} /> Keep your profile and game ID up to date</li><li><Check size={15} /> Respect every player in the lobby</li></ul></div><div className="detail-block"><div className="eyebrow muted-eyebrow">EVENT SCHEDULE</div><div className="schedule-row"><span className="schedule-icon"><CalendarDays size={18} /></span><div><strong>Tournament day</strong><small>{prettyDate(tournament.date)}</small></div><span className="schedule-state">UPCOMING</span></div><div className="schedule-row"><span className="schedule-icon"><Clock3 size={18} /></span><div><strong>Registration closes</strong><small>{prettyDate(tournament.deadline)}</small></div></div></div></div>
      <aside className="registration-card"><div className="eyebrow muted-eyebrow">YOUR PLACE IN THE ARENA</div><h3>Event details</h3><div className="registration-facts"><div><span><Users size={16} /> Team slots</span><strong>{count} / {tournament.slots}</strong></div><div className="slot-progress"><i style={{ width: `${Math.min(100, (count / tournament.slots) * 100)}%` }} /></div><div><span><Users size={16} /> Max players</span><strong>{tournament.maxPlayers ?? tournament.slots}</strong></div><div><span><Trophy size={16} /> Prize pool</span><strong>{money(tournament.prize)}</strong></div><div><span><CalendarDays size={16} /> Match day</span><strong>{prettyDate(tournament.date)}</strong></div><div><span>Entry fee</span><strong>{tournament.entryFee ? money(tournament.entryFee) : 'Free'}</strong></div></div><button className={`button button-primary button-full ${ownRegistration ? 'disabled-look' : ''}`} disabled={!!ownRegistration || tournament.status !== 'Registration open' || deadlinePassed || count >= tournament.slots} onClick={join}>{ownRegistration ? 'You’re registered' : deadlinePassed ? 'Registration closed' : tournament.status !== 'Registration open' ? 'Registration opening soon' : count >= tournament.slots ? 'Tournament full' : 'Claim your spot'}{!ownRegistration && !deadlinePassed && <ArrowRight size={17} />}</button><p className="payment-note">{tournament.entryFee ? 'DEMO PAYMENT · No real money is collected.' : 'No entry fee · Your spot is confirmed instantly.'}</p><p className="security-note"><ShieldCheck size={14} /> Safe, fair-play community</p></aside></div>
    {registrationOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRegistrationOpen(false); }}><form className="modal-card registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" onSubmit={submitRegistration}><div className="modal-heading"><div><div className="eyebrow muted-eyebrow">TOURNAMENT REGISTRATION</div><h2 id="registration-title">Claim your spot</h2></div><button type="button" className="icon-button" onClick={() => setRegistrationOpen(false)} aria-label="Close registration"><X size={19} /></button></div><p className="registration-event-name">{tournament.name} <span>· {tournament.game}</span></p><label className="registration-game-id">In-game ID for {tournament.game}<input autoFocus value={gameId} onChange={(event) => setGameId(event.target.value)} minLength="2" maxLength="80" placeholder="Enter your exact in-game ID" required /><small>Use the ID your tournament admins can find in-game. It will be saved with this registration.</small></label>{tournament.entryFee > 0 && <div className="upi-payment-box"><span className="eyebrow muted-eyebrow">ENTRY FEE · {money(tournament.entryFee)}</span><strong>Pay using UPI</strong><p>Send the fee to this tournament’s UPI ID:</p><div className="upi-copy-row"><input aria-label="Tournament UPI ID" readOnly value={tournament.paymentUpi || 'arena-demo@upi'} onFocus={(event) => event.target.select()} /><button className="button button-outline" type="button" onClick={copyUpi}><Copy size={14} /> Copy</button></div><small className="upi-demo-warning">Demo UPI ID only · Do not send real money. This portal cannot verify or process payments.</small><label className="payment-confirm"><input type="checkbox" checked={paymentConfirmed} onChange={(event) => setPaymentConfirmed(event.target.checked)} required /><span>I understand this is a simulated payment confirmation only.</span></label></div>}<div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setRegistrationOpen(false)}>Cancel</button><button className="button button-primary" type="submit">{tournament.entryFee ? 'Confirm demo registration' : 'Confirm free registration'}<ArrowRight size={16} /></button></div></form></div>}
  </div>;
}
