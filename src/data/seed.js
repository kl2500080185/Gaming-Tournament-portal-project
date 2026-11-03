const future = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const DEMO_UPI_ID = 'arena-demo@upi';

export const seedTournaments = [
  { id: 't-valorant', name: 'Neon Rift Invitational', game: 'Valorant', format: '5v5 · Single elimination', status: 'Registration open', date: future(12), deadline: future(9), prize: 50000, entryFee: 250, paymentUpi: DEMO_UPI_ID, slots: 16, maxPlayers: 80, description: 'A high-stakes tactical showdown for the sharpest teams on the server. Bring your best line-up and take the Rift.', rules: 'Check in 30 minutes before your match. All matches are best-of-three. Respectful conduct and fair play are mandatory.', accent: 'violet', icon: '◈' },
  { id: 't-bgmi', name: 'Dropzone Championship', game: 'BGMI', format: 'Squad · 4 matches', status: 'Registration open', date: future(18), deadline: future(14), prize: 35000, entryFee: 150, paymentUpi: DEMO_UPI_ID, slots: 25, maxPlayers: 100, description: 'Drop in, loot up, and make every circle count. A competitive squad lobby built for clutch moments.', rules: 'Four-player squads only. Emulators are not allowed. Room details will be shared with registered captains.', accent: 'orange', icon: '⌖' },
  { id: 't-freefire', name: 'Blaze Open: Season 04', game: 'Free Fire MAX', format: 'Squad · Battle royale', status: 'Registration open', date: future(23), deadline: future(18), prize: 20000, entryFee: 100, paymentUpi: DEMO_UPI_ID, slots: 18, maxPlayers: 72, description: 'Fast rotations. Fearless pushes. The Blaze Open is back with a fresh lobby and a bigger stage.', rules: 'Teams must use registered in-game IDs. No teaming or exploit abuse. Admin decisions are final.', accent: 'pink', icon: '✳' },
  { id: 't-cod', name: 'Blackout Protocol', game: 'Call of Duty', format: '4v4 · Search & Destroy', status: 'Registration open', date: future(29), deadline: future(25), prize: 42000, entryFee: 300, paymentUpi: DEMO_UPI_ID, slots: 12, maxPlayers: 48, description: 'Precision, communication, and a cool head under pressure. The protocol is simple: outplay everyone.', rules: '4v4 teams, best-of-three rounds. Players must use their registered account. No external assistance.', accent: 'cyan', icon: '⌁' },
  { id: 't-fortnite', name: 'Stormbreak Solo Series', game: 'Fortnite', format: 'Solo · 3 rounds', status: 'Coming soon', date: future(36), deadline: future(32), prize: 28000, entryFee: 200, paymentUpi: DEMO_UPI_ID, slots: 50, maxPlayers: 50, description: 'One player, one island, and three chances to prove you belong at the top.', rules: 'Three rounds scored by placement and eliminations. Stream sniping and teaming result in disqualification.', accent: 'blue', icon: '✦' },
  { id: 't-cs2', name: 'Counterstrike: After Hours', game: 'Counter-Strike 2', format: '5v5 · Best of 3', status: 'Coming soon', date: future(42), deadline: future(38), prize: 60000, entryFee: 400, paymentUpi: DEMO_UPI_ID, slots: 16, maxPlayers: 80, description: 'The cleanest executes and the calmest clutches take the crown in this campus-ready CS2 event.', rules: '5-player roster plus one substitute. All games use competitive rules. Cheating is an immediate ban.', accent: 'gold', icon: '◎' },
];

export const initialState = {
  tournaments: seedTournaments,
  users: [
    { id: 'u-player', name: 'Alex Morgan', email: 'player@demo.com', password: 'player123', role: 'Player', nickname: 'Nova', gameId: 'NOVA#4821', gameIds: {} },
    { id: 'u-admin', name: 'Portal Admin', email: 'admin@demo.com', password: 'admin123', role: 'Admin', nickname: 'Admin', gameId: '', gameIds: {} },
  ],
  currentUser: null,
  registrations: [],
  teams: [],
  results: [],
  notifications: [],
};

export const games = ['Valorant', 'BGMI', 'Free Fire MAX', 'Call of Duty', 'Fortnite', 'Counter-Strike 2'];

const gameLogoUrls = {
  valorant: 'https://cdn.simpleicons.org/valorant',
  bgmi: 'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fwww.battlegroundsmobileindia.com&sz=128',
  'free fire max': 'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fff.garena.com&sz=128',
  'call of duty': 'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fwww.callofduty.com&sz=128',
  fortnite: 'https://cdn.simpleicons.org/fortnite',
  'counter-strike 2': 'https://cdn.simpleicons.org/counterstrike',
};

export function getGameLogoUrl(game) {
  return gameLogoUrls[String(game || '').trim().toLowerCase()] || '';
}
