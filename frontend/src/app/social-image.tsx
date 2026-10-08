import { ImageResponse } from "next/og";

export const socialImageAlt = "Tech World — portfólio de engenharia de software de Alan Christofer";
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";

type SocialImageAssets = {
  markUrl: string;
  earthDayUrl: string;
  earthLightsUrl: string;
};

const technologies = ["Java", "Spring Boot", "React", "APIs"];

export function createSocialImage({ markUrl, earthDayUrl, earthLightsUrl }: SocialImageAssets) {
  return new ImageResponse(
    <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", overflow: "hidden", color: "#effffb", background: "#020a0d", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "radial-gradient(circle at 82% 44%, rgba(31, 212, 195, .18), transparent 35%), radial-gradient(circle at 18% 88%, rgba(18, 105, 112, .12), transparent 30%), linear-gradient(120deg, #020a0d 0%, #031216 54%, #02090c 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: .2, backgroundImage: "linear-gradient(rgba(85, 246, 207, .08) 1px, transparent 1px), linear-gradient(90deg, rgba(85, 246, 207, .08) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(90deg, black, transparent 65%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, display: "flex", width: "100%", height: 4, background: "linear-gradient(90deg, #55f6cf, #42dfe5 42%, transparent 78%)" }} />
      <div style={{ position: "absolute", right: 0, bottom: 0, display: "flex", width: 460, height: 3, background: "linear-gradient(90deg, transparent, #37d9d0)" }} />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 680, padding: "58px 0 52px 70px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={markUrl} width={54} height={54} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#55f6cf", fontSize: 14, fontWeight: 800, letterSpacing: 4.8 }}>SOFTWARE ENGINEERING PORTFOLIO</div>
            <div style={{ display: "flex", marginTop: 7, color: "#688f8a", fontSize: 10, fontWeight: 700, letterSpacing: 3.5 }}>BUILDING RELIABLE DIGITAL SYSTEMS</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", marginTop: 58, fontSize: 62, fontWeight: 900, lineHeight: 1, letterSpacing: -2.6 }}>
          <span style={{ color: "#f4fffc" }}>TECH</span><span style={{ marginLeft: 16, color: "#55f6cf" }}>WORLD</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: 510, marginTop: 20 }}>
          <div style={{ display: "flex", width: 58, height: 3, background: "#55f6cf" }} /><div style={{ display: "flex", flex: 1, height: 1, background: "rgba(85, 246, 207, .16)" }} />
        </div>

        <div style={{ display: "flex", marginTop: 34, color: "#f0f7f5", fontSize: 43, fontWeight: 750, letterSpacing: -1.2 }}>Alan Christofer</div>
        <div style={{ display: "flex", marginTop: 13, color: "#a9c3be", fontSize: 22, fontWeight: 500, letterSpacing: .2 }}>Software Engineer <span style={{ margin: "0 10px", color: "#3bb9a9" }}>|</span> Full Stack Developer</div>

        <div style={{ display: "flex", gap: 10, marginTop: 38 }}>
          {technologies.map((technology) => <div key={technology} style={{ display: "flex", alignItems: "center", padding: "10px 15px", border: "1px solid rgba(85, 246, 207, .25)", borderRadius: 20, color: "#cbe0dc", background: "rgba(8, 34, 37, .76)", fontSize: 14, fontWeight: 700 }}>{technology}</div>)}
        </div>
      </div>

      <div style={{ position: "absolute", right: 26, top: 32, display: "flex", width: 520, height: 565 }}>
        <div style={{ position: "absolute", right: 14, top: 50, display: "flex", width: 452, height: 452, overflow: "hidden", border: "2px solid rgba(91, 240, 224, .56)", borderRadius: "50%", background: "#03141a", boxShadow: "0 0 58px rgba(62, 231, 217, .2), inset 0 0 44px rgba(3, 8, 12, .9)" }}>
          <img src={earthDayUrl} width={760} height={452} alt="" style={{ position: "absolute", left: -154, top: 0, width: 760, height: 452, objectFit: "cover", opacity: .78 }} />
          <img src={earthLightsUrl} width={760} height={452} alt="" style={{ position: "absolute", left: -154, top: 0, width: 760, height: 452, objectFit: "cover", opacity: .62 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", borderRadius: "50%", background: "radial-gradient(circle at 34% 28%, rgba(104, 255, 239, .16) 0%, rgba(3, 18, 24, .08) 38%, rgba(0, 4, 8, .76) 82%, #01070a 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", borderRadius: "50%", boxShadow: "inset -38px -30px 60px rgba(0, 0, 0, .72), inset 14px 10px 22px rgba(94, 255, 235, .12)" }} />
        </div>

        <div style={{ position: "absolute", right: -10, top: 154, display: "flex", width: 516, height: 246, border: "2px solid rgba(85, 246, 207, .58)", borderRadius: "50%", transform: "rotate(-17deg)", boxShadow: "0 0 16px rgba(85, 246, 207, .2)" }} />
        <div style={{ position: "absolute", right: 13, top: 179, display: "flex", width: 470, height: 205, border: "1px solid rgba(67, 186, 200, .25)", borderRadius: "50%", transform: "rotate(16deg)" }} />
        <svg width="452" height="452" viewBox="0 0 452 452" style={{ position: "absolute", right: 14, top: 50 }}>
          <path d="M75 250 C130 154 259 127 367 188" fill="none" stroke="#55f6cf" strokeWidth="2.5" strokeDasharray="8 8" />
          <path d="M118 330 C190 286 260 284 345 318" fill="none" stroke="#44cdd1" strokeWidth="1.8" strokeDasharray="5 8" opacity=".8" />
          <path d="M120 148 C196 198 248 222 333 230" fill="none" stroke="#8fffee" strokeWidth="1.4" opacity=".52" />
          <circle cx="75" cy="250" r="6" fill="#55f6cf" /><circle cx="75" cy="250" r="13" fill="none" stroke="#55f6cf" strokeWidth="1" opacity=".45" />
          <circle cx="240" cy="139" r="5" fill="#b0fff3" /><circle cx="367" cy="188" r="6" fill="#55f6cf" /><circle cx="118" cy="330" r="4" fill="#42dfe5" /><circle cx="345" cy="318" r="5" fill="#42dfe5" />
        </svg>
        <div style={{ position: "absolute", right: 12, top: 113, display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, border: "1px solid rgba(85, 246, 207, .42)", borderRadius: "50%", background: "rgba(5, 27, 31, .92)", boxShadow: "0 0 18px rgba(85, 246, 207, .28)", transform: "rotate(18deg)" }}><span style={{ display: "flex", width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "13px solid #effffb" }} /></div>
        <div style={{ position: "absolute", right: 78, bottom: 13, display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", border: "1px solid rgba(85, 246, 207, .22)", borderRadius: 18, color: "#8eb6b0", background: "rgba(2, 14, 17, .86)", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>
          <span style={{ display: "flex", width: 7, height: 7, borderRadius: "50%", background: "#55f6cf", boxShadow: "0 0 9px #55f6cf" }} />SYSTEMS CONNECTED
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
