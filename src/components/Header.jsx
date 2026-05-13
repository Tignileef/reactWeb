export default function Header({ stats, clock, onHome }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="title-group">
          <button className="icon-button" type="button" onClick={onHome} aria-label="시작 화면">
            홈
          </button>
          <div>
            <p className="eyebrow">컴퓨터소프트웨어공학과</p>
            <h1>스마트 실습실 좌석 관리</h1>
          </div>
        </div>
        <span className="demo-badge">시연 모드 1H = 5s</span>
      </div>

      <div className="dashboard" aria-label="좌석 현황">
        <StatusCard label="잔여 좌석" value={stats.emptyCount} tone="blue" />
        <StatusCard label="사용 중" value={stats.activeCount} tone="green" />
        <StatusCard label="수리 필요" value={stats.brokenCount} tone="red" />
        <StatusCard label="이용률" value={`${stats.usageRate}%`} tone="amber" />
        <StatusCard label="현재 시각" value={clock} />
      </div>
    </header>
  );
}

function StatusCard({ label, value, tone = 'default' }) {
  return (
    <div className={`status-card ${tone}`}>
      <span className="status-label">{label}</span>
      <strong className="status-value">{value}</strong>
    </div>
  );
}
