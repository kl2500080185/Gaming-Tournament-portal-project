import { ArrowDown, ArrowRight, ArrowUpRight, Crosshair, Gamepad2, Shield, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';
import GameLogo from '../components/GameLogo';
import { money } from '../utils/format';
import { games } from '../data/seed';

export default function Home() {
  const { tournaments, registrations, users } = useApp();
  const featured = tournaments.slice(0, 3);
  const gameTitles = [...new Set([...games, ...tournaments.map((tournament) => tournament.game)])];
  return <div className="home-page">
    <section className="hero">
      <div className="hero-noise" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <div className="hero-content">
        <div className="eyebrow"><span className="pulse-dot" /> THE ARENA IS OPEN <span className="eyebrow-line" /></div>
        <h1>Play hard.<br /><span>Rise higher.</span></h1>
        <p className="hero-copy">Your next big win starts here. Find your squad, enter the arena, and make every match count.</p>
        <div className="hero-actions"><Link className="button button-primary button-large" to="/tournaments">Explore tournaments <ArrowRight size={17} /></Link><Link className="button button-outline button-large" to="/about">How it works <ArrowDown size={16} /></Link></div>
        <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>R</span></div><div><strong>Built for every contender</strong><small>Solo queue to full squad</small></div><span className="proof-divider" /><div className="live-tag"><i /> DEMO SEASON 01</div></div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-ring ring-a" /><div className="visual-ring ring-b" />
        <div className="hero-emblem"><span className="emblem-cross">✣</span><span className="emblem-core">A</span></div>
        <div className="floating-stat stat-prize"><span className="float-icon"><Trophy size={17} /></span><span><small>Prize pool up to</small><strong>₹60,000</strong></span></div>
        <div className="floating-stat stat-match"><span className="match-dot" /><span><small>Next match</small><strong>Neon Rift · 12 days</strong></span></div>
        <span className="visual-coord">19°04' N<br />72°52' E</span>
      </div>
      <span className="hero-side-note">COMPETE / CONNECT / CONQUER</span>
      <a className="scroll-cue" href="#featured">SCROLL TO EXPLORE <span /></a>
    </section>
    <section className="ticker" aria-label="Platform highlights"><div>{['FIND YOUR FIRE', 'PLAY WITH PURPOSE', 'CLAIM YOUR CROWN', 'FIND YOUR FIRE', 'PLAY WITH PURPOSE', 'CLAIM YOUR CROWN'].map((item, index) => <span key={index}>{item}<i>✳</i></span>)}</div></section>
    <section className="section featured-section" id="featured">
      <div className="section-heading"><div><div className="eyebrow muted-eyebrow">YOUR NEXT CHALLENGE</div><h2>Featured <span>tournaments</span></h2></div><Link className="text-link" to="/tournaments">View all tournaments <ArrowUpRight size={16} /></Link></div>
      <div className="tournament-grid">{featured.map((item) => <TournamentCard key={item.id} tournament={item} />)}</div>
    </section>
    <section className="section game-section">
      <div className="section-heading"><div><div className="eyebrow muted-eyebrow">PICK YOUR BATTLEGROUND</div><h2>Choose your <span>game.</span></h2></div><p>From tactical 5v5s to last-player-standing showdowns, your arena is waiting.</p></div>
      <div className="game-grid">{gameTitles.map((game, i) => <Link className={`game-tile game-${i % 6}`} to={`/tournaments?game=${encodeURIComponent(game)}`} key={game}><GameLogo className="game-symbol" game={game} /><span><small>{String(i + 1).padStart(2, '0')} / GAME</small><strong>{game}</strong></span><ArrowUpRight size={17} /></Link>)}</div>
    </section>
    <section className="stats-strip"><div className="stats-heading"><span className="eyebrow">THE ARENA, BY THE NUMBERS</span><h2>Big energy.<br /><em>Real community.</em></h2></div><div className="stats-grid"><div><strong>{users.length > 2 ? `${users.length}+` : '1.2k+'}</strong><span>Players ready to compete</span></div><div><strong>{tournaments.length}+</strong><span>Upcoming tournaments</span></div><div><strong>{money(tournaments.reduce((sum, item) => sum + item.prize, 0))}</strong><span>In illustrative prizes</span></div><div><strong>{registrations.length ? `${registrations.length}+` : '24/7'}</strong><span>{registrations.length ? 'Confirmed registrations' : 'Built for your schedule'}</span></div></div></section>
    <section className="section process-section"><div className="section-heading"><div><div className="eyebrow muted-eyebrow">THREE STEPS. ONE BIG MOMENT.</div><h2>Ready, set, <span>dominate.</span></h2></div></div><div className="process-grid">{[{ icon: Users, num: '01', title: 'Find your people', desc: 'Create a player profile, build your roster, or join a tournament solo.' }, { icon: Crosshair, num: '02', title: 'Enter the arena', desc: 'Pick your game, claim a slot, and get ready for your match day.' }, { icon: Trophy, num: '03', title: 'Make your mark', desc: 'Play fair, bring your best, and climb the leaderboard together.' }].map(({ icon: Icon, num, title, desc }) => <article className="process-card" key={num}><span className="process-number">{num}</span><Icon size={23} /><h3>{title}</h3><p>{desc}</p><span className="process-rule" /></article>)}</div></section>
    <section className="quote-section"><div className="quote-mark">“</div><blockquote>Every great run starts with a single <span>queue.</span></blockquote><p>Sample community quote · illustrative content for this demo</p><div className="quote-controls"><span className="quote-dot active" /><span className="quote-dot" /><span className="quote-dot" /></div></section>
    <section className="cta-panel"><div className="cta-glow" /><div><div className="eyebrow">YOUR SPOT IS WAITING</div><h2>Make your next match<br />the one they remember.</h2><p>Join the community and find your next tournament.</p></div><Link className="button button-primary button-large" to="/signup">Create your free account <ArrowRight size={17} /></Link></section>
    <section className="home-faq section"><div><div className="eyebrow muted-eyebrow">GOOD TO KNOW</div><h2>Quick <span>answers.</span></h2><Link className="text-link" to="/faq">Visit help center <ArrowRight size={16} /></Link></div><div className="faq-mini">{[['Is this a real-money platform?', 'No. This is a frontend-only university demonstration. No real money is collected.'], ['Can I join without a team?', 'Yes. Create your player account and register for an open tournament.'], ['How do I get started?', 'Choose a tournament, check the format, and claim your spot from the details page.']].map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <div className="sr-only"><Sparkles /><Shield /><Gamepad2 /><Zap /></div>
  </div>;
}
