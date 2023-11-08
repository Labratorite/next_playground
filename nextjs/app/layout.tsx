import { Metadata } from 'next';
import ThemeRegistry from 'components/theme-registry';
import Layout from 'components/layout';
import '../styles/global.scss';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry options={{ key: 'mui' }}>
          <Layout>{children}</Layout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
