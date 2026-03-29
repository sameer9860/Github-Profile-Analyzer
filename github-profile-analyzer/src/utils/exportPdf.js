/**
 * Sanitize a string for use as a filename segment.
 */
export function safeFilenameSegment(name) {
  if (!name || typeof name !== "string") return "export";
  const s = name.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 80) || "export";
}

const MAX_CANVAS_EDGE = 12000;
const PDF_MAX_CANVAS_EDGE = 8192;

/** 1×1 transparent PNG — avoids html-to-image rejecting failed image fetches */
const IMAGE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function computeScale(element) {
  const rect = element.getBoundingClientRect();
  const sw = Math.max(
    1,
    element.scrollWidth,
    element.offsetWidth,
    Math.ceil(rect.width)
  );
  const sh = Math.max(
    1,
    element.scrollHeight,
    element.offsetHeight,
    Math.ceil(rect.height)
  );

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  let scale = Math.min(2, Math.max(1, dpr * 1.1));

  while (sw * scale > MAX_CANVAS_EDGE || sh * scale > MAX_CANVAS_EDGE) {
    scale *= 0.85;
    if (scale < 0.55) {
      scale = 0.55;
      break;
    }
  }

  return { scale, sw, sh };
}

/** Wait until all <img> descendants have finished loading (avatars, etc.). */
function waitForImages(container) {
  const imgs = container.querySelectorAll("img");
  return Promise.all(
    Array.from(imgs).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        })
    )
  );
}

function assertCanvasExportable(canvas) {
  if (!canvas || canvas.width < 2 || canvas.height < 2) {
    throw new Error("Capture produced an empty image");
  }
  try {
    canvas.toDataURL("image/png", 0.92);
  } catch {
    throw new Error(
      "Cannot export this page to PDF (blocked image). Try refreshing the page."
    );
  }
}

/**
 * html2canvas clone: strip blur, reset motion/CSS transforms on HTML only (not SVG/Recharts).
 */
function applyHtml2CanvasCloneFixes(clonedDoc, clonedEl, variant) {
  clonedEl.style.overflow = "visible";

  clonedDoc.querySelectorAll("*").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.closest("svg")) return;

    node.style.setProperty("backdrop-filter", "none", "important");
    node.style.setProperty("-webkit-backdrop-filter", "none", "important");
    node.style.setProperty("transform", "none", "important");
    node.style.setProperty("filter", "none", "important");
    node.style.setProperty("opacity", "1", "important");
    node.style.setProperty("mix-blend-mode", "normal", "important");
    node.style.setProperty("clip-path", "none", "important");
    node.style.setProperty("overflow", "visible", "important");
  });

  clonedDoc.querySelectorAll("svg").forEach((svg) => {
    svg.style.overflow = "visible";
  });

  clonedDoc.querySelectorAll(".metric-card").forEach((n) => {
    n.style.overflow = "visible";
  });

  if (variant === "comparison") {
    clonedDoc.querySelectorAll(".comparison-grid").forEach((grid) => {
      grid.style.overflow = "visible";
    });
    clonedDoc.querySelectorAll(".comparison-item").forEach((item) => {
      item.style.marginLeft = "0";
      item.style.marginRight = "0";
      item.style.filter = "none";
    });
  }
}

/** html2canvas options; `foreignObjectRendering` helps Recharts/SVG render correctly */
function buildHtml2CanvasOptions(
  backgroundColor,
  pixelRatio,
  variant,
  extra = {}
) {
  const { foreignObjectRendering = true } = extra;
  return {
    scale: pixelRatio,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor,
    imageTimeout: 25000,
    width: 1200,
    windowWidth: 1200,
    foreignObjectRendering,
    onclone(clonedDoc, clonedEl) {
      applyHtml2CanvasCloneFixes(clonedDoc, clonedEl, variant);
    },
  };
}

/**
 * Full-size canvas of a DOM node (for preview + PDF).
 * Primary: html2canvas + foreignObject (reliable for Recharts/SVG + real pixels).
 * Fallback: raster path, then html-to-image without forced width/height (avoids empty foreignObject).
 */
export async function captureElementToCanvas(element, options = {}) {
  if (!element) {
    throw new Error("Nothing to capture");
  }

  const bgPrimary = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-primary")
    .trim();
  const backgroundColor =
    bgPrimary && bgPrimary !== "" ? bgPrimary : "#0a0c10";

  const originalStyles = {
    position: element.style.position,
    top: element.style.top,
    left: element.style.left,
    width: element.style.width,
    zIndex: element.style.zIndex,
    margin: element.style.margin,
    padding: element.style.padding,
    backgroundColor: element.style.backgroundColor,
  };

  const bodyOverflow = document.body.style.overflow;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  try {
    // Force a clean state at the top for fixed capture
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    element.classList.add("pdf-capture-active");
    element.scrollTop = 0;

    // Small delay for layout recalculation
    await new Promise((r) => requestAnimationFrame(() => r()));
    await waitForImages(element);
    await new Promise((r) => setTimeout(r, 150));

    const { variant = "default" } = options;
    const pixelRatio = 2; // High quality fixed ratio for 1200px

    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;

      let canvas;
      try {
        canvas = await html2canvas(
          element,
          buildHtml2CanvasOptions(backgroundColor, pixelRatio, variant, {
            foreignObjectRendering: true,
          })
        );
      } catch (e1) {
        console.warn("html2canvas (foreignObject) failed, retrying raster…", e1);
        try {
          canvas = await html2canvas(
            element,
            buildHtml2CanvasOptions(backgroundColor, pixelRatio, variant, {
              foreignObjectRendering: false,
            })
          );
        } catch (e2) {
          console.warn(
            "html2canvas (raster) failed, last html2canvas attempt…",
            e2
          );
          canvas = await html2canvas(
            element,
            buildHtml2CanvasOptions(
              backgroundColor,
              Math.min(1.25, pixelRatio),
              variant,
              {
                foreignObjectRendering: true,
              }
            )
          );
        }
      }

      assertCanvasExportable(canvas);
      return canvas;
    } catch (e) {
      console.warn("html2canvas failed:", e);
    }

    try {
      const htmlToImageModule = await import("html-to-image");
      const toCanvas = htmlToImageModule.toCanvas;
      const opts = {
        pixelRatio,
        backgroundColor,
        width: 1200,
        cacheBust: true,
        skipFonts: true,
        imagePlaceholder: IMAGE_PLACEHOLDER,
        fetchRequestInit: { mode: "cors", credentials: "omit" },
      };

      let canvas = await toCanvas(element, opts);
      assertCanvasExportable(canvas);
      return canvas;
    } catch (e) {
      console.warn("html-to-image (natural size) failed:", e);
    }

    try {
      const htmlToImageModule = await import("html-to-image");
      const toCanvas = htmlToImageModule.toCanvas;
      const width = Math.max(
        1,
        element.scrollWidth,
        element.offsetWidth,
        element.clientWidth
      );
      const height = Math.max(
        1,
        element.scrollHeight,
        element.offsetHeight,
        element.clientHeight
      );

      const lastCanvas = await toCanvas(element, {
        width: 1200,
        height,
        pixelRatio,
        backgroundColor,
        cacheBust: true,
        skipFonts: true,
        imagePlaceholder: IMAGE_PLACEHOLDER,
        fetchRequestInit: { mode: "cors", credentials: "omit" },
      });
      assertCanvasExportable(lastCanvas);
      return lastCanvas;
    } catch (e) {
      console.warn("html-to-image capture failed:", e);
      throw e;
    }
  } catch (e) {
    console.error(e);
    throw new Error("Could not capture the page");
  } finally {
    element.classList.remove("pdf-capture-active");
    Object.assign(element.style, originalStyles);
    document.body.style.overflow = bodyOverflow;
    window.scrollTo(scrollX, scrollY);
  }
}

/**
 * Shrink very large canvases so jsPDF addImage stays reliable.
 */
function clampCanvasForPdf(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const maxW = PDF_MAX_CANVAS_EDGE;
  const maxH = PDF_MAX_CANVAS_EDGE;
  if (w <= maxW && h <= maxH) return canvas;
  const s = Math.min(maxW / w, maxH / h);
  const nw = Math.max(2, Math.floor(w * s));
  const nh = Math.max(2, Math.floor(h * s));
  const out = document.createElement("canvas");
  out.width = nw;
  out.height = nh;
  const ctx = out.getContext("2d");
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, nw, nh);
  return out;
}

/**
 * Builds a styled multi-page PDF from a canvas.
 */
export async function saveCanvasAsPolishedPdf(canvas, filename, options = {}) {
  const { subtitle = "" } = options;

  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.jsPDF;

  const forPdf = clampCanvasForPdf(canvas);

  let imgData;
  let imgFormat = "PNG";
  try {
    imgData = forPdf.toDataURL("image/png", 0.92);
  } catch {
    try {
      imgData = forPdf.toDataURL("image/jpeg", 0.88);
      imgFormat = "JPEG";
    } catch {
      throw new Error("Could not read canvas for PDF");
    }
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const marginX = 9;
  const headerBand = 17;
  const footerBand = 9;
  const innerW = pageW - 2 * marginX;
  const innerH = pageH - headerBand - footerBand;

  const imgWidth = innerW;
  const imgHeight = (forPdf.height * imgWidth) / forPdf.width;

  if (!Number.isFinite(imgHeight) || imgHeight <= 0) {
    throw new Error("Invalid PDF layout");
  }

  const drawPageBackground = () => {
    pdf.setFillColor(250, 251, 253);
    pdf.rect(0, 0, pageW, pageH, "F");
    pdf.setFillColor(88, 166, 255);
    pdf.rect(0, 0, pageW, 4, "F");
    pdf.setDrawColor(218, 226, 238);
    pdf.setLineWidth(0.15);
    pdf.line(marginX, headerBand - 1, pageW - marginX, headerBand - 1);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(66, 74, 88);
    pdf.text("GitHub Profile Analyzer", marginX, 12);
    if (subtitle) {
      pdf.setFontSize(7.4);
      pdf.setTextColor(108, 116, 132);
      const short =
        subtitle.length > 92 ? `${subtitle.slice(0, 89)}…` : subtitle;
      pdf.text(short, pageW - marginX, 12, { align: "right" });
    }
  };

  const drawWatermark = () => {
    try {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(233, 236, 242);
      pdf.text("GitHub Profile Analyzer", pageW / 2, pageH / 2 + 6, {
        align: "center",
        angle: 32,
      });
    } catch {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(230, 232, 238);
      pdf.text("GitHub Profile Analyzer", marginX, pageH - footerBand - 2);
    }
    pdf.setFont("helvetica", "normal");
  };

  let heightLeft = imgHeight;
  let position = 0;

  drawPageBackground();
  try {
    pdf.addImage(
      imgData,
      imgFormat,
      marginX,
      headerBand + position,
      imgWidth,
      imgHeight
    );
  } catch (e) {
    console.error("addImage failed, retrying JPEG…", e);
    const jpeg = forPdf.toDataURL("image/jpeg", 0.85);
    pdf.addImage(jpeg, "JPEG", marginX, headerBand + position, imgWidth, imgHeight);
  }
  drawWatermark();
  heightLeft -= innerH;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    drawPageBackground();
    try {
      pdf.addImage(
        imgData,
        imgFormat,
        marginX,
        headerBand + position,
        imgWidth,
        imgHeight
      );
    } catch {
      const jpeg = forPdf.toDataURL("image/jpeg", 0.85);
      pdf.addImage(
        jpeg,
        "JPEG",
        marginX,
        headerBand + position,
        imgWidth,
        imgHeight
      );
    }
    drawWatermark();
    heightLeft -= innerH;
  }

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(128, 134, 145);
    pdf.text(`Page ${i} of ${totalPages}`, pageW / 2, pageH - 4, {
      align: "center",
    });
  }

  pdf.save(filename);
}

/**
 * One-shot export (no preview).
 */
export async function exportElementToPdf(
  element,
  filename = "export.pdf",
  options = {}
) {
  const canvas = await captureElementToCanvas(element, options);
  await saveCanvasAsPolishedPdf(canvas, filename, options);
}