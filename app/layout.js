export const metadata = {
  title: 'Steam VAC Watch',
  description: 'Private VAC watchlist for friends'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#0b1020', color: '#e8edf7' }}>
        {children}
      </body>
    </html>
  );
}
