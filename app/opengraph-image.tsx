import { ImageResponse } from "next/og";

// force-static keeps the OG image prerenderable in static export mode
// (GitHub Pages pipeline) without changing normal deployments.
export const dynamic = "force-static";

export const alt = "ATHA Security — AI-Native Cybersecurity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060a",
          position: "relative",
        }}
      >
        {/* grid dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* glows */}
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(77,159,255,0.35), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 140,
            bottom: 80,
            width: 340,
            height: 340,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(255,138,43,0.22), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#ff8a2b",
              boxShadow: "0 0 24px rgba(255,138,43,0.9)",
            }}
          />
          <div
            style={{
              color: "#f2f5f7",
              fontSize: 26,
              letterSpacing: 10,
              fontWeight: 600,
            }}
          >
            ATHA SECURITY
          </div>
        </div>

        <div
          style={{
            marginTop: 34,
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2,
            textAlign: "center",
            maxWidth: 950,
            lineHeight: 1.1,
          }}
        >
          Security for the software you build.
        </div>

        <div
          style={{
            marginTop: 30,
            color: "rgba(242,245,247,0.55)",
            fontSize: 27,
            textAlign: "center",
            maxWidth: 860,
            lineHeight: 1.4,
          }}
        >
          A coordinated security system built around specialized agents for
          detection, analysis, response and verification.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            gap: 14,
          }}
        >
          {["DETECTION", "ANALYSIS", "RESPONSE", "VERIFICATION"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                color: "rgba(242,245,247,0.6)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 15,
                letterSpacing: 4,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
