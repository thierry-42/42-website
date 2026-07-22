import { ImageResponse } from "next/og";

export const size = { height: 64, width: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#090B10",
        color: "#C7FF4A",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        fontSize: 29,
        fontWeight: 800,
        height: "100%",
        justifyContent: "center",
        letterSpacing: "-3px",
        width: "100%",
      }}
    >
      42
    </div>,
    size,
  );
}
