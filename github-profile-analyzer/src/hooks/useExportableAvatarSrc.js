import { useState, useEffect } from "react";

/**
 * Loads the avatar via fetch → data URL so the bitmap is fully same-origin for
 * html2canvas / html-to-image (blob: URLs and cross-origin <img> often omit or
 * taint the capture).
 *
 * `exportReady` is false until we have a data URL or give up on fetch (HTTPS fallback).
 */
export function useExportableAvatarSrc(avatarUrl) {
  const [src, setSrc] = useState(avatarUrl || "");
  const [exportReady, setExportReady] = useState(() => !avatarUrl);

  useEffect(() => {
    if (!avatarUrl) {
      setSrc("");
      setExportReady(true);
      return;
    }

    let cancelled = false;

    setExportReady(false);
    setSrc(avatarUrl);

    (async () => {
      try {
        const res = await fetch(avatarUrl, { mode: "cors" });
        if (!res.ok) throw new Error("avatar fetch failed");
        const blob = await res.blob();
        if (cancelled) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          if (cancelled) return;
          if (typeof reader.result === "string") {
            setSrc(reader.result);
            setExportReady(true);
          } else {
            setSrc(avatarUrl);
            setExportReady(true);
          }
        };
        reader.onerror = () => {
          if (cancelled) return;
          setSrc(avatarUrl);
          setExportReady(true);
        };
        reader.readAsDataURL(blob);
      } catch {
        if (cancelled) return;
        setSrc(avatarUrl);
        setExportReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [avatarUrl]);

  return { src, exportReady };
}
