import { getSupabaseAdmin } from './supabase';
import { fetchSteamProfileState } from './steam';

export async function listProfiles() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function upsertProfile(inputUrl) {
  const supabase = getSupabaseAdmin();
  const state = await fetchSteamProfileState(inputUrl);
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('steamid', state.steamid)
    .maybeSingle();

  const payload = {
    input_url: inputUrl,
    steamid: state.steamid,
    profile_url: state.profile_url,
    persona_name: state.persona_name,
    avatar_url: state.avatar_url,
    community_banned: state.community_banned,
    vac_banned: state.vac_banned,
    number_of_vac_bans: state.number_of_vac_bans,
    days_since_last_ban: state.days_since_last_ban,
    game_ban_count: state.game_ban_count,
    last_checked_at: now
  };

  if (!existing?.first_seen_vac_banned_at && state.vac_banned) {
    payload.first_seen_vac_banned_at = now;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'steamid' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function refreshProfile(id) {
  const supabase = getSupabaseAdmin();
  const { data: row, error: loadErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (loadErr) throw loadErr;

  const state = await fetchSteamProfileState(row.profile_url || row.input_url || row.steamid);
  const now = new Date().toISOString();
  const updates = {
    profile_url: state.profile_url,
    persona_name: state.persona_name,
    avatar_url: state.avatar_url,
    community_banned: state.community_banned,
    vac_banned: state.vac_banned,
    number_of_vac_bans: state.number_of_vac_bans,
    days_since_last_ban: state.days_since_last_ban,
    game_ban_count: state.game_ban_count,
    last_checked_at: now
  };
  if (!row.first_seen_vac_banned_at && state.vac_banned) {
    updates.first_seen_vac_banned_at = now;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function refreshAllProfiles() {
  const rows = await listProfiles();
  const out = [];
  for (const row of rows) {
    out.push(await refreshProfile(row.id));
  }
  return out;
}

export async function deleteProfile(id) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}
