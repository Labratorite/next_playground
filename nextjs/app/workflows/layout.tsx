import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Welcome to Next.js',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
