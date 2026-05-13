import { Fragment } from 'react';
import SeatCard from './SeatCard.jsx';

export default function SeatGrid({ seats, visibleSeatIds, onSeatClick }) {
  return (
    <section className="lab-map" aria-label="실습실 좌석 배치도">
      <div className="screen-area">SCREEN / FRONT</div>
      <div className="seat-grid">
        {seats.map((seat, index) => {
          const shouldInsertAisle = (index + 1) % 6 === 2 || (index + 1) % 6 === 4;

          return (
            <Fragment key={seat.id}>
              <SeatCard
                seat={seat}
                muted={!visibleSeatIds.has(seat.id)}
                onClick={() => onSeatClick(seat.id)}
              />
              {shouldInsertAisle ? <div className="aisle" aria-hidden="true" /> : null}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
