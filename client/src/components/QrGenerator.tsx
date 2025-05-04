import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
}

export default function QrGenerator({
  value,
  size = 256,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "M",
  includeMargin = true,
}: QrGeneratorProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      includeMargin={includeMargin}
    />
  );
}
