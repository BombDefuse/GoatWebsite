import { redirect } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import { listProfiles } from '../lib/profiles';

async function addProfile(formData) {
  'use server';
  const input = formData.get('profile');
  const { upsertProfile } = await import('../lib/profiles');
  await upsertProfile(String(input || '').trim());
  redirect('/');
}

async function refreshAll() {
  'use server';
  const { refreshAllProfiles } = await import('../lib/profiles');
  await refreshAllProfiles();
  redirect('/');
}

async function refreshOne(formData) {
  'use server';
  const { refreshProfile } = await import('../lib/profiles');
  await refreshProfile(Number(formData.get('id')));
  redirect('/');
}

async function removeOne(formData) {
  'use server';
  const { deleteProfile } = await import('../lib/profiles');
  await deleteProfile(Number(formData.get('id')));
  redirect('/');
}

function fmt(date) {
  return date ? new Date(date).toLocaleString() : '—';
}

export default async function HomePage() {
  if (!(await isAuthenticated())) redirect('/login');
  const profiles = await listProfiles();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Steam VAC Watch</h1>
          <p style={{ opacity: 0.8 }}>Track Steam profiles and see who becomes VAC banned.</p>
        </div>
        <form action="/api/logout" method="post">
          <button style={buttonStyle}>Log out</button>
        </form>
      </div>

      <section style={cardStyle}>
        <form action={addProfile} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            name="profile"
            placeholder="Paste a Steam profile URL, vanity URL, or SteamID64"
            required
            style={{ ...inputStyle, flex: 1, minWidth: 320 }}
          />
          <button style={buttonStyle}>Add profile</button>
        </form>
      </section>

      <section style={{ ...cardStyle, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Watchlist</h2>
          <form action={refreshAll}>
            <button style={buttonStyle}>Refresh all now</button>
          </form>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Profile', 'SteamID', 'VAC', 'Game bans', 'First seen VAC banned', 'Last checked', 'Actions'].map((h) => (
                  <th key={h} style={thtd(true)}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan="7" style={thtd(false)}>No profiles yet.</td>
                </tr>
              ) : profiles.map((p) => (
                <tr key={p.id}>
                  <td style={thtd(false)}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {p.avatar_url ? <img src={p.avatar_url} alt="avatar" width="48" height="48" style={{ borderRadius: 999 }} /> : null}
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.persona_name || 'Unknown'}</div>
                        <a href={p.profile_url} target="_blank" style={{ color: '#8ec5ff' }}>{p.profile_url}</a>
                      </div>
                    </div>
                  </td>
                  <td style={thtd(false)}>{p.steamid}</td>
                  <td style={thtd(false)}>{p.vac_banned ? 'BANNED' : 'Clear'}</td>
                  <td style={thtd(false)}>{p.game_ban_count}</td>
                  <td style={thtd(false)}>{fmt(p.first_seen_vac_banned_at)}</td>
                  <td style={thtd(false)}>{fmt(p.last_checked_at)}</td>
                  <td style={thtd(false)}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <form action={refreshOne}>
                        <input type="hidden" name="id" value={p.id} />
                        <button style={buttonStyle}>Refresh</button>
                      </form>
                      <form action={removeOne}>
                        <input type="hidden" name="id" value={p.id} />
                        <button style={dangerStyle}>Remove</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

const cardStyle = {
  background: '#141b34',
  border: '1px solid #253052',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
};

const buttonStyle = {
  background: '#4d8cff',
  color: 'white',
  border: 0,
  borderRadius: 10,
  padding: '10px 14px',
  cursor: 'pointer'
};

const dangerStyle = {
  ...buttonStyle,
  background: '#c24a5a'
};

const inputStyle = {
  borderRadius: 10,
  border: '1px solid #314064',
  background: '#0f1530',
  color: 'white',
  padding: '10px 12px'
};

const thtd = (head) => ({
  textAlign: 'left',
  padding: 12,
  borderBottom: '1px solid #253052',
  verticalAlign: 'top',
  fontSize: 14,
  ...(head ? { opacity: 0.85 } : {})
});
