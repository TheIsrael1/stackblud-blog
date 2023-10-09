import Providers from '@/components/hocs/Providers';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import type { Metadata } from 'next';
import { Caveat, Inter, Pacifico } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat'
});

export const metadata: Metadata = {
  title: 'Stackblud Blog',
  description: 'Stackblud blog by ehindero israel'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter?.variable} ${caveat?.variable} container`}>
        <NextTopLoader
          color="#C75146"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFFFFF,0 0 5px #FFFFFF"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
