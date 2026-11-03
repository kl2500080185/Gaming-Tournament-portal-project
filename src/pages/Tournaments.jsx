import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import TournamentCard from '../components/TournamentCard';
import { useApp } from '../context/AppContext';
import { games } from '../data/seed';

export default function Tournaments() {
  const { tournaments } = useApp();
  const gameOptions = [...new Set([...games, ...tournaments.map((tournament) => tournament.game)])];
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');
  const game = params.get('game') || '';
  const [status, setStatus] = useState('');
  const [prize, setPrize] = useState('');
  const [fee, setFee] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector('.search-field input')?.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);
  const filtered = useMemo(() => tournaments.filter((item) =>
    (!query || `${item.name} ${item.game}`.toLowerCase().includes(query.toLowerCase())) &&
    (!game || item.game === game) && (!status || item.status === status) &&
    (!prize || item.prize >= Number(prize)) && (!fee || (fee === 'free' ? item.entryFee === 0 : item.entryFee > 0)) &&
    (!date || item.date === date),
  ), [tournaments, query, game, status, prize, fee, date]);
  const clear = () => { setQuery(''); setParams({}); setStatus(''); setPrize(''); setFee(''); setDate(''); };
  return <div className="listing-page page-wrap">
    <div className="page-hero compact-hero"><div className="eyebrow"><span className="pulse-dot" /> FIND YOUR NEXT MATCH</div><h1>Enter the <span>arena.</span></h1><p>Good games, great people, and a shot at the top. Find the event that fits your play.</p></div>
    <div className="listing-tools"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tournaments or games" aria-label="Search tournaments or games" /><kbd>⌘ K</kbd></label><div className="view-toggle" aria-label="Tournament display mode"><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid size={17} /></button><button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view"><List size={18} /></button></div></div>
    <div className="filter-layout"><aside className="filter-panel"><div className="filter-title"><SlidersHorizontal size={17} /><strong>Filters</strong><button onClick={clear}>Reset</button></div><label>Game<select value={game} onChange={(e) => setParams(e.target.value ? { game: e.target.value } : {})}><option value="">All games</option>{gameOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Registration<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any status</option><option>Registration open</option><option>Coming soon</option><option>Ongoing</option><option>Completed</option></select></label><label>Match date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Minimum prize pool<select value={prize} onChange={(e) => setPrize(e.target.value)}><option value="">Any prize</option><option value="20000">₹20,000+</option><option value="35000">₹35,000+</option><option value="50000">₹50,000+</option></select></label><label>Entry fee<select value={fee} onChange={(e) => setFee(e.target.value)}><option value="">Any fee</option><option value="free">Free entry</option><option value="paid">Paid entry</option></select></label><div className="filter-note">Illustrative prize values. All paid-entry flows are simulated.</div></aside>
      <section className={`results-area ${view === 'list' ? 'list-view' : ''}`}><div className="results-meta"><span><strong>{filtered.length}</strong> tournaments found</span><span>Sorted by upcoming</span></div>{filtered.length ? <div className="tournament-grid">{filtered.map((item) => <TournamentCard key={item.id} tournament={item} />)}</div> : <div className="empty-state"><span className="empty-icon"><X size={20} /></span><h3>No tournaments found</h3><p>Try adjusting your filters or search for another game.</p><button className="button button-outline" onClick={clear}>Clear filters</button></div>}</section></div>
  </div>;
}
