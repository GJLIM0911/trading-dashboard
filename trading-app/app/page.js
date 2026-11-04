import Link from 'next/link';

// 새 프로그램을 만들면 app/<이름>/page.js 를 추가하고 이 목록에 한 줄 넣으면 첫 화면에 나타난다.
const APPS = [
  {
    href: '/dashboard',
    title: '스윙 트레이딩 대시보드',
    desc: '바이낸스·바이비트 코인과 원유(CL) 시세, 지표, 리스크 계산기, 매매 일지, 경제 일정',
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, margin: '8px 0 4px' }}>부산 셀프코딩</h1>
      <p className="note" style={{ marginBottom: 20 }}>
        백엔드 없이 브라우저에서만 동작하는 프로그램 모음입니다. 모든 데이터는 이 브라우저에만 저장됩니다.
      </p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {APPS.map(a => (
          <Link key={a.href} href={a.href} className="panel" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ color: 'var(--text)', fontSize: 16 }}>{a.title}</h2>
            <p className="note" style={{ margin: 0 }}>{a.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
