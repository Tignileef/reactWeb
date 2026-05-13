import { SESSION_TYPES } from '../data/seatConfig.js';
import { formatTime } from '../utils/time.js';

export default function SeatCard({ seat, muted, onClick }) {
  const session = seat.type ? SESSION_TYPES[seat.type] : null;
  const statusLabel = {
    empty: '사용 가능',
    active: '사용 중',
    broken: '수리 필요',
  }[seat.status];

  return (
    <button
      className={`seat ${seat.status} ${muted ? 'muted' : ''}`}
      type="button"
      onClick={onClick}
      aria-label={`${seat.id}번 좌석 ${statusLabel}`}
    >
      {seat.status === 'active' ? (
        <>
          <span className={`type-badge ${seat.type}`}>{session.shortLabel}</span>
          <strong className="seat-number">{seat.id}</strong>
          <span className="timer">{formatTime(seat.remainTime)}</span>
        </>
      ) : (
        <>
          <strong className="seat-number">{seat.id}</strong>
          <span className="seat-state">{statusLabel}</span>
        </>
      )}
    </button>
  );
}
