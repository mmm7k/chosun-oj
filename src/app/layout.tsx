import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKr = Noto_Sans_KR({
  weight: ['500'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chosun Online Judge',
  description: 'Chosun Online Judge',
  openGraph: {
    url: 'http://chosuncnl.shop:5555',
    type: 'website',
    title: 'Chosun Online Judge',
    description:
      'Chosun Online Judge는 조선대 학생들의 프로그래밍 능력을 향상시키기 위한 웹사이트입니다.',
    images: [
      {
        url: '/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Chosun Online Judge',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body className={notoSansKr.className}>{children}</body>
    </html>
  );
}
