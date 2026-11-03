export const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
export const prettyDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
export const initials = (name = 'Player') => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
export const makeId = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
