import { ArrowUpRight, CalendarDays, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { money, prettyDate } from '../utils/format';
import GameLogo from './GameLogo';

export default function TournamentCard({ tournament, registered = false }) {
  return (
    <article className={`tournament-card accent-${tournament.accent || 'violet'}`}>
      <div className="card-art">
        <div className="art-grid" />
        <GameLogo className="game-mark" game={tournament.game} imageUrl={tournament.gameIconUrl} />
        <span className="game-label">{tournament.game}</span>
        <span className={`status-pill ${tournament.status === 'Registration open' ? 'status-open' : 'status-soon'}`}>{tournament.status}</span>
      </div>
      <div className="card-content">
        <div className="card-kicker">{tournament.format}</div>
        <h3>{tournament.name}</h3>
        <div className="card-metrics">
          <div><span>Prize pool</span><strong>{money(tournament.prize)}</strong></div>
          <div><span>Entry fee</span><strong>{tournament.entryFee ? money(tournament.entryFee) : 'Free'}</strong></div>
        </div>
        <div className="card-footer">
          <span><CalendarDays size={14} />{prettyDate(tournament.date)}</span>
          <span><Users size={14} />{tournament.slots} teams</span>
        </div>
        <Link className="card-link" to={`/tournaments/${tournament.id}`}>{registered ? 'View your spot' : 'Explore event'}<ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
