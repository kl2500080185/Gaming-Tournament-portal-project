import { useState } from 'react';
import { getGameLogoUrl } from '../data/seed';

export default function GameLogo({ game, imageUrl, className = '' }) {
  const [failedUrl, setFailedUrl] = useState('');
  const logoUrl = imageUrl || getGameLogoUrl(game);
  const hasLogo = logoUrl && failedUrl !== logoUrl;
  const initials = game.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <span className={`${className}${hasLogo ? ' has-game-logo' : ''}`} aria-label={`${game} logo`}>
      {hasLogo
        ? <img src={logoUrl} alt={`${game} logo`} onError={() => setFailedUrl(logoUrl)} />
        : <span aria-hidden="true">{initials || '?'}</span>}
    </span>
  );
}
