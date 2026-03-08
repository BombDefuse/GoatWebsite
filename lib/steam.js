const API = 'https://api.steampowered.com';

function steamKey() {
  if (!process.env.STEAM_API_KEY) throw new Error('STEAM_API_KEY is missing');
  return process.env.STEAM_API_KEY;
}

export function extractSteamIdOrVanity(input) {
  const value = String(input || '').trim();
  if (/^\d{17}$/.test(value)) return { type: 'steamid', value };

  try {
    const url = new URL(value);
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'profiles' && /^\d{17}$/.test(parts[1])) {
      return { type: 'steamid', value: parts[1] };
    }
    if (parts[0] === 'id' && parts[1]) {
      return { type: 'vanity', value: parts[1] };
    }
  } catch {}

  return { type: 'vanity', value };
}

export async function resolveSteamId(input) {
  const parsed = extractSteamIdOrVanity(input);
  if (parsed.type === 'steamid') return parsed.value;

  const url = `${API}/ISteamUser/ResolveVanityURL/v1/?key=${encodeURIComponent(steamKey())}&vanityurl=${encodeURIComponent(parsed.value)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  if (!data?.response?.steamid) {
    throw new Error('Could not resolve that Steam URL or vanity name');
  }
  return data.response.steamid;
}

export async function getPlayerSummary(steamid) {
  const url = `${API}/ISteamUser/GetPlayerSummaries/v2/?key=${encodeURIComponent(steamKey())}&steamids=${encodeURIComponent(steamid)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data?.response?.players?.[0] || null;
}

export async function getPlayerBan(steamid) {
  const url = `${API}/ISteamUser/GetPlayerBans/v1/?key=${encodeURIComponent(steamKey())}&steamids=${encodeURIComponent(steamid)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data?.players?.[0] || null;
}

export async function fetchSteamProfileState(input) {
  const steamid = await resolveSteamId(input);
  const [summary, ban] = await Promise.all([
    getPlayerSummary(steamid),
    getPlayerBan(steamid)
  ]);

  if (!summary || !ban) throw new Error('Steam API did not return profile data');

  return {
    steamid,
    profile_url: summary.profileurl || `https://steamcommunity.com/profiles/${steamid}`,
    persona_name: summary.personaname || steamid,
    avatar_url: summary.avatarfull || summary.avatarmedium || summary.avatar || null,
    community_banned: Boolean(ban.CommunityBanned),
    vac_banned: Boolean(ban.VACBanned),
    number_of_vac_bans: Number(ban.NumberOfVACBans || 0),
    days_since_last_ban: Number(ban.DaysSinceLastBan || 0),
    game_ban_count: Number(ban.NumberOfGameBans || 0)
  };
}
