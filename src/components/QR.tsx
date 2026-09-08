import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QR({ text, size = 180 }: { text: string; size?: number }) {
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(text, { width: size * 2, margin: 1, errorCorrectionLevel: "M" })
      .then(setSrc)
      .catch(() => setSrc(""));
  }, [text, size]);
  if (!src) return <div style={{ width: size, height: size, background: "var(--surface-3)", borderRadius: 8 }} />;
  return (
    <img
      src={src}
      alt="QR code do link"
      width={size}
      height={size}
      style={{ borderRadius: 8, background: "#fff", padding: 6, display: "block" }}
    />
  );
}
