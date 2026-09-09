/** CSS-only hero fallback when WebGL is unavailable. */
export function WebGLFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05060a]">
      <div className="grid-bg grid-fade absolute inset-0 opacity-70" />
      <div
        className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(77,159,255,0.5), rgba(77,159,255,0.12), transparent)",
        }}
      />
      <div
        className="absolute bottom-[12%] left-[22%] h-[180px] w-[180px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(255,138,43,0.55), transparent)",
        }}
      />
      {/* minimal city silhouette */}
      <svg
        className="absolute bottom-0 left-1/2 w-[900px] max-w-none -translate-x-1/2 opacity-[0.35]"
        viewBox="0 0 900 180"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="rgba(148,180,220,0.5)" strokeWidth="1">
          <rect x="60" y="80" width="46" height="100" />
          <rect x="130" y="40" width="56" height="140" />
          <rect x="215" y="95" width="38" height="85" />
          <rect x="290" y="60" width="50" height="120" />
          <rect x="390" y="25" width="64" height="155" />
          <rect x="490" y="70" width="46" height="110" />
          <rect x="565" y="100" width="40" height="80" />
          <rect x="640" y="50" width="54" height="130" />
          <rect x="725" y="88" width="42" height="92" />
        </g>
        <g fill="rgba(127,208,255,0.5)">
          <rect x="142" y="56" width="6" height="6" />
          <rect x="160" y="80" width="6" height="6" />
          <rect x="404" y="44" width="6" height="6" />
          <rect x="424" y="70" width="6" height="6" />
          <rect x="654" y="70" width="6" height="6" />
          <rect x="672" y="96" width="6" height="6" />
        </g>
        <g fill="rgba(255,138,43,0.55)">
          <rect x="302" y="80" width="6" height="6" />
          <rect x="504" y="92" width="6" height="6" />
        </g>
      </svg>
    </div>
  );
}
