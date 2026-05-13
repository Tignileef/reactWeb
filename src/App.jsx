import { useCallback, useEffect, useMemo, useState } from 'react';
import Controls from './components/Controls.jsx';
import Header from './components/Header.jsx';
import Modal from './components/Modal.jsx';
import SeatGrid from './components/SeatGrid.jsx';
import ToastStack from './components/ToastStack.jsx';
import { SESSION_TYPES, TOTAL_SEATS, createInitialSeats } from './data/seatConfig.js';
import { formatTime } from './utils/time.js';

const STORAGE_KEY = 'smart-lab-seat-state-v1';

function loadStoredSeats() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    if (Array.isArray(parsed) && parsed.length === TOTAL_SEATS) {
      return parsed;
    }
  } catch {
    return createInitialSeats();
  }

  return createInitialSeats();
}

export default function App() {
  const [seats, setSeats] = useState(loadStoredSeats);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [selectedType, setSelectedType] = useState('major');
  const [activeModal, setActiveModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showStart, setShowStart] = useState(true);
  const [clock, setClock] = useState(getClockText);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, tone = 'default') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seats));
  }, [seats]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(getClockText()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeats((currentSeats) => {
        const expiredSeats = [];
        let changed = false;

        const nextSeats = currentSeats.map((seat) => {
          if (seat.status !== 'active') {
            return seat;
          }

          const nextRemainTime = seat.remainTime - 1;
          changed = true;

          if (nextRemainTime <= 0) {
            expiredSeats.push(seat.id);
            return { ...seat, status: 'empty', type: null, remainTime: 0, assignedAt: null };
          }

          return { ...seat, remainTime: nextRemainTime };
        });

        if (expiredSeats.length > 0) {
          window.setTimeout(() => {
            expiredSeats.forEach((id) => {
              addToast(`${id}번 좌석 시간이 종료되어 자동 퇴실되었습니다.`, 'warning');
            });
          }, 0);
        }

        return changed ? nextSeats : currentSeats;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [addToast]);

  const stats = useMemo(() => {
    const activeCount = seats.filter((seat) => seat.status === 'active').length;
    const brokenCount = seats.filter((seat) => seat.status === 'broken').length;
    const emptyCount = TOTAL_SEATS - activeCount - brokenCount;
    const usageRate = Math.round((activeCount / TOTAL_SEATS) * 100);

    return { activeCount, brokenCount, emptyCount, usageRate };
  }, [seats]);

  const visibleSeatIds = useMemo(() => {
    const normalizedQuery = query.trim();

    return new Set(
      seats
        .filter((seat) => filter === 'all' || seat.status === filter)
        .filter((seat) => !normalizedQuery || String(seat.id).includes(normalizedQuery))
        .map((seat) => seat.id),
    );
  }, [filter, query, seats]);

  const selectedSeat = seats.find((seat) => seat.id === selectedSeatId);

  function handleSeatClick(id) {
    const seat = seats.find((item) => item.id === id);
    setSelectedSeatId(id);

    if (seat.status === 'active') {
      setActiveModal('checkout');
      return;
    }

    if (seat.status === 'broken') {
      setActiveModal('repair');
      return;
    }

    setSelectedType('major');
    setActiveModal('checkin');
  }

  function closeModal() {
    setActiveModal(null);
  }

  function confirmCheckIn() {
    const session = SESSION_TYPES[selectedType];

    setSeats((currentSeats) =>
      currentSeats.map((seat) =>
        seat.id === selectedSeatId
          ? {
              ...seat,
              status: 'active',
              type: selectedType,
              remainTime: session.demoSeconds,
              assignedAt: new Date().toISOString(),
            }
          : seat,
      ),
    );
    closeModal();
    addToast(`${selectedSeatId}번 좌석 입실이 완료되었습니다.`, 'success');
  }

  function confirmCheckOut() {
    setSeats((currentSeats) =>
      currentSeats.map((seat) =>
        seat.id === selectedSeatId
          ? { ...seat, status: 'empty', type: null, remainTime: 0, assignedAt: null }
          : seat,
      ),
    );
    closeModal();
    addToast(`${selectedSeatId}번 좌석 퇴실이 완료되었습니다.`);
  }

  function reportBrokenSeat() {
    setSeats((currentSeats) =>
      currentSeats.map((seat) =>
        seat.id === selectedSeatId
          ? { ...seat, status: 'broken', type: null, remainTime: 0, assignedAt: null }
          : seat,
      ),
    );
    closeModal();
    addToast(`${selectedSeatId}번 좌석이 수리 필요 상태로 변경되었습니다.`, 'warning');
  }

  function completeRepair() {
    setSeats((currentSeats) =>
      currentSeats.map((seat) =>
        seat.id === selectedSeatId
          ? { ...seat, status: 'empty', type: null, remainTime: 0, assignedAt: null }
          : seat,
      ),
    );
    closeModal();
    addToast(`${selectedSeatId}번 좌석 수리 처리가 완료되었습니다.`, 'success');
  }

  function resetAllSeats() {
    setSeats(createInitialSeats());
    setQuery('');
    setFilter('all');
    closeModal();
    addToast('전체 좌석 상태를 초기화했습니다.');
  }

  return (
    <div className="app-shell">
      <div className="kiosk-container">
        <StartScreen visible={showStart} onStart={() => setShowStart(false)} />

        <Header stats={stats} clock={clock} onHome={() => setShowStart(true)} />

        <main>
          <Controls
            filter={filter}
            query={query}
            onFilterChange={setFilter}
            onQueryChange={setQuery}
            onReset={() => setActiveModal('reset')}
          />

          <SeatGrid seats={seats} visibleSeatIds={visibleSeatIds} onSeatClick={handleSeatClick} />
        </main>

        <Modal open={activeModal === 'checkin'} title={`${selectedSeatId}번 좌석 입실`} onClose={closeModal}>
          <p className="modal-description">이용할 수업 유형을 선택하세요.</p>
          <div className="session-options">
            {Object.entries(SESSION_TYPES).map(([type, session]) => (
              <button
                key={type}
                className={`session-option ${selectedType === type ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedType(type)}
              >
                <strong>{session.label}</strong>
                <span>{session.timeLabel}</span>
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button className="button primary" type="button" onClick={confirmCheckIn}>
              입실하기
            </button>
            <button className="button secondary" type="button" onClick={closeModal}>
              취소
            </button>
          </div>
        </Modal>

        <Modal open={activeModal === 'checkout'} title="좌석 사용 관리" onClose={closeModal} tone="danger">
          <div className="seat-summary">
            <strong>{selectedSeatId}번 좌석</strong>
            <span>남은 시간 {selectedSeat ? formatTime(selectedSeat.remainTime) : '00:00'}</span>
          </div>
          <div className="modal-actions">
            <button className="button danger" type="button" onClick={confirmCheckOut}>
              퇴실 처리
            </button>
            <button className="button warning" type="button" onClick={reportBrokenSeat}>
              고장 신고
            </button>
            <button className="button secondary" type="button" onClick={closeModal}>
              계속 사용
            </button>
          </div>
        </Modal>

        <Modal open={activeModal === 'repair'} title="관리자 수리 처리" onClose={closeModal}>
          <p className="modal-description">{selectedSeatId}번 좌석의 수리가 완료되었습니까?</p>
          <div className="modal-actions">
            <button className="button repair" type="button" onClick={completeRepair}>
              수리 완료
            </button>
            <button className="button secondary" type="button" onClick={closeModal}>
              닫기
            </button>
          </div>
        </Modal>

        <Modal open={activeModal === 'reset'} title="전체 좌석 초기화" onClose={closeModal} tone="danger">
          <p className="modal-description">
            모든 입실, 고장, 수리 상태를 초기 상태로 되돌립니다.
          </p>
          <div className="modal-actions">
            <button className="button danger" type="button" onClick={resetAllSeats}>
              초기화 실행
            </button>
            <button className="button secondary" type="button" onClick={closeModal}>
              취소
            </button>
          </div>
        </Modal>

        <ToastStack toasts={toasts} />
      </div>
    </div>
  );
}

function StartScreen({ visible, onStart }) {
  return (
    <section className={`start-screen ${visible ? '' : 'hidden'}`} aria-hidden={!visible}>
      <div className="start-brand">
        <span className="start-mark">LAB</span>
        <h2>스마트 좌석 배정</h2>
        <p>컴퓨터소프트웨어공학과 실습실</p>
      </div>
      <button className="start-button" type="button" onClick={onStart}>
        시작하기
      </button>
    </section>
  );
}

function getClockText() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
