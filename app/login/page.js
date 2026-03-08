export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ width: '100%', maxWidth: 420, background: '#141b34', border: '1px solid #253052', borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Steam VAC Watch</h1>
        <p style={{ opacity: 0.8 }}>Enter the shared password to access the site.</p>
        {error ? <p style={{ color: '#ff9eaa' }}>Wrong password.</p> : null}
        <form action="/api/login" method="post" style={{ display: 'grid', gap: 12 }}>
          <input name="password" type="password" required placeholder="Password" style={{ borderRadius: 10, border: '1px solid #314064', background: '#0f1530', color: 'white', padding: '10px 12px' }} />
          <button style={{ background: '#4d8cff', color: 'white', border: 0, borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}>Log in</button>
        </form>
      </section>
    </main>
  );
}
