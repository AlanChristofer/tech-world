import { ImageResponse } from "next/og";

export const socialImageAlt = "Alan Christofer — Tech World";
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";

export function createSocialImage(markUrl: string) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", color: "#effffb", background: "#020b0e", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", width: 620, height: 620, right: -80, top: -165, borderRadius: "50%", border: "2px solid #167f86", background: "radial-gradient(circle at 34% 32%, #1c7180 0%, #09242d 36%, #02090c 70%)", boxShadow: "0 0 70px rgba(61, 230, 215, .35)" }} />
      <div style={{ position: "absolute", width: 520, height: 260, right: 55, top: 150, borderRadius: "50%", borderTop: "5px dashed #55f6cf", transform: "rotate(-12deg)" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 720, padding: "70px 0 70px 78px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={markUrl} width="76" height="76" alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#55f6cf", fontSize: 25, fontWeight: 800, letterSpacing: 4 }}>TECH WORLD</div>
            <div style={{ display: "flex", marginTop: 8, color: "#8db9b7", fontSize: 12, fontWeight: 700, letterSpacing: 5 }}>DEVELOPER PORTFOLIO</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontSize: 72, fontWeight: 800, lineHeight: .94, letterSpacing: -4 }}><span>ALAN</span><span>CHRISTOFER</span></div>
        <div style={{ display: "flex", marginTop: 28, color: "#9db7b2", fontSize: 27 }}>Software Developer · APIs · Arquitetura · Full Stack</div>
        <div style={{ display: "flex", width: 120, height: 4, marginTop: 34, background: "#55f6cf" }} />
      </div>
    </div>,
    socialImageSize,
  );
}
