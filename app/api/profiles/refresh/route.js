import { requireAuth } from '../../../../lib/auth';
import { refreshAllProfiles } from '../../../../lib/profiles';

export async function POST() {
  const auth = await requireAuth();
  if (auth) return auth;
  const data = await refreshAllProfiles();
  return Response.json({ ok: true, count: data.length });
}
