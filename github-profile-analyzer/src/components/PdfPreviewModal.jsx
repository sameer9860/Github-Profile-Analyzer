import { useEffect } from "react";

export default function PdfPreviewModal({
  open,
  previewUrl,
  busy,
  disabledActions,
  onClose,
  onDownload,
  onPrint,
  filename,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const actionsDisabled = disabledActions || busy;
  const cancelDisabled = (busy && !previewUrl) || disabledActions;

  return (
    <div
      className="pdf-preview-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
      onClick={onClose}
    >
      <div
        className="pdf-preview-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdf-preview-header">
          <h2 id="pdf-preview-title">Print preview</h2>
          <p className="pdf-preview-sub">
            Review the layout, then download a polished PDF or print.
          </p>
          <button
            type="button"
            className="pdf-preview-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
        <div className="pdf-preview-body">
          {busy && (
            <div className="pdf-preview-loading">Preparing preview…</div>
          )}
          {!busy && previewUrl && (
            <div className="pdf-preview-sheet">
              <img
                src={previewUrl}
                alt="Document preview"
                className="pdf-preview-img"
              />
            </div>
          )}
        </div>
        <div className="pdf-preview-footer">
          <button
            type="button"
            className="pdf-preview-btn pdf-preview-btn--ghost"
            onClick={onClose}
            disabled={cancelDisabled}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pdf-preview-btn pdf-preview-btn--ghost"
            onClick={onPrint}
            disabled={actionsDisabled || !previewUrl}
          >
            Print
          </button>
          <button
            type="button"
            className="pdf-preview-btn pdf-preview-btn--primary"
            onClick={onDownload}
            disabled={actionsDisabled || !previewUrl}
          >
            {disabledActions ? "Saving…" : "Download PDF"}
          </button>
        </div>
        {filename && (
          <p className="pdf-preview-filename" title={filename}>
            {filename}
          </p>
        )}
      </div>
    </div>
  );
}
