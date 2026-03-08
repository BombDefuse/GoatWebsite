import { requireAuth } from '../../../lib/auth';
import { refreshAllProfiles } from '../../../lib/profiles';

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  const rows = await refreshAllProfiles();
  return Response.json({ ok: true, count: rows.length });
}
