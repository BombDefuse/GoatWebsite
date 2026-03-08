import { requireAuth } from '../../../../../lib/auth';
import { deleteProfile, refreshProfile } from '../../../../../lib/profiles';

export async function POST(req, { params }) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await req.json().catch(() => ({}));
  if (body?.action === 'refresh') {
    const row = await refreshProfile(Number(params.id));
    return Response.json({ ok: true, row });
  }
  return Response.json({ error: 'Unsupported action' }, { status: 400 });
}

export async function DELETE(_req, { params }) {
  const auth = await requireAuth();
  if (auth) return auth;
  await deleteProfile(Number(params.id));
  return Response.json({ ok: true });
}
