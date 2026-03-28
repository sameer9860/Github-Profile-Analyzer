import { useState, useRef } from "react";
import {
  captureElementToCanvas,
  saveCanvasAsPolishedPdf,
} from "../utils/exportPdf";
import PdfPreviewModal from "./PdfPreviewModal";

function PdfGlyph({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  );
}

function PreviewGlyph({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ExportPdfButton({
  targetRef,
  filename,
  disabled = false,
  subtitle = "",
  variant = "default",
}) {
  const [previewCapturing, setPreviewCapturing] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const canvasRef = useRef(null);

  const captureOpts = {
    variant: variant === "comparison" ? "comparison" : "default",
  };

  const anyBusy = previewCapturing || pdfBusy || saving;

  function handleClose() {
    setPreviewOpen(false);
    setPreviewUrl("");
    canvasRef.current = null;
    setSaving(false);
  }

  async function openPreview() {
    const el = targetRef?.current;
    if (!el || disabled || anyBusy) return;
    setPreviewCapturing(true);
    setPreviewUrl("");
    try {
      el.scrollIntoView({ block: "start" });
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
      const canvas = await captureElementToCanvas(el, captureOpts);
      canvasRef.current = canvas;
      setPreviewUrl(canvas.toDataURL("image/png"));
      setPreviewOpen(true);
    } catch (e) {
      console.error(e);
      setPreviewOpen(false);
      window.alert(
        "Could not capture the page for preview. Try again in a moment."
      );
    } finally {
      setPreviewCapturing(false);
    }
  }

  async function downloadDirectPdf() {
    const el = targetRef?.current;
    if (!el || disabled || anyBusy) return;
    setPdfBusy(true);
    try {
      el.scrollIntoView({ block: "start" });
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
      const canvas = await captureElementToCanvas(el, captureOpts);
      await saveCanvasAsPolishedPdf(canvas, filename, { subtitle });
    } catch (e) {
      console.error(e);
      window.alert("Could not create the PDF. Try again in a moment.");
    } finally {
      setPdfBusy(false);
    }
  }

  async function handleDownloadFromModal() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      await saveCanvasAsPolishedPdf(canvas, filename, { subtitle });
      handleClose();
    } catch (e) {
      console.error(e);
      window.alert("Could not build the PDF. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    if (!previewUrl) return;
    const w = window.open("", "_blank");
    if (!w) {
      window.alert("Allow pop-ups to print from preview.");
      return;
    }
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Print</title>
      <style>
        body{margin:0;background:#eef1f6;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:16px;box-sizing:border-box}
        img{max-width:100%;height:auto;border-radius:10px;box-shadow:0 8px 40px rgba(15,23,42,.12);background:#fafbfc}
      </style></head><body>
      <img src="${previewUrl}" alt="" onload="window.print()"/>
      </body></html>`
    );
    w.document.close();
  }

  const capturing = previewCapturing && !previewUrl;

  return (
    <>
      <div className="pdf-export-actions-row">
        <button
          type="button"
          className="pdf-export-btn pdf-export-btn--preview"
          onClick={openPreview}
          disabled={disabled || anyBusy}
          aria-label="Open print preview"
          title="Preview before downloading"
        >
          {capturing ? (
            <span className="pdf-export-btn__busy" aria-hidden />
          ) : (
            <PreviewGlyph className="pdf-export-btn__icon" />
          )}
          <span className="pdf-export-btn__label">Preview</span>
        </button>
        <button
          type="button"
          className="pdf-export-btn"
          onClick={downloadDirectPdf}
          disabled={disabled || anyBusy}
          aria-label="Download PDF"
          title="Download PDF without preview"
        >
          {pdfBusy ? (
            <span className="pdf-export-btn__busy" aria-hidden />
          ) : (
            <PdfGlyph className="pdf-export-btn__icon" />
          )}
          <span className="pdf-export-btn__label">PDF</span>
        </button>
      </div>

      <PdfPreviewModal
        open={previewOpen}
        previewUrl={previewUrl}
        busy={capturing}
        disabledActions={saving}
        filename={filename}
        onClose={handleClose}
        onDownload={handleDownloadFromModal}
        onPrint={handlePrint}
      />
    </>
  );
}
