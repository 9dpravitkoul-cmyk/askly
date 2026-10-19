const PRODUCTION_ORIGIN = 'https://askly-sand.vercel.app';

function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function getAppOrigin() {
  const fromEnv = String(import.meta.env.VITE_PUBLIC_APP_URL || '').trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window === 'undefined') return PRODUCTION_ORIGIN;
  const { origin, hostname } = window.location;
  if (isLocalHost(hostname)) return PRODUCTION_ORIGIN;
  return origin;
}

export function getJoinUrl(joinCode) {
  return `${getAppOrigin()}/session/${String(joinCode || '').replace(/\s/g, '').toUpperCase()}`;
}

export function isUsingFallbackProductionOrigin() {
  if (typeof window === 'undefined') return false;
  return isLocalHost(window.location.hostname) && !String(import.meta.env.VITE_PUBLIC_APP_URL || '').trim();
}
