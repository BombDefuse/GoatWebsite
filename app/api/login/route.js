import { NextResponse } from 'next/server';
import { COOKIE_NAME, createSessionToken } from '../../../lib/auth';

export async function POST(req) {
  const form = await req.formData();
  const password = String(form.get('password') || '');
  if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return NextResponse.redirect(new URL('/login?error=1', req.url));
  }

  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}
