import { refreshAllProfiles } from '../../../../lib/profiles';

export async function GET(req) {
  const auth = req.headers.get('authorization');
  const vercelCron = req.headers.get('x-vercel-cron');
  const ok = vercelCron === '1' || auth === `Bearer ${process.env.CRON_SECRET}`;
  if (!ok) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const rows = await refreshAllProfiles();
  return Response.json({ ok: true, count: rows.length });
}
