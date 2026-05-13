export default function Modal({ open, title, children, onClose, tone = 'default' }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal-content ${tone}`}>
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="close-button" type="button" onClick={onClose} aria-label="닫기">
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
