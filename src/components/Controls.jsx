import { FILTERS } from '../data/seatConfig.js';

export default function Controls({ filter, query, onFilterChange, onQueryChange, onReset }) {
  return (
    <section className="control-bar" aria-label="좌석 검색 및 필터">
      <div className="filter-tabs">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            className={`filter-tab ${filter === item.id ? 'selected' : ''}`}
            type="button"
            onClick={() => onFilterChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="search-actions">
        <label className="search-box">
          <span>좌석</span>
          <input
            value={query}
            inputMode="numeric"
            placeholder="번호 검색"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <button className="button secondary" type="button" onClick={onReset}>
          전체 초기화
        </button>
      </div>
    </section>
  );
}
