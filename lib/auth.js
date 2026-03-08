import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'svw_session';

function sign(value) {
  return crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret')
    .update(value)
    .digest('hex');
}

export function createSessionToken() {
  const payload = `ok:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token) {
  if (!token || !token.includes('.')) return false;
  const idx = token.lastIndexOf('.');
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)));
}

export async function isAuthenticated() {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return isValidSessionToken(token || '');
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export { COOKIE_NAME };
