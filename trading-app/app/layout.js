import './globals.css';

export const metadata = {
  title: '부산 셀프코딩',
  description: '백엔드 없이 브라우저에서만 동작하는 간단한 웹 프로그램 모음',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" data-theme="dark" data-color="intl" data-skin="binance" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
