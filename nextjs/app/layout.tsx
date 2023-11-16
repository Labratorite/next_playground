import { Metadata } from 'next';
import ThemeRegistry from 'components/theme-registry';
import Layout from 'components/layout';
import '../styles/global.scss';
import ProgressProvider from 'components/progress';
import SnackbarAlertProvider from 'components/snackbar-alert';

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
          <ProgressProvider>
            <SnackbarAlertProvider>
              <Layout>{children}</Layout>
            </SnackbarAlertProvider>
          </ProgressProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
