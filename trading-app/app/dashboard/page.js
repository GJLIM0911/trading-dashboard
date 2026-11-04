'use client';
import { useEffect } from 'react';
import { startDashboard } from '@/lib/dashboard';

export default function DashboardPage() {
  useEffect(() => {
    let dispose = null, alive = true;
    import('lightweight-charts')
      .then(m => { if (alive) dispose = startDashboard(m); })
      .catch(() => { if (alive) dispose = startDashboard(null); });
    return () => { alive = false; if (dispose) dispose(); };
  }, []);
  return (
    <>
      <header>
       <h1>스윙 트레이딩 대시보드</h1>
       <div className="seg" id="exSeg"><button data-ex="binance">바이낸스</button><button data-ex="bybit">바이비트</button></div>
       <div className="seg" id="tfSeg"><button data-tf="15m">15분</button><button data-tf="1h">1시간</button><button data-tf="4h">4시간</button><button data-tf="1d">일봉</button></div>
       <div className="status">
        <span className="dot" id="statusDot"></span><span id="statusText">연결 대기</span>
        <button className="ghost" id="skinBtn">거래소 스타일</button>
        <button className="ghost" id="colorBtn">색상</button>
        <button className="ghost" id="themeBtn">라이트</button>
        <button className="ghost" id="settingsBtn">설정</button>
       </div>
      </header>
      <div id="dailyBanner" className="dangerbox"></div>
      <nav className="tabs" id="tabs">
       <button data-tab="main" className="on">메인</button>
       <button data-tab="stock">주식</button>
       <button data-tab="oil">원유</button>
       <button data-tab="long">롱·숏 후보 · TOP50</button>
       <button data-tab="risk">리스크 관리</button>
       <button data-tab="journal">매매 일지</button>
       <button data-tab="cal">경제 일정</button>
      </nav>
      <main>
      
      <section className="tab on" id="tab-main">
       <div className="grid hero" id="hero"></div>
       <div className="grid main-layout">
        <div className="panel">
         <div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><h2 style={{margin:'0'}}>종목 현황 <span className="note" id="tfLabel"></span></h2><div className="row"><label className="badge"><input type="checkbox" id="mainStocks" /> 주식 TOP10</label><input id="filter" placeholder="종목 검색" style={{width:'140px'}} /></div></div>
         <div className="tbl-wrap"><table id="symTable"><thead><tr>
          <th data-k="name">종목</th><th data-k="last">현재가</th><th data-k="pct">24h</th><th data-k="quoteVolume">거래대금</th><th data-k="funding">펀딩비</th><th data-k="rsi">RSI</th><th data-k="trend">이평</th><th data-k="pb">볼린저</th><th data-k="macd">MACD</th>
         </tr></thead><tbody></tbody></table></div>
         <p className="note mt">펀딩비 절대값이 경고 기준(기본 1%) 이상이면 빨간 배경. RSI·이평(20/50/200)·볼린저(20,2σ)·MACD(12,26,9)는 선택한 시간봉 기준. 열 제목을 누르면 정렬. 주식 TOP10을 켜 두면 거래소 주식·ETF 선물 중 24h 거래대금 상위 10종목이 자동으로 함께 표시되고, 순위가 바뀌면 교체됩니다(● 본장 진행 중, ○ 휴장).</p>
        </div>
        <div>
         <div className="panel">
          <div className="detail-head" id="detailHead"></div>
          <div className="row" style={{marginBottom:'6px'}}>
           <label className="badge"><input type="checkbox" id="toggleOI" /> 미결제약정</label>
           <label className="badge"><input type="checkbox" id="toggleLS" /> 롱숏 비율</label>
           <button className="ghost" id="toJournalBtn">이 종목 일지 기록</button>
          </div>
          <div id="chartMain" className="chart-stack"></div>
         </div>
         <div className="panel mt">
          <h2>가격 알림</h2>
          <div className="row">
           <input list="symlist" id="alSym" placeholder="종목 (예: BTCUSDT)" style={{width:'170px'}} />
           <select id="alCond"><option value="above">이상</option><option value="below">이하</option></select>
           <input id="alPrice" type="number" step="any" placeholder="가격" style={{width:'130px'}} />
           <button className="primary" id="alAdd">추가</button>
           <button className="ghost" id="notifBtn">브라우저 알림 허용</button>
          </div>
          <div id="alList" className="mt"></div>
          <p className="note">이 탭이 열려 있는 동안만 동작합니다. 펀딩비가 경고 기준 이상인 종목은 자동으로 알립니다.</p>
          <div id="alLog"></div>
         </div>
        </div>
       </div>
      </section>
      
      <section className="tab" id="tab-long">
       <div className="panel"><div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><h2 style={{margin:'0'}}>시장 환경 (대외 요인)</h2><div className="row"><div className="seg" id="lgMode"><button data-m="long">롱</button><button data-m="short">숏</button></div><button className="ghost" id="longRescan">지금 다시 스캔</button></div></div><div id="longMacro"></div></div>
       <div className="panel mt"><h2><span id="lgTopTitle">롱 후보 상위 5</span> <span className="note">(경고 없는 종목 중 점수순)</span></h2><div id="longTop" className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))'}}></div></div>
       <div className="panel mt">
        <div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><div><h2 style={{margin:'0'}}>거래량 TOP 50</h2><div className="note" id="longStatus"></div></div><div className="row"><label className="badge"><input type="checkbox" id="longMin" /> 55점 이상만</label><select id="longAsset"><option value="all">전체 종목</option><option value="crypto">코인만</option><option value="tradfi">주식·원자재 등</option></select><input id="longFilter" placeholder="종목 검색" style={{width:'140px'}} /></div></div>
        <div className="tbl-wrap"><table id="longTable"><thead><tr><th data-k="rank">순위</th><th data-k="name">종목</th><th data-k="last">현재가</th><th data-k="pct">24h</th><th data-k="qv">거래대금</th><th data-k="funding">펀딩비</th><th data-k="oi">OI 24h</th><th data-k="ls">롱숏비</th><th data-k="rsi">RSI</th><th data-k="score">롱 점수</th><th data-k="sscore">숏 점수</th><th>판정</th></tr></thead><tbody></tbody></table></div>
        <p className="note mt">롱·숏 점수 = 방향별 종목 점수(추세 25 · 모멘텀 20 · RSI 15 · 볼린저 5 · 거래량 10 · 펀딩·OI 15 · 롱숏 10, 선택한 시간봉 기준) + 시장 환경 보정(-20 ~ +10). 70 이상 우호, 55~69 관찰, 55 미만 비우호. 숏 점수는 롱 규칙을 방향만 뒤집은 것입니다(200선 아래, 데드크로스, 음봉 거래량, 양수 펀딩, 롱 계정 쏠림 등에 가점). 24h 15% 넘는 급등·급락, RSI 극단, 밴드 이탈, 펀딩 과열, 한쪽 계정 쏠림, ATR 손절폭 12% 초과 종목은 '주의'로 표시하고 상위 5에서 뺍니다. OI 변화와 롱숏비는 1시간 단위 최근 24시간 데이터. 행을 누르면 점수 내역과 ATR 기반 손절·목표 참고값이 열립니다. 규칙 기반 스크리닝 결과이며 매매 권유가 아닙니다. 숏은 급등(숏 스퀴즈) 때 손실이 빠르게 커질 수 있으니 손절을 반드시 먼저 정하세요. 주식·ETF·원자재 선물(노란 배지)은 해당 시장 휴장 시간과 주말에 가격 갭이 생길 수 있습니다. 진입 전 차트와 일정을 직접 확인하세요.</p>
       </div>
      </section>
            
      <section className="tab" id="tab-stock">
       <div className="grid" id="stSessions" style={{gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',marginBottom:'12px'}}></div>
       <div className="panel"><div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><h2 style={{margin:'0'}}>주식 시장 환경</h2><div className="row"><div className="seg" id="stMode"><button data-m="long">롱</button><button data-m="short">숏</button></div><button className="ghost" id="stRescan">지금 다시 스캔</button></div></div><div id="stMacro"></div></div>
       <div className="panel mt"><h2><span id="stTopTitle">롱 후보 상위 5</span> <span className="note">(경고 없는 종목 중 점수순)</span></h2><div id="stTop" className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))'}}></div></div>
       <div className="panel mt">
        <div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><div><h2 style={{margin:'0'}}>주식 선물 거래량 TOP 50</h2><div className="note" id="stStatus"></div></div><div className="row"><select id="stRegion"><option value="all">전체 시장</option><option value="US">미국</option><option value="KR">한국</option><option value="HKCN">홍콩·중국</option><option value="PRE">프리IPO</option></select><input id="stFilter" placeholder="종목·회사명 검색" style={{width:'150px'}} /></div></div>
        <div className="tbl-wrap"><table id="stockTable"><thead><tr><th data-k="rank">순위</th><th data-k="name">종목</th><th data-k="region">시장</th><th data-k="last">현재가</th><th data-k="pct">24h</th><th data-k="qv">거래대금</th><th data-k="funding">펀딩비</th><th data-k="oi">OI 24h</th><th data-k="rsi">RSI</th><th data-k="score">롱 점수</th><th data-k="sscore">숏 점수</th><th>판정</th></tr></thead><tbody></tbody></table></div>
        <p className="note mt">거래소에 상장된 주식·ETF 무기한 선물(USDT 정산)입니다. 실제 주식 소유가 아니어서 의결권·배당이 없고, 가격은 거래소 지수와 펀딩비로 원주식을 따라갑니다. 선물은 24시간 거래되지만 본 시장이 쉬는 야간·주말·공휴일에는 기준 가격이 멈춰 있어 개장 때 갭이 생길 수 있습니다(● 본장 진행 중, ○ 휴장). 장 시간 카드는 각국 공휴일을 반영하지 않습니다. 점수는 코인 탭과 같은 규칙(추세·모멘텀·RSI·볼린저·거래량·펀딩·OI·롱숏)에 지역 지수 추세(미국 SPY, 한국 EWY), 시장 폭, 경제 일정, DXY 보정을 더한 값입니다. OI·롱숏비 데이터를 주지 않는 종목은 중립 점수로 계산합니다. 인버스·VIX ETF(노란 배지)는 지수와 반대로 움직이므로 지수 추세 보정을 반대로 적용하고, 레버리지 ETF는 변동성이 커 손절폭을 꼭 확인하세요. 규칙 기반 스크리닝이며 매매 권유가 아닙니다.</p>
       </div>
      </section>
            
      <section className="tab" id="tab-oil">
       <div className="grid hero" id="oilHero"></div>
       <div className="grid main-layout">
        <div className="panel">
         <div className="row" style={{justifyContent:'space-between',marginBottom:'8px'}}><h2 style={{margin:'0'}}>원유 차트</h2><div className="seg" id="oilSeg"></div></div>
         <div className="detail-head" id="oilHead"></div>
         <div className="row" style={{marginBottom:'6px'}}>
          <label className="badge"><input type="checkbox" id="toggleOI2" /> 미결제약정</label>
          <label className="badge"><input type="checkbox" id="toggleLS2" /> 롱숏 비율</label>
         </div>
         <div id="chartOil" className="chart-stack"></div>
        </div>
        <div>
         <div className="panel"><h2>EIA 주간 원유 재고</h2>
          <div id="eiaNext" className="note"></div>
          <div className="row mt"><input type="date" id="eiaDate" /><input type="number" step="any" id="eiaChange" placeholder="재고 변화 (백만 배럴, 감소는 -)" style={{width:'240px'}} /><input type="number" step="any" id="eiaExp" placeholder="예상치" style={{width:'100px'}} /><button className="primary" id="eiaAdd">저장</button></div>
          <div id="eiaSpark" className="spark mt"></div>
          <div id="eiaList"></div>
          <p className="note">출처: eia.gov 주간 석유 현황 보고서(WPSR). 수치는 직접 입력합니다. 재고 감소(-)는 유가에 우호적, 증가(+)는 부담 요인으로 색을 구분합니다.</p>
         </div>
         <div className="panel mt"><h2>달러 인덱스 (DXY)</h2>
          <div className="row"><input type="date" id="dxyDate" /><input type="number" step="any" id="dxyVal" placeholder="DXY 값" style={{width:'110px'}} /><button className="primary" id="dxyAdd">저장</button><span id="dxyLast" className="kv"></span></div>
          <div id="dxySpark" className="spark mt"></div>
         </div>
         <div className="panel mt"><h2>OPEC+ 일정</h2>
          <div id="opecList"></div>
          <div className="row mt"><input type="date" id="opecDate" /><input id="opecTitle" placeholder="예: OPEC+ 8개국 월례 회의" style={{flex:'1',minWidth:'200px'}} /><button className="primary" id="opecAdd">추가</button></div>
          <p className="note">공식 일정은 opec.org에서 확인. 경제 일정 탭에도 함께 표시됩니다.</p>
         </div>
         <div className="panel mt"><h2>원유 매매 전 체크리스트 <span className="note" id="oilCheckDate"></span></h2><div id="oilCheck"></div></div>
        </div>
       </div>
      </section>
      
      <section className="tab" id="tab-risk">
       <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))'}}>
        <div className="panel"><h2>오늘 손익 / 일일 손실 한도</h2><div id="dailyBox"></div></div>
        <div className="panel"><h2>포지션 크기 계산기</h2>
         <div className="form">
          <label>종목<select id="psSym" className="symsel"></select></label>
          <label>총 투자금 (USDT)<input type="number" id="psCap" /></label>
          <label>1회 손실 한도<select id="psRisk"><option defaultValue="0.5">0.5%</option><option value="1">1%</option><option value="1.5">1.5%</option><option value="2">2%</option><option value="2.5">2.5%</option><option value="3">3%</option><option value="5">5%</option></select></label>
          <label>진입가<input type="number" step="any" id="psEntry" /></label>
          <label>손절 입력 방식<select id="psStopMode"><option value="price">손절가 직접 입력</option><option value="pct">손절 거리 %로 입력</option></select></label>
          <label id="psStopLabel">손절가<input type="number" step="any" id="psStop" /></label>
          <label>방향 (% 입력 시)<select id="psSide"><option value="long">롱</option><option value="short">숏</option></select></label>
         </div>
         <div className="row mt"><button className="ghost" id="psFill">선택 종목 현재가 불러오기</button><span className="kv" id="psNow"></span></div>
         <div id="psOut" className="mt"></div>
        </div>
        <div className="panel"><h2>청산가 계산기</h2>
         <div className="form">
          <label>종목<select id="lqSym" className="symsel"></select></label>
          <label>진입가<input type="number" step="any" id="lqEntry" /></label>
          <label>방향<select id="lqSide"><option value="long">롱</option><option value="short">숏</option></select></label>
          <label>레버리지<select id="lqLev"><option value="1">1배</option><option value="2">2배</option><option value="3">3배</option><option value="5">5배</option><option value="10">10배</option><option value="20">20배</option><option value="25">25배</option><option value="50">50배</option><option value="75">75배</option><option value="100">100배</option><option value="125">125배</option></select></label>
          <label>유지증거금률<select id="lqMmr"><option value="0.4">0.4%</option><option defaultValue="0.5">0.5%</option><option value="1">1%</option><option value="2.5">2.5%</option><option value="5">5%</option><option value="10">10%</option></select></label>
         </div>
         <div className="row mt"><button className="ghost" id="lqFill">선택 종목 현재가 불러오기</button><span className="kv" id="lqNow"></span></div>
         <div id="lqOut" className="mt"></div>
        </div>
        <div className="panel"><h2>손익비 계산기</h2>
         <div className="form">
          <label>종목<select id="rrSym" className="symsel"></select></label>
          <label>진입가<input type="number" step="any" id="rrEntry" /></label>
          <label>손절가<input type="number" step="any" id="rrStop" /></label>
          <label>목표 설정<select id="rrMode"><option value="price">목표가 직접 입력</option><option value="1">손익비 1:1로 계산</option><option value="1.5">손익비 1:1.5로 계산</option><option value="2">손익비 1:2로 계산</option><option value="3">손익비 1:3으로 계산</option></select></label>
          <label>목표가<input type="number" step="any" id="rrTarget" /></label>
         </div>
         <div className="row mt"><button className="ghost" id="rrFill">선택 종목 현재가 불러오기</button><span className="kv" id="rrNow"></span></div>
         <div id="rrOut" className="mt"></div>
        </div>
       </div>
      </section>
      
      <section className="tab" id="tab-journal">
       <div className="grid main-layout">
        <div className="panel"><h2>매매 기록 입력</h2>
         <div className="form">
          <label>일시<input type="datetime-local" id="jDate" /></label>
          <label>거래소<select id="jEx"><option value="binance">바이낸스</option><option value="bybit">바이비트</option></select></label>
          <label>종목<input list="symlist" id="jSym" placeholder="BTCUSDT" /></label>
          <label>방향<select id="jSide"><option value="long">롱</option><option value="short">숏</option></select></label>
          <label>진입가<input type="number" step="any" id="jEntry" /></label>
          <label>청산가 (보유 중이면 비움)<input type="number" step="any" id="jExit" /></label>
          <label>손절가<input type="number" step="any" id="jStop" /></label>
          <label>수량<input type="number" step="any" id="jQty" /></label>
          <label>레버리지<input type="number" step="1" id="jLev" /></label>
         </div>
         <div className="mt"><div className="note" style={{marginBottom:'4px'}}>진입 근거 (복수 선택)</div><div className="chk" id="jReasons"></div></div>
         <div className="mt row"><label className="kv">감정 상태 <select id="jEmotion"></select></label><span className="kv">규칙 준수</span><div className="chk" id="jRules"></div></div>
         <div className="mt"><textarea id="jMemo" rows="3" style={{width:'100%'}} placeholder="복기 메모: 무엇을 보고 들어갔고, 결과에서 무엇을 배웠는가"></textarea></div>
         <div className="row mt"><button className="primary" id="jSave">저장</button><button className="ghost" id="jClear">초기화</button><span className="note" id="jEditing"></span></div>
        </div>
        <div>
         <div className="panel"><h2>통계 (청산 거래 기준)</h2><div id="jStats"></div><div id="equity" className="mt"></div></div>
         <div className="panel mt"><h2>진입 근거별 성과</h2><div id="jByReason"></div></div>
         <div className="panel mt"><h2>감정 상태 · 규칙 준수별 성과</h2><div id="jByEmotion"></div></div>
        </div>
       </div>
       <div className="panel mt">
        <div className="row" style={{justifyContent:'space-between'}}><h2 style={{margin:'0'}}>매매 기록</h2><div className="row"><button className="ghost" id="jExport">CSV 내보내기</button><label className="badge">CSV 가져오기<input type="file" id="jImport" accept=".csv" style={{display:'none'}} /></label></div></div>
        <div className="tbl-wrap mt"><table id="jTable"><thead><tr><th>일시</th><th>거래소</th><th>종목</th><th>방향</th><th>진입</th><th>청산</th><th>수량</th><th>레버</th><th>손익</th><th>ROI</th><th>R</th><th>근거</th><th>감정</th><th>규칙</th><th>메모</th><th></th></tr></thead><tbody></tbody></table></div>
       </div>
      </section>
      
      <section className="tab" id="tab-cal">
       <div className="grid main-layout">
        <div className="panel"><h2>최근 1주 ~ 향후 90일 일정</h2><div id="evList"></div></div>
        <div>
         <div className="panel"><h2>일정 추가</h2>
          <div className="form">
           <label>날짜<input type="date" id="evDate" /></label>
           <label>시간 (한국, 선택)<input type="time" id="evTime" /></label>
           <label>분류<select id="evCat"><option>FOMC</option><option>CPI</option><option>고용</option><option>EIA</option><option>OPEC+</option><option>기타</option></select></label>
           <label>제목<input id="evTitle" placeholder="예: 미국 PPI" /></label>
          </div>
          <div className="row mt"><button className="primary" id="evAdd">추가</button></div>
         </div>
         <div className="panel mt"><h2>내장 일정 안내</h2>
          <p className="note">
           · <b>EIA 원유 재고</b>: 매주 수요일 미 동부 10:30 기준으로 자동 생성. 미국 공휴일 주간은 하루 밀립니다.<br />
           · <b>FOMC</b>: 2026년 남은 일정(10/28, 12/9)만 내장. 2027년 일정은 federalreserve.gov에서 확인 후 직접 추가.<br />
           · <b>고용(NFP)</b>, <b>CPI</b>: 통상 패턴으로 추정한 날짜이며 "추정" 표시가 붙습니다. bls.gov 일정표로 확인 후 틀리면 삭제하고 다시 추가하세요.<br />
           · <b>OPEC+</b>: 내장 일정 없음. 원유 탭이나 여기서 직접 추가.<br />
           삭제한 내장 일정은 다시 나타나지 않습니다. 설정의 데이터 초기화로 복구할 수 있습니다.
          </p>
         </div>
        </div>
       </div>
      </section>
      </main>
      <datalist id="symlist"></datalist>
      <div id="toasts"></div>
      <dialog id="settingsDlg">
       <h2 style={{marginTop:'0'}}>설정</h2>
       <div className="form">
        <label>총 투자금 (USDT)<input type="number" id="sCap" /></label>
        <label>1회 손실 한도 (%)<input type="number" step="0.1" id="sRisk" /></label>
        <label>일일 손실 한도 (%)<input type="number" step="0.1" id="sDaily" /></label>
        <label>기본 레버리지 (배)<input type="number" id="sLev" /></label>
        <label>펀딩비 경고 기준 (%)<input type="number" step="0.1" id="sFund" /></label>
       </div>
       <label className="kv mt" style={{display:'block'}}>코인 종목 (쉼표 구분, USDT 무기한 심볼. 원유 CL/BZ는 자동 포함)<textarea id="sSyms" rows="3" style={{width:'100%',marginTop:'4px'}}></textarea></label>
       <div className="row mt" style={{justifyContent:'space-between'}}><button className="danger" id="sReset">모든 데이터 초기화</button><div className="row"><button className="ghost" id="sCancel">닫기</button><button className="primary" id="sSave">저장</button></div></div>
      </dialog>
      <footer>데이터: 바이낸스·바이비트 공개 API (인증 키 없음, 브라우저에서 직접 호출). 모든 기록은 이 브라우저의 로컬 저장소에만 보관됩니다. 투자 판단과 책임은 본인에게 있습니다.</footer>
    </>
  );
}
