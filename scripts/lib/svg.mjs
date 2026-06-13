// Generates self-contained themed SVG images (no external assets) for ATVs,
// brands and categories so the whole app works offline.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * A stylized quad-bike (ATV) illustration on a themed gradient background.
 * variant changes the background framing so multiple gallery images differ.
 */
export function atvSvg({ title, brand, year, color = "#f97316", variant = 0 }) {
  const c1 = color;
  const c2 = shade(color, -50);
  const bg1 = shade(color, 120);
  const bg2 = shade(color, 60);
  const angles = [110, 25, 160, 70, 200];
  const ang = angles[variant % angles.length];
  const body = shade(color, -20);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${ang} .5 .5)">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="bd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="sh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <g opacity="0.08" fill="#ffffff">
    <circle cx="120" cy="110" r="160"/><circle cx="700" cy="500" r="200"/>
  </g>
  <ellipse cx="400" cy="470" rx="280" ry="40" fill="url(#sh)"/>
  <!-- wheels -->
  <g>
    <circle cx="250" cy="430" r="92" fill="#1f2937"/><circle cx="250" cy="430" r="52" fill="#374151"/><circle cx="250" cy="430" r="22" fill="#9ca3af"/>
    <circle cx="560" cy="430" r="92" fill="#1f2937"/><circle cx="560" cy="430" r="52" fill="#374151"/><circle cx="560" cy="430" r="22" fill="#9ca3af"/>
  </g>
  <!-- body -->
  <path d="M170 360 Q150 300 230 295 L330 290 Q360 250 430 255 L520 260 Q610 265 640 330 Q660 380 600 395 L560 395 A92 92 0 0 0 380 410 L330 410 A92 92 0 0 0 170 405 Z" fill="url(#bd)" stroke="${shade(color, -80)}" stroke-width="4"/>
  <!-- fenders -->
  <path d="M158 425 a92 92 0 0 1 184 0" fill="none" stroke="${body}" stroke-width="18" stroke-linecap="round"/>
  <path d="M468 425 a92 92 0 0 1 184 0" fill="none" stroke="${body}" stroke-width="18" stroke-linecap="round"/>
  <!-- seat -->
  <path d="M360 285 Q420 250 500 270 L500 300 L370 305 Z" fill="#111827"/>
  <!-- handlebar -->
  <line x1="330" y1="290" x2="300" y2="220" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
  <line x1="280" y1="215" x2="330" y2="225" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
  <!-- headlight -->
  <circle cx="640" cy="320" r="20" fill="#fde68a" stroke="${shade(color,-80)}" stroke-width="3"/>
  <!-- text -->
  <g font-family="Arial, Helvetica, sans-serif">
    <rect x="40" y="40" rx="10" height="46" width="${Math.min(360, 60 + esc(brand).length * 18)}" fill="#111827" opacity="0.85"/>
    <text x="60" y="72" fill="#ffffff" font-size="28" font-weight="700">${esc(brand)}</text>
    <text x="40" y="555" fill="#ffffff" font-size="34" font-weight="800" opacity="0.96">${esc(title)}</text>
    <text x="700" y="80" fill="#ffffff" font-size="26" font-weight="700" text-anchor="end" opacity="0.9">${esc(year)}</text>
  </g>
</svg>`;
}

/** A simple brand "logo" card SVG. */
export function brandSvg({ title, color = "#f97316" }) {
  const initials = title.split(/[\s-]+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160" role="img" aria-label="${esc(title)}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${shade(color,-60)}"/></linearGradient></defs>
  <rect width="320" height="160" rx="16" fill="#ffffff"/>
  <rect x="16" y="16" width="288" height="128" rx="12" fill="url(#g)" opacity="0.12"/>
  <circle cx="80" cy="80" r="44" fill="url(#g)"/>
  <text x="80" y="92" text-anchor="middle" font-family="Arial" font-size="32" font-weight="800" fill="#ffffff">${esc(initials)}</text>
  <text x="150" y="90" font-family="Arial" font-size="26" font-weight="700" fill="#111827">${esc(title)}</text>
</svg>`;
}

/** A category tile SVG with an icon-ish quad silhouette. */
export function categorySvg({ title, color = "#f97316" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" role="img" aria-label="${esc(title)}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(color,90)}"/><stop offset="1" stop-color="${shade(color,20)}"/></linearGradient></defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <ellipse cx="300" cy="300" rx="200" ry="26" fill="#000" opacity="0.18"/>
  <circle cx="210" cy="270" r="58" fill="#1f2937"/><circle cx="210" cy="270" r="28" fill="#6b7280"/>
  <circle cx="400" cy="270" r="58" fill="#1f2937"/><circle cx="400" cy="270" r="28" fill="#6b7280"/>
  <path d="M150 230 Q150 190 220 188 L300 186 Q330 160 390 165 L440 168 Q500 175 470 240 L150 240 Z" fill="${color}" stroke="${shade(color,-80)}" stroke-width="4"/>
  <text x="300" y="360" text-anchor="middle" font-family="Arial" font-size="30" font-weight="800" fill="#ffffff">${esc(title)}</text>
</svg>`;
}
