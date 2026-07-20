import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Sun, Moon, ArrowRight, Download, Mail,
  MapPin, ExternalLink, Compass, ChevronDown, ChevronUp, Phone,
  GraduationCap, Award, Briefcase, Building2, Waves, HardHat,
  Ruler, Layers, Send, CheckCircle2,
} from "lucide-react";

/* lucide-react dropped brand/logo icons (incl. "Linkedin") a while back,
   so it's rebuilt here as a plain inline SVG that matches the same
   stroke-based icon style used everywhere else on the site. */
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A6 6 0 0 1 16 8z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */
const FontLoader = () => {
  useEffect(() => {
    const id = "portfolio-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ------------------------------------------------------------------ */
/* Theme tokens                                                        */
/* ------------------------------------------------------------------ */
const ThemeStyles = () => (
  <style>{`
    .cep-root{
      --surface:#FCFCFC;
      --surface-alt:#F3F4F5;
      --surface-raised:#FFFFFF;
      --ink:#0A0B08;
      --ink-soft:#5C6058;
      --ink-faint:#8B8F86;
      --line:rgba(10,11,8,0.09);
      --line-soft:rgba(10,11,8,0.07);
      --accent:#0047AB;
      --accent-ink:#003278;
      --accent-soft:rgba(0,71,171,0.10);
      --spark:#EC058E;
      --grid:rgba(10,11,8,0.05);
      --grid-major:rgba(10,11,8,0.09);
      --pill-bg:#F1F2F3;
      --shadow-sm: 0 1px 1px rgba(10,11,8,0.03), 0 2px 4px rgba(10,11,8,0.03);
      --shadow-card: 0 1px 2px rgba(10,11,8,0.04), 0 6px 16px -6px rgba(10,11,8,0.07), 0 24px 40px -20px rgba(10,11,8,0.07);
      --shadow-md: 0 2px 4px rgba(10,11,8,0.04), 0 12px 24px -8px rgba(10,11,8,0.08);
      --shadow-hover: 0 4px 10px rgba(10,11,8,0.05), 0 20px 40px -12px rgba(10,11,8,0.12), 0 40px 64px -24px rgba(10,11,8,0.10);
      font-family:'Inter',system-ui,sans-serif;
      background:var(--surface);
      color:var(--ink);
      transition:background .4s ease,color .4s ease;
    }
    .cep-root[data-theme="dark"]{
      --surface:#0A0B08;
      --surface-alt:#15170F;
      --surface-raised:#1D1F17;
      --ink:#FCFCFC;
      --ink-soft:#B7BAAF;
      --ink-faint:#80847A;
      --line:rgba(252,252,252,0.10);
      --line-soft:rgba(252,252,252,0.07);
      --accent:#0047AB;
      --accent-ink:#3D7FE0;
      --accent-soft:rgba(0,71,171,0.20);
      --spark:#EC058E;
      --grid:rgba(252,252,252,0.045);
      --grid-major:rgba(252,252,252,0.08);
      --pill-bg:#26281F;
      --shadow-sm: 0 1px 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25);
      --shadow-card: 0 1px 2px rgba(0,0,0,0.3), 0 6px 16px -6px rgba(0,0,0,0.35), 0 24px 40px -20px rgba(0,0,0,0.4);
      --shadow-md: 0 2px 6px rgba(0,0,0,0.3), 0 12px 24px -8px rgba(0,0,0,0.45);
      --shadow-hover: 0 4px 10px rgba(0,0,0,0.35), 0 20px 40px -12px rgba(0,0,0,0.5), 0 40px 64px -24px rgba(0,0,0,0.5);
    }
    .cep-root .font-display{ font-family:'Space Grotesk',system-ui,sans-serif; }
    .cep-root .font-mono{ font-family:'IBM Plex Mono',monospace; }

    /* uniform icon stroke weight; watermarks opt out via cep-watermark-svg */
    .cep-root svg:not(.cep-watermark-svg){ stroke-width:1.6; }

    html{ scroll-behavior:smooth; }

    .cep-blueprint-bg{
      background-image:
        linear-gradient(var(--grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid) 1px, transparent 1px),
        linear-gradient(var(--grid-major) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-major) 1px, transparent 1px);
      background-size: 16px 16px, 16px 16px, 80px 80px, 80px 80px;
      background-position: -1px -1px;
      -webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 96%);
      mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 96%);
      animation: cep-grid-drift 8s linear infinite;
    }
    /* Shifts by exactly one minor-grid cell (16px, which also evenly divides the
       80px major grid) so the loop point is invisible — it reads as one continuous
       leftward scroll with no reset jump. linear + infinite = never slows, never stops. */
    @keyframes cep-grid-drift{
      0%   { background-position: -1px -1px; }
      100% { background-position: -17px -1px; }
    }
    .cep-blueprint-bg-subtle{
      background-image:
        linear-gradient(var(--grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid) 1px, transparent 1px);
      background-size: 80px 80px, 80px 80px;
      background-position: -1px -1px;
      opacity:0.5;
    }

    .cep-reveal{ opacity:0; transform:translateY(14px); transition:opacity 1s cubic-bezier(.16,.8,.24,1), transform 1s cubic-bezier(.16,.8,.24,1); }
    .cep-reveal.cep-in{ opacity:1; transform:translateY(0); }

    .cep-hairline{ background:var(--line); }

    /* premium floating card — paper, not glass */
    .cep-card{
      background:var(--surface-raised);
      border:1px solid var(--line-soft);
      border-radius:20px;
      box-shadow:var(--shadow-card);
      transition: transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 280ms cubic-bezier(.2,.7,.2,1), border-color 280ms ease;
    }
    .cep-card-hover:hover{
      transform: translateY(-6px);
      box-shadow: var(--shadow-hover), 0 0 0 1px var(--accent-soft);
      border-color: var(--accent);
    }

    .cep-nav-link{ position:relative; color:var(--ink-soft); transition:color .25s ease; }
    .cep-nav-link:hover{ color:var(--ink); }
    .cep-nav-link.active{ color:var(--ink); }
    .cep-nav-link .underline{ position:absolute; left:0; right:100%; bottom:-6px; height:1.5px; background:var(--accent); transition:right .3s cubic-bezier(.2,.7,.2,1); border-radius:2px; }
    .cep-nav-link.active .underline, .cep-nav-link:hover .underline{ right:0; }

    /* apple-style pill buttons */
    .cep-btn-primary{
      background:var(--ink); color:var(--surface);
      border-radius:999px; box-shadow:var(--shadow-sm);
      transition: transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 280ms cubic-bezier(.2,.7,.2,1), background 280ms ease;
    }
    .cep-btn-primary:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); background:var(--accent-ink); }
    .cep-btn-primary .cep-btn-icon{ transition: transform 280ms cubic-bezier(.2,.7,.2,1); }
    .cep-btn-primary:hover .cep-btn-icon{ transform:translateX(3px); }

    .cep-btn-outline{
      border:1px solid var(--line); color:var(--ink); background:var(--surface-raised);
      border-radius:999px; box-shadow:var(--shadow-sm);
      transition: transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 280ms cubic-bezier(.2,.7,.2,1), border-color 280ms ease, color 280ms ease;
    }
    .cep-btn-outline:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color:var(--accent); color:var(--accent-ink); }
    .cep-btn-outline .cep-btn-icon{ transition: transform 280ms cubic-bezier(.2,.7,.2,1); }
    .cep-btn-outline:hover .cep-btn-icon{ transform:translateX(3px); }

    /* clean rounded pills — no dots, no outlines */
    .cep-pill{
      display:inline-flex; align-items:center;
      background:var(--pill-bg); color:var(--ink-soft);
      border:1px solid transparent;
      border-radius:999px; padding:6px 13px; line-height:1;
      font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.05em; text-transform:uppercase;
      transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
    }
    .cep-pill-hover:hover{ background:var(--accent-soft); color:var(--accent-ink); border-color:var(--accent); }

    .cep-titleblock{ background:var(--surface-raised); border-radius:16px; box-shadow:var(--shadow-md); overflow:hidden; }
    .cep-titleblock .row{ border-top:1px solid var(--line-soft); }
    .cep-titleblock .cell{ border-left:1px solid var(--line-soft); }

    .cep-focus:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; border-radius:6px; }

    .cep-spark{ color:var(--spark); }

    .cep-input{
      border-radius:12px; border:1px solid var(--line); background:var(--surface-raised);
      transition:border-color 200ms ease, box-shadow 200ms ease;
    }
    .cep-input:focus{ border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); outline:none; }

    .cep-icon-btn{
      border:1px solid var(--line); background:var(--surface-raised); box-shadow:var(--shadow-sm);
      transition: transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 280ms cubic-bezier(.2,.7,.2,1), border-color 280ms ease, color 280ms ease;
    }
    .cep-icon-btn:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color:var(--accent); color:var(--accent-ink); }

    /* hero-only engineering watermarks — ambient sine-wave drift, plus a cursor-repel
       spring blended in on top. Both are driven from one rAF loop per watermark and
       only ever touch transform, so they're compositor-only (no layout, no paint of
       surrounding content). */
    .cep-hero-clip{ overflow:hidden; }
    .cep-watermark{
      pointer-events:none; position:absolute; opacity:0.09; color:#30332E; z-index:0;
    }
    .cep-watermark-inner{ will-change: transform; }
    [data-theme="dark"] .cep-watermark{ opacity:0.1; color:#C9CCC3; }
    .cep-watermark-svg{ display:block; width:100%; height:auto; }

    /* CAD crosshair cursor — Hero only. The OS cursor is swapped for a full
       crosshair + live coordinate readout, hero-centre-as-origin, while the
       mouse is over the section. Fine-pointer devices only (no-op on touch). */
    @media (hover: hover) and (pointer: fine){
      .cep-hero-clip.cep-cad-active{ cursor:none; }
    }
    .cep-cad-crosshair{
      position:absolute; inset:0; z-index:40; pointer-events:none;
      opacity:0; transition:opacity .12s ease;
    }
    .cep-hero-clip.cep-cad-active .cep-cad-crosshair{ opacity:1; }
    .cep-cad-line{ position:absolute; background:var(--ink-soft); opacity:0.5; will-change:transform; }
    .cep-cad-line-h{ left:0; top:0; width:100%; height:1px; }
    .cep-cad-line-v{ left:0; top:0; width:1px; height:100%; }
    .cep-cad-label{
      position:absolute; left:0; top:0; font-size:10px; letter-spacing:0.03em; white-space:nowrap;
      color:var(--ink); background:var(--surface-raised); border:1px solid var(--line);
      border-radius:2px; padding:2px 6px; will-change:transform;
    }

    /* self-authored responsive gate — does not depend on Tailwind's pre-built breakpoint set */
    .cep-watermark-responsive{ display:none; }
    @media (min-width: 900px){ .cep-watermark-responsive{ display:block; } }

    @keyframes cep-pulse{ 0%,100%{ opacity:1; } 50%{ opacity:.55; } }
    .cep-pulse{ animation:cep-pulse 3.2s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce){
      .cep-reveal, .cep-reveal *{ transition:none !important; animation:none !important; opacity:1 !important; transform:none !important; }
      .cep-card-hover:hover, .cep-btn-primary:hover, .cep-btn-outline:hover{ transform:none !important; }
      .cep-watermark-inner{ transform:none !important; }
      .cep-blueprint-bg{ animation:none !important; }
      .cep-pulse{ animation:none !important; }
      html{ scroll-behavior:auto !important; }
      *{ scroll-behavior:auto !important; }
    }

    ::selection{ background:var(--accent); color:#FCFCFC; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Scroll-reveal hook                                                   */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const Reveal = ({ as: Tag = "div", className = "", delay = 0, children }) => {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`cep-reveal ${inView ? "cep-in" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
};

/* ------------------------------------------------------------------ */
/* ImageSlot — drop a file into /public/images and reference it by      */
/* filename (e.g. src="/images/profile.jpg"). If the file isn't there   */
/* yet, it quietly shows the original dashed placeholder look instead   */
/* of a broken-image icon, so nothing looks broken while you're still   */
/* deciding on photos.                                                  */
/* ------------------------------------------------------------------ */
const ImageSlot = ({ src, alt = "", className = "", placeholder = "Photo placeholder" }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center text-center px-4 font-mono text-xs ${className}`}
        style={{ color: "var(--ink-faint)" }}
      >
        {placeholder}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Watermarks — engineering line-art, hero-only.                       */
/*                                                                      */
/* Two motions are blended into a single transform, written from one   */
/* rAF loop per illustration:                                          */
/*   1) ambient drift — a continuous sine wave on x/y/rotation, so     */
/*      each illustration is always gently alive, like dust settling. */
/*   2) cursor repel — a critically-damped spring (no bounce, no       */
/*      overshoot) that nudges the illustration away from the cursor   */
/*      and lets it ease back into its drift path when the cursor      */
/*      leaves — never a hard snap either way.                         */
/*                                                                      */
/* Only `transform` (translate3d + rotate) is ever touched, so this is */
/* compositor-only: no layout thrash, no repaint of surrounding DOM.   */
/* ------------------------------------------------------------------ */

// Deterministic per-instance variety (different speed/phase/amplitude per
// illustration) from a single small integer, so call sites stay simple —
// no need to hand-roll five numbers per watermark.
function seededDrift(seed) {
  const rand = (n) => {
    const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    ampX: 46 + rand(1) * 18, // ~±46–64px — larger roam distance, same cycle length below
    ampY: 46 + rand(2) * 18, // ~±46–64px
    ampRot: 1 + rand(3) * 1, // up to ±2°
    period: 12 + rand(4) * 8, // 12–20s per full cycle — speed unchanged
    phaseX: rand(5) * Math.PI * 2,
    phaseY: rand(6) * Math.PI * 2,
    phaseRot: rand(7) * Math.PI * 2,
  };
}

function useAmbientWatermark({ seed = 0, maxOffset = 18, radius = 220, cursorEnabled = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS also freezes .cep-watermark transforms in this case

    const { ampX, ampY, ampRot, period, phaseX, phaseY, phaseRot } = seededDrift(seed);
    const omega = (2 * Math.PI) / period;

    // cursor-repel spring state
    const target = { x: 0, y: 0 };
    const spring = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const stiffness = 90; // tuned for a calm settle
    const damping = 19; // ~2*sqrt(stiffness): critically damped, no overshoot/bounce

    let raf = null;
    let moveRaf = null;
    const start = performance.now();
    let lastTime = start;

    const onMove = (e) => {
      if (!cursorEnabled || moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = null;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          const strength = 1 - dist / radius;
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          target.x = nx * maxOffset * strength;
          target.y = ny * maxOffset * strength;
        } else {
          target.x = 0;
          target.y = 0;
        }
      });
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = (now - start) / 1000;

      // 1) ambient sine-wave drift — always running
      const floatX = ampX * Math.sin(t * omega + phaseX);
      const floatY = ampY * Math.sin(t * omega + phaseY);
      const floatRot = ampRot * Math.sin(t * omega + phaseRot);

      // 2) cursor-repel spring, blended additively on top of the drift
      if (cursorEnabled) {
        const dispX = spring.x - target.x;
        const dispY = spring.y - target.y;
        const accX = -stiffness * dispX - damping * vel.x;
        const accY = -stiffness * dispY - damping * vel.y;
        vel.x += accX * dt;
        vel.y += accY * dt;
        spring.x += vel.x * dt;
        spring.y += vel.y * dt;
      }

      const x = floatX + spring.x;
      const y = floatY + spring.y;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${floatRot.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    if (cursorEnabled) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }
    return () => {
      if (cursorEnabled) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
      }
      if (raf) cancelAnimationFrame(raf);
      if (moveRaf) cancelAnimationFrame(moveRaf);
    };
  }, [seed, maxOffset, radius, cursorEnabled]);
  return ref;
}

/* ==================================================================== */
/* Engineering SVG library — supplied by the user (WatermarkLibrary.jsx) */
/* and inlined here verbatim (only the per-file `export` keywords were  */
/* dropped, since this file has a single default export at the bottom). */
/* Animation, floating, and cursor-repel logic below is untouched.      */
/* ==================================================================== */
// ENGINEERING SVG LIBRARY
// =====================================================================

function BeamUDL(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="20" y="55" width="160" height="8" />
      <polygon points="25,63 15,83 35,83" />
      <line x1="10" y1="83" x2="40" y2="83" />
      <polygon points="175,63 165,78 185,78" />
      <circle cx="170" cy="81" r="2.5" />
      <circle cx="180" cy="81" r="2.5" />
      <line x1="160" y1="83.5" x2="190" y2="83.5" />
      <line x1="20" y1="20" x2="180" y2="20" />
      <line x1="20" y1="20" x2="20" y2="55" />
      <line x1="40" y1="20" x2="40" y2="55" />
      <line x1="60" y1="20" x2="60" y2="55" />
      <line x1="80" y1="20" x2="80" y2="55" />
      <line x1="100" y1="20" x2="100" y2="55" />
      <line x1="120" y1="20" x2="120" y2="55" />
      <line x1="140" y1="20" x2="140" y2="55" />
      <line x1="160" y1="20" x2="160" y2="55" />
      <line x1="180" y1="20" x2="180" y2="55" />
      <polyline points="17,48 20,55 23,48" />
      <polyline points="37,48 40,55 43,48" />
      <polyline points="57,48 60,55 63,48" />
      <polyline points="77,48 80,55 83,48" />
      <polyline points="97,48 100,55 103,48" />
      <polyline points="117,48 120,55 123,48" />
      <polyline points="137,48 140,55 143,48" />
      <polyline points="157,48 160,55 163,48" />
      <polyline points="177,48 180,55 183,48" />
    </svg>
  );
}

function BeamPointLoad(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="20" y="55" width="160" height="8" />
      <polygon points="25,63 15,83 35,83" />
      <line x1="10" y1="83" x2="40" y2="83" />
      <polygon points="175,63 165,78 185,78" />
      <circle cx="170" cy="81" r="2.5" />
      <circle cx="180" cy="81" r="2.5" />
      <line x1="160" y1="83.5" x2="190" y2="83.5" />
      <line x1="100" y1="15" x2="100" y2="55" />
      <polyline points="95,45 100,55 105,45" />
      <line x1="130" y1="15" x2="130" y2="55" />
      <polyline points="125,45 130,55 135,45" />
    </svg>
  );
}

function Cantilever(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="20" x2="20" y2="90" />
      <line x1="12" y1="25" x2="20" y2="33" />
      <line x1="12" y1="35" x2="20" y2="43" />
      <line x1="12" y1="45" x2="20" y2="53" />
      <line x1="12" y1="55" x2="20" y2="63" />
      <line x1="12" y1="65" x2="20" y2="73" />
      <line x1="12" y1="75" x2="20" y2="83" />
      <rect x="20" y="50" width="140" height="10" />
      <line x1="160" y1="20" x2="160" y2="50" />
      <polyline points="155,40 160,50 165,40" />
    </svg>
  );
}

function CantileverUDL(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="20" x2="20" y2="90" />
      <line x1="12" y1="25" x2="20" y2="33" />
      <line x1="12" y1="45" x2="20" y2="53" />
      <line x1="12" y1="65" x2="20" y2="73" />
      <line x1="12" y1="85" x2="20" y2="93" />
      <rect x="20" y="55" width="140" height="10" />
      <line x1="20" y1="30" x2="160" y2="30" />
      <line x1="40" y1="30" x2="40" y2="55" />
      <polyline points="37,48 40,55 43,48" />
      <line x1="70" y1="30" x2="70" y2="55" />
      <polyline points="67,48 70,55 73,48" />
      <line x1="100" y1="30" x2="100" y2="55" />
      <polyline points="97,48 100,55 103,48" />
      <line x1="130" y1="30" x2="130" y2="55" />
      <polyline points="127,48 130,55 133,48" />
      <line x1="160" y1="30" x2="160" y2="55" />
      <polyline points="157,48 160,55 163,48" />
    </svg>
  );
}

function PortalFrame(props) {
  return (
    <svg viewBox="0 0 200 200" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="40" y="40" width="120" height="10" />
      <rect x="40" y="50" width="10" height="90" />
      <rect x="150" y="50" width="10" height="90" />
      <polygon points="45,140 30,160 60,160" />
      <line x1="20" y1="160" x2="70" y2="160" />
      <polygon points="155,140 140,160 170,160" />
      <line x1="130" y1="160" x2="180" y2="160" />
      <line x1="10" y1="45" x2="40" y2="45" />
      <polyline points="32,40 40,45 32,50" />
      <line x1="100" y1="10" x2="100" y2="40" />
      <polyline points="95,32 100,40 105,32" />
    </svg>
  );
}

function WarrenTruss(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="20" x2="180" y2="20" />
      <line x1="20" y1="70" x2="180" y2="70" />
      <line x1="20" y1="20" x2="20" y2="70" />
      <line x1="180" y1="20" x2="180" y2="70" />
      <polyline points="20,70 60,20 100,70 140,20 180,70" />
      <polyline points="20,20 60,70 100,20 140,70 180,20" />
      <polygon points="20,70 10,90 30,90" />
      <line x1="5" y1="90" x2="35" y2="90" />
      <polygon points="180,70 170,85 190,85" />
      <circle cx="175" cy="87.5" r="2.5" />
      <circle cx="185" cy="87.5" r="2.5" />
      <line x1="165" y1="90" x2="195" y2="90" />
    </svg>
  );
}

function PrattTruss(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="25" x2="180" y2="25" />
      <line x1="20" y1="75" x2="180" y2="75" />
      <line x1="20" y1="25" x2="20" y2="75" />
      <line x1="60" y1="25" x2="60" y2="75" />
      <line x1="100" y1="25" x2="100" y2="75" />
      <line x1="140" y1="25" x2="140" y2="75" />
      <line x1="180" y1="25" x2="180" y2="75" />
      <line x1="20" y1="75" x2="60" y2="25" />
      <line x1="60" y1="75" x2="100" y2="25" />
      <line x1="140" y1="25" x2="100" y2="75" />
      <line x1="180" y1="25" x2="140" y2="75" />
      <polygon points="20,75 10,90 30,90" />
      <polygon points="180,75 170,85 190,85" />
      <circle cx="175" cy="87.5" r="2" />
      <circle cx="185" cy="87.5" r="2" />
    </svg>
  );
}

function ShearForceDiagram(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="50" x2="180" y2="50" strokeDasharray="4 4" />
      <line x1="20" y1="20" x2="20" y2="80" />
      <line x1="180" y1="20" x2="180" y2="80" />
      <polyline points="20,50 20,20 80,20 80,70 120,70 120,40 180,40 180,50" />
      <line x1="25" y1="20" x2="25" y2="50" />
      <line x1="40" y1="20" x2="40" y2="50" />
      <line x1="55" y1="20" x2="55" y2="50" />
      <line x1="70" y1="20" x2="70" y2="50" />
      <line x1="85" y1="50" x2="85" y2="70" />
      <line x1="100" y1="50" x2="100" y2="70" />
      <line x1="115" y1="50" x2="115" y2="70" />
      <line x1="125" y1="40" x2="125" y2="50" />
      <line x1="140" y1="40" x2="140" y2="50" />
      <line x1="155" y1="40" x2="155" y2="50" />
      <line x1="170" y1="40" x2="170" y2="50" />
    </svg>
  );
}

function BendingMomentDiagram(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="30" x2="180" y2="30" />
      <line x1="20" y1="20" x2="20" y2="90" strokeDasharray="3 3" />
      <line x1="180" y1="20" x2="180" y2="90" strokeDasharray="3 3" />
      <path d="M 20,30 Q 100,110 180,30" />
      <line x1="40" y1="30" x2="40" y2="47" />
      <line x1="60" y1="30" x2="60" y2="65" />
      <line x1="80" y1="30" x2="80" y2="76" />
      <line x1="100" y1="30" x2="100" y2="80" />
      <line x1="120" y1="30" x2="120" y2="76" />
      <line x1="140" y1="30" x2="140" y2="65" />
      <line x1="160" y1="30" x2="160" y2="47" />
    </svg>
  );
}

function DeflectedShape(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <line x1="20" y1="50" x2="180" y2="50" strokeDasharray="5 5" />
      <path d="M 20,50 C 70,50 80,80 140,80 C 160,80 180,50 180,50" />
      <polygon points="20,50 10,70 30,70" />
      <polygon points="140,80 130,100 150,100" />
      <line x1="120" y1="20" x2="140" y2="80" strokeDasharray="2 2" />
    </svg>
  );
}

function RCBeamReinforcement(props) {
  return (
    <svg viewBox="0 0 100 120" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="20" y="10" width="60" height="100" />
      <rect x="28" y="18" width="44" height="84" strokeDasharray="4 2" />
      <circle cx="33" cy="23" r="3" />
      <circle cx="67" cy="23" r="3" />
      <circle cx="33" cy="97" r="4" />
      <circle cx="50" cy="97" r="4" />
      <circle cx="67" cy="97" r="4" />
      <path d="M 28,26 L 36,18" />
      <path d="M 72,26 L 64,18" />
      <line x1="5" y1="97" x2="28" y2="97" />
      <line x1="5" y1="23" x2="28" y2="23" />
    </svg>
  );
}

function ColumnReinforcement(props) {
  return (
    <svg viewBox="0 0 120 120" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="20" y="20" width="80" height="80" />
      <rect x="30" y="30" width="60" height="60" rx="2" ry="2" />
      <circle cx="35" cy="35" r="3.5" />
      <circle cx="60" cy="35" r="3.5" />
      <circle cx="85" cy="35" r="3.5" />
      <circle cx="35" cy="60" r="3.5" />
      <circle cx="85" cy="60" r="3.5" />
      <circle cx="35" cy="85" r="3.5" />
      <circle cx="60" cy="85" r="3.5" />
      <circle cx="85" cy="85" r="3.5" />
      <path d="M 30,45 C 45,45 45,75 30,75" strokeDasharray="2 2" />
      <path d="M 90,45 C 75,45 75,75 90,75" strokeDasharray="2 2" />
    </svg>
  );
}

function PadFooting(props) {
  return (
    <svg viewBox="0 0 160 120" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <polyline points="65,10 65,60 20,80 20,110 140,110 140,80 95,60 95,10" />
      <line x1="10" y1="115" x2="150" y2="115" />
      <line x1="30" y1="102" x2="130" y2="102" />
      <line x1="40" y1="110" x2="40" y2="102" />
      <line x1="60" y1="110" x2="60" y2="102" />
      <line x1="80" y1="110" x2="80" y2="102" />
      <line x1="100" y1="110" x2="100" y2="102" />
      <line x1="120" y1="110" x2="120" y2="102" />
      <line x1="72" y1="10" x2="72" y2="90" strokeDasharray="4 2" />
      <line x1="88" y1="10" x2="88" y2="90" strokeDasharray="4 2" />
      <polyline points="68,102 72,90 72,10" strokeDasharray="2 2" />
      <polyline points="92,102 88,90 88,10" strokeDasharray="2 2" />
    </svg>
  );
}

function IBeamSection(props) {
  return (
    <svg viewBox="0 0 100 120" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <path d="M 20,10 L 80,10 L 80,20 L 55,20 Q 50,20 50,25 L 50,95 Q 50,100 55,100 L 80,100 L 80,110 L 20,110 L 20,100 L 45,100 Q 50,100 50,95 L 50,25 Q 50,20 45,20 L 20,20 Z" />
      <line x1="10" y1="60" x2="90" y2="60" strokeDasharray="6 3 2 3" />
      <line x1="50" y1="0" x2="50" y2="120" strokeDasharray="6 3 2 3" />
    </svg>
  );
}

function MomentConnection(props) {
  return (
    <svg viewBox="0 0 160 160" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="30" y="10" width="30" height="140" />
      <line x1="45" y1="10" x2="45" y2="150" strokeDasharray="4 4" />
      <rect x="60" y="65" width="90" height="30" />
      <polygon points="60,65 90,65 60,35" />
      <polygon points="60,95 90,95 60,125" />
      <circle cx="70" cy="73" r="1.5" />
      <circle cx="70" cy="87" r="1.5" />
      <circle cx="85" cy="73" r="1.5" />
      <circle cx="85" cy="87" r="1.5" />
      <circle cx="70" cy="50" r="1.5" />
      <circle cx="70" cy="110" r="1.5" />
      <line x1="60" y1="80" x2="150" y2="80" strokeDasharray="4 4" />
    </svg>
  );
}

function RoadCrossSection(props) {
  return (
    <svg viewBox="0 0 200 100" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <polyline points="10,50 30,50 100,40 170,50 190,50" />
      <polyline points="30,50 30,60 100,50 170,60 170,50" />
      <polyline points="30,60 30,75 100,65 170,75 170,60" />
      <line x1="100" y1="30" x2="100" y2="85" strokeDasharray="5 5" />
      <line x1="50" y1="44" x2="80" y2="40" />
      <polyline points="75,38 80,40 77,43" />
      <line x1="150" y1="44" x2="120" y2="40" />
      <polyline points="125,38 120,40 123,43" />
      <text x="65" y="35" fontSize="8" stroke="none" fill="#30332E">2%</text>
      <text x="125" y="35" fontSize="8" stroke="none" fill="#30332E">2%</text>
    </svg>
  );
}

function RoadHorizontalAlignment(props) {
  return (
    <svg viewBox="0 0 200 160" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <path d="M 20,140 L 80,80 C 100,60 120,60 140,80 L 180,120" />
      <path d="M 10,130 L 70,70 C 95,45 125,45 150,70 L 190,110" strokeDasharray="4 4" />
      <line x1="80" y1="80" x2="110" y2="110" strokeDasharray="2 2" />
      <line x1="140" y1="80" x2="110" y2="110" strokeDasharray="2 2" />
      <circle cx="110" cy="110" r="2" />
      <path d="M 85,85 A 35 35 0 0 0 135,85" strokeDasharray="2 2" />
      <line x1="110" y1="110" x2="110" y2="70" strokeDasharray="1 3" />
    </svg>
  );
}

function SurveyTripod(props) {
  return (
    <svg viewBox="0 0 120 160" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <polyline points="40,30 80,30 75,40 45,40 Z" />
      <line x1="50" y1="40" x2="20" y2="140" />
      <line x1="55" y1="40" x2="35" y2="140" />
      <line x1="70" y1="40" x2="100" y2="140" />
      <line x1="65" y1="40" x2="85" y2="140" />
      <line x1="60" y1="40" x2="60" y2="130" />
      <rect x="45" y="15" width="30" height="15" />
      <circle cx="60" cy="10" r="5" />
      <path d="M 60,40 L 60,80 L 58,85 L 60,90 L 62,85 Z" strokeDasharray="1 2" />
      <line x1="10" y1="140" x2="110" y2="140" />
    </svg>
  );
}

function TopographicContours(props) {
  return (
    <svg viewBox="0 0 200 200" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <path d="M 20,80 C 40,20 140,20 180,80 C 200,120 160,180 100,180 C 40,180 0,120 20,80 Z" />
      <path d="M 40,85 C 55,40 125,40 155,85 C 170,115 140,160 95,160 C 50,160 25,120 40,85 Z" strokeDasharray="4 2" />
      <path d="M 60,90 C 70,60 110,60 130,90 C 140,110 120,140 90,140 C 65,140 50,110 60,90 Z" />
      <path d="M 80,95 C 85,75 105,75 115,95 C 120,105 110,125 95,125 C 80,125 75,105 80,95 Z" strokeDasharray="4 2" />
      <line x1="90" y1="100" x2="100" y2="110" />
      <line x1="100" y1="100" x2="90" y2="110" />
    </svg>
  );
}

function BridgeElevation(props) {
  return (
    <svg viewBox="0 0 240 120" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="20" y="30" width="200" height="10" />
      <path d="M 20,40 Q 70,80 120,40" />
      <path d="M 120,40 Q 170,80 220,40" />
      <line x1="15" y1="40" x2="25" y2="40" />
      <line x1="215" y1="40" x2="225" y2="40" />
      <rect x="110" y="40" width="20" height="60" />
      <line x1="90" y1="100" x2="150" y2="100" />
      <line x1="100" y1="100" x2="95" y2="110" />
      <line x1="115" y1="100" x2="110" y2="110" />
      <line x1="125" y1="100" x2="120" y2="110" />
      <line x1="140" y1="100" x2="135" y2="110" />
      <line x1="40" y1="30" x2="40" y2="53" />
      <line x1="60" y1="30" x2="60" y2="60" />
      <line x1="80" y1="30" x2="80" y2="60" />
      <line x1="100" y1="30" x2="100" y2="53" />
      <line x1="140" y1="30" x2="140" y2="53" />
      <line x1="160" y1="30" x2="160" y2="60" />
      <line x1="180" y1="30" x2="180" y2="60" />
      <line x1="200" y1="30" x2="200" y2="53" />
    </svg>
  );
}

function TowerCrane(props) {
  return (
    <svg viewBox="0 0 200 240" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <rect x="80" y="60" width="20" height="160" />
      <line x1="80" y1="80" x2="100" y2="100" />
      <line x1="100" y1="80" x2="80" y2="100" />
      <line x1="80" y1="120" x2="100" y2="140" />
      <line x1="100" y1="120" x2="80" y2="140" />
      <line x1="80" y1="160" x2="100" y2="180" />
      <line x1="100" y1="160" x2="80" y2="180" />
      <line x1="80" y1="200" x2="100" y2="220" />
      <line x1="100" y1="200" x2="80" y2="220" />
      <polygon points="90,20 70,60 110,60" />
      <line x1="90" y1="20" x2="20" y2="60" />
      <line x1="90" y1="20" x2="180" y2="60" />
      <rect x="20" y="60" width="160" height="10" />
      <rect x="25" y="50" width="20" height="10" />
      <line x1="150" y1="70" x2="150" y2="130" />
      <line x1="160" y1="70" x2="160" y2="130" />
      <polygon points="145,130 165,130 155,140" />
      <line x1="50" y1="220" x2="130" y2="220" />
    </svg>
  );
}

function RetainingWall(props) {
  return (
    <svg viewBox="0 0 160 160" stroke="#30332E" strokeWidth="1.5" fill="none" {...props}>
      <polyline points="40,20 60,20 60,120 130,120 130,140 20,140 20,120 40,120 Z" />
      <line x1="60" y1="30" x2="150" y2="30" />
      <line x1="20" y1="100" x2="10" y2="100" />
      <line x1="100" y1="30" x2="80" y2="50" />
      <line x1="120" y1="30" x2="100" y2="50" />
      <line x1="140" y1="30" x2="120" y2="50" />
      <circle cx="50" cy="110" r="3" />
      <line x1="30" y1="130" x2="120" y2="130" strokeDasharray="3 3" />
      <line x1="50" y1="30" x2="50" y2="120" strokeDasharray="3 3" />
    </svg>
  );
}

// Export array of all components for easy mapping in the animation engine
const ALL_WATERMARKS = [
  BeamUDL, BeamPointLoad, Cantilever, CantileverUDL, PortalFrame,
  WarrenTruss, PrattTruss, ShearForceDiagram, BendingMomentDiagram,
  DeflectedShape, RCBeamReinforcement, ColumnReinforcement, PadFooting,
  IBeamSection, MomentConnection, RoadCrossSection, RoadHorizontalAlignment,
  SurveyTripod, TopographicContours, BridgeElevation, TowerCrane, RetainingWall
];
// Build the variant lookup the existing Watermark component/composition
// generator already expects, sourced directly from ALL_WATERMARKS —
// nothing about how variants are selected, placed, or animated changes.
const WATERMARK_VARIANTS = Object.fromEntries(ALL_WATERMARKS.map((Comp) => [Comp.name, Comp]));
const WATERMARK_KEYS = Object.keys(WATERMARK_VARIANTS);

const Watermark = ({ variant = "BeamUDL", className = "", size = 160, top, left, initialRotate = 0, style = {}, interactive = true, seed = 0, color, opacity, strokeWidth }) => {
  // outer div: static random placement/rotation, set once at composition time
  // inner div: JS-animated drift + cursor-repel, touches transform only
  const ref = useAmbientWatermark({ seed, maxOffset: 35, radius: 240, cursorEnabled: interactive });
  const Comp = WATERMARK_VARIANTS[variant];
  return (
    <div
      className={`cep-watermark ${className}`}
      style={{
        width: size,
        position: "absolute",
        top,
        left,
        zIndex: 0,
        transform: `rotate(${initialRotate}deg)`,
        ...(color ? { color } : {}),
        ...(opacity !== undefined ? { opacity } : {}),
        ...style,
      }}
      aria-hidden="true"
    >
      <div ref={ref} className="cep-watermark-inner">
        {/* className restores the site's existing "display:block; width:100%; height:auto"
            sizing rule (the library's own <svg> has no width/height, so without this it
            would render at the browser's 300x150 default and ignore the `size` prop).
            stroke="currentColor" overrides the library's hardcoded #30332E so these
            drawings keep following the site's existing light/dark watermark color —
            none of the user's line art is altered, just the two attributes needed to
            slot into the existing CSS-driven sizing/theming system. */}
        <Comp
          className="cep-watermark-svg"
          stroke="currentColor"
          {...(strokeWidth !== undefined ? { strokeWidth } : {})}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CAD crosshair cursor — Hero only. Swaps the OS pointer for a full     */
/* crosshair with a live coordinate readout while hovering the section,  */
/* origin (0,0) at the Hero's centre. Position is written straight to    */
/* transform/textContent from a rAF-throttled mousemove handler — no     */
/* React state, so it never touches layout or triggers a re-render.      */
/* ------------------------------------------------------------------ */
function useCadCrosshair(containerRef) {
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined" || !window.matchMedia) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = null;
    let lastEvent = null;

    const render = () => {
      raf = null;
      if (!lastEvent) return;
      const rect = el.getBoundingClientRect();
      const relX = lastEvent.clientX - rect.left;
      const relY = lastEvent.clientY - rect.top;
      // Hero-centre-as-origin, CAD convention: +X right, +Y up.
      const cx = Math.round(relX - rect.width / 2);
      const cy = Math.round(rect.height / 2 - relY);

      if (hLineRef.current) hLineRef.current.style.transform = `translate3d(0, ${relY.toFixed(1)}px, 0)`;
      if (vLineRef.current) vLineRef.current.style.transform = `translate3d(${relX.toFixed(1)}px, 0, 0)`;
      if (labelRef.current) {
        const labelX = Math.min(relX + 14, rect.width - 90);
        const labelY = Math.min(relY + 14, rect.height - 26);
        labelRef.current.style.transform = `translate3d(${labelX.toFixed(1)}px, ${labelY.toFixed(1)}px, 0)`;
        labelRef.current.textContent = `X ${cx >= 0 ? "+" : ""}${cx}  Y ${cy >= 0 ? "+" : ""}${cy}`;
      }
    };

    const onMove = (e) => {
      lastEvent = e;
      if (raf == null) raf = requestAnimationFrame(render);
    };
    const onEnter = () => el.classList.add("cep-cad-active");
    const onLeave = () => el.classList.remove("cep-cad-active");

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.classList.remove("cep-cad-active");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return { hLineRef, vLineRef, labelRef };
}

const CadCrosshair = ({ containerRef }) => {
  const { hLineRef, vLineRef, labelRef } = useCadCrosshair(containerRef);
  return (
    <div className="cep-cad-crosshair" aria-hidden="true">
      <div ref={hLineRef} className="cep-cad-line cep-cad-line-h" />
      <div ref={vLineRef} className="cep-cad-line cep-cad-line-v" />
      <div ref={labelRef} className="cep-cad-label font-mono" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

const STATS = [
  { value: "7", label: "Design & planning projects" },
  { value: "10+", label: "Engineering software tools" },
  { value: "ECSA", label: "Candidate Engineer (Civil)" },
  { value: "3", label: "Languages spoken" },
];

const EDUCATION = [
  {
    year: "2022 — 2025",
    title: "BSc Eng (Civil)",
    place: "University of the Witwatersrand",
    detail:
      "Academic projects spanning geotechnical, structural, concrete and transportation engineering, including an upstream tailings storage facility design as a final-year project.",
  },
  {
    year: "2020",
    title: "Matric",
    place: "Tswelelopele High School",
    detail: "Completed secondary schooling.",
  },
];

const VALUES = [
  { title: "Practicality", detail: "A design only counts once it's buildable on real terrain, on a real budget, on a real timeline." },
  { title: "Sustainability", detail: "Infrastructure should serve communities for decades — material and impact choices are made with that horizon in mind." },
  { title: "Clarity", detail: "Reports and drawings should be understood by the person acting on them, not just the person who produced them." },
  { title: "Collaboration", detail: "The strongest outcomes come from multidisciplinary teams — planners, engineers and communities working from the same brief." },
];

const PROJECTS = [
  {
    id: "protea-glen",
    icon: Compass,
    category: "Transport Planning / Master Plan",
    title: "Protea Glen Transport Master Plan — Gauteng",
    summary:
      "A precinct-wide transport master plan identifying short, medium and long-term interventions for Protea Glen, from capacity analysis through to implementation phasing.",
    role: "Contributing engineer, OAR Consultants",
    duration: "OAR Consultants",
    software: ["Traffix", "ArcGIS", "AutoCAD"],
    overview:
      "A multi-phase master plan for Protea Glen, developed to guide transport infrastructure investment over the short, medium and long term as the precinct grows.",
    problem:
      "The precinct's existing road network needed a structured intervention plan and prioritisation framework to keep pace with growth, rather than piecemeal upgrades.",
    objectives: [
      "Identify and phase short, medium and long-term transport interventions",
      "Quantify existing and forecast capacity constraints in Traffix",
      "Produce a Status Quo Report supported by network mapping",
    ],
    process:
      "Contributed to infrastructure upgrade planning and capacity analysis, running junction and network capacity checks in Traffix and translating findings into mapped interventions in ArcGIS and AutoCAD.",
    decisions:
      "Interventions were sequenced by phase (short/medium/long-term) so that early, low-cost fixes could proceed while larger network upgrades were programmed against future demand.",
    challenges:
      "Balancing near-term congestion relief against long-term network capacity meant prioritising interventions carefully within a constrained implementation budget.",
    solutions:
      "Helped prepare the Status Quo Report that underpinned the phasing decisions, giving the client a clear, evidence-based sequence of interventions.",
    results:
      "Delivered a phased intervention plan and supporting capacity analysis and mapping as part of the OAR Consultants project team.",
    lessons:
      "Master planning at precinct scale sharpened how I prioritise — not every constraint can be solved at once, and sequencing is itself a design decision.",
  },
  {
    id: "road-alignment",
    icon: Ruler,
    category: "Transportation Engineering / Road Design",
    title: "Road Alignment Design — SANRAL Guidelines",
    summary:
      "An academic road alignment design exercise, developing horizontal and vertical geometry in Civil 3D to SANRAL design standards.",
    role: "Design engineer (academic project)",
    duration: "University of the Witwatersrand",
    software: ["Civil 3D", "AutoCAD"],
    overview:
      "A geometric road design project undertaken as part of the Transportation Engineering coursework at Wits, applying SANRAL design guidelines from alignment through to layout drafting.",
    problem:
      "The brief required a design-speed-compliant alignment that met SANRAL geometric standards for horizontal curvature, vertical grading and sight distance.",
    objectives: [
      "Design a horizontal and vertical alignment to SANRAL standards",
      "Model the design in Civil 3D and verify against design-speed criteria",
      "Draft final layouts and cross-sections in AutoCAD",
    ],
    process:
      "Built the alignment in Civil 3D, iterating on horizontal curve radii and vertical profile to satisfy SANRAL sight-distance and grading requirements, then drafted the finished layouts in AutoCAD.",
    decisions:
      "Geometry choices were driven directly by SANRAL design criteria rather than aesthetics, prioritising compliant curve radii and grades over a more visually direct line.",
    challenges:
      "Reconciling smooth vertical grading with the constraints of the horizontal alignment required several iterations in Civil 3D.",
    solutions:
      "Adjusted curve radii and vertical curve lengths iteratively until the alignment satisfied SANRAL's design-speed and sight-distance checks.",
    results:
      "Produced a SANRAL-compliant alignment design with full Civil 3D geometry and AutoCAD layout drawings.",
    lessons:
      "This project built the Civil 3D fluency I now use directly in professional practice at OAR Consultants.",
  },
  {
    id: "mandlakazi",
    icon: Waves,
    category: "Infrastructure / Access Road Design",
    title: "Mandlakazi Road Design — Zululand Municipality, KZN",
    summary:
      "Design support for a construction access road to a water reservoir and pump station, routed across steep terrain with slopes up to 30°.",
    role: "Contributing engineer, OAR Consultants",
    duration: "OAR Consultants",
    software: ["Civil 3D", "AutoCAD"],
    overview:
      "An access road connecting a planned water reservoir and pump station in Zululand Municipality, designed to be constructible across genuinely steep terrain.",
    problem:
      "The site's 30° slopes made a straightforward alignment infeasible — the road needed to be buildable by construction plant while keeping earthworks manageable.",
    objectives: [
      "Optimise horizontal and vertical alignment across steep terrain",
      "Keep the road constructible for standard earthmoving plant",
      "Produce technical drawings suitable for construction tender",
    ],
    process:
      "Assisted with horizontal and vertical alignment optimisation for the access road, working through multiple alignment options to manage grade and earthworks on the steep slope.",
    decisions:
      "Alignment options were tested against maximum achievable grade and cut/fill balance before settling on a route that avoided the steepest sections of the site.",
    challenges:
      "The 30° terrain meant conventional alignment approaches produced grades that were impractical to construct — the geometry had to be reworked around the slope, not against it.",
    solutions:
      "Reworked the alignment to follow the terrain's natural contours more closely, reducing cut/fill volumes while keeping grades within a constructible range.",
    results:
      "Produced technical drawings in AutoCAD supporting the reservoir and pump station access road design.",
    lessons:
      "Steep-terrain alignment work reinforced how much a site's topography should drive the design, rather than being treated as a constraint to engineer around.",
  },
  {
    id: "school-tia",
    icon: HardHat,
    category: "Traffic Impact Assessment / Master Plan",
    title: "School for the Deaf and Blind — TIA & Masterplan, Mpumalanga",
    summary:
      "A Traffic Impact Assessment and masterplan for a special-needs school, focused on pedestrian pathways, traffic calming and inclusive access.",
    role: "Contributing engineer, OAR Consultants",
    duration: "OAR Consultants",
    software: ["Traffix", "AutoCAD", "ArcGIS"],
    overview:
      "A TIA and site masterplan for a school serving deaf and blind learners, where standard traffic-calming and access solutions needed to be reconsidered for accessibility.",
    problem:
      "Conventional pedestrian and traffic-calming measures don't account for learners who can't rely on visual or auditory cues, so the assessment had to look beyond standard TIA practice.",
    objectives: [
      "Assess site access and traffic impact of the proposed development",
      "Design pedestrian pathways with inclusive access in mind",
      "Recommend traffic-calming measures appropriate for the site",
    ],
    process:
      "Conducted the assessment with an emphasis on pedestrian pathways, traffic calming and access solutions suited to learners with visual and hearing impairments.",
    decisions:
      "Pathway and crossing recommendations prioritised tactile and physical cues over purely visual or auditory signage, given the learner population.",
    challenges:
      "Balancing standard TIA traffic-calming guidance with the specific accessibility needs of the school's learners required looking past a one-size-fits-all approach.",
    solutions:
      "Proposed pedestrian routing and calming measures tailored to the site's inclusive-access requirements.",
    results:
      "Delivered a TIA and masterplan input addressing both traffic impact and inclusive pedestrian access for the school.",
    lessons:
      "This project changed how I think about 'standard' TIA guidance — the end user should shape the solution, not just the traffic count.",
  },
  {
    id: "rc-building",
    icon: Layers,
    category: "Reinforced Concrete Design",
    title: "Multi-Storey Building — Reinforced Concrete Design",
    summary:
      "Design of a multi-storey building to SANS codes, covering load calculations and slab and reinforcement detailing in Prokon and AutoCAD.",
    role: "Design engineer (academic project)",
    duration: "University of the Witwatersrand",
    software: ["Prokon", "AutoCAD"],
    overview:
      "A reinforced-concrete design project for a multi-storey building, taken from load calculation through to slab and reinforcement detailing under SANS codes.",
    problem:
      "The building's gravity and lateral loads needed to be resolved into a structural scheme, with slab depths and reinforcement sized to SANS requirements.",
    objectives: [
      "Calculate gravity and lateral loads per SANS",
      "Size and detail slabs and reinforcement in Prokon",
      "Draft final structural layouts in AutoCAD",
    ],
    process:
      "Ran load calculations and structural analysis in Prokon, then developed slab and reinforcement detailing before drafting the final layouts in AutoCAD.",
    decisions:
      "Reinforcement layout and slab depth were sized directly against SANS serviceability and ultimate limit state requirements rather than rounded up arbitrarily.",
    challenges:
      "Coordinating slab depth, reinforcement congestion and deflection limits across multiple floors required several rounds of checking in Prokon.",
    solutions:
      "Iterated the reinforcement detailing until slab depths satisfied both strength and deflection checks without unnecessary over-design.",
    results:
      "Produced a complete SANS-compliant structural design with Prokon calculations and AutoCAD detailing.",
    lessons:
      "This project is where SANS design codes moved from theory to something I could apply directly, which now underpins how I read structural drawings professionally.",
  },
  {
    id: "tsf",
    icon: GraduationCap,
    category: "Final Year Project / Geotechnical",
    title: "Tailings Storage Facility — Upstream Design",
    summary:
      "Final-year design of an upstream tailings storage facility, using Civil 3D for geometry and RocScience Slide2 for seepage and slope stability analysis.",
    role: "Sole researcher / designer",
    duration: "University of the Witwatersrand — final year",
    software: ["Civil 3D", "RocScience Slide2"],
    overview:
      "A final-year geotechnical design project developing an upstream tailings storage facility (TSF), from embankment geometry through to seepage and slope stability analysis.",
    problem:
      "An upstream TSF design has to satisfy both geometric constructability and geotechnical stability — seepage and slope failure are the two risks that most commonly govern this type of structure.",
    objectives: [
      "Develop embankment and facility geometry in Civil 3D",
      "Model seepage behaviour through the embankment",
      "Verify slope stability under design loading conditions in Slide2",
    ],
    process:
      "Built the facility geometry in Civil 3D, then modelled seepage and ran slope stability analysis in RocScience Slide2 to check the design against acceptable factors of safety.",
    decisions:
      "Embankment geometry was adjusted where initial stability checks fell short of the target factor of safety, rather than accepting a marginal result.",
    challenges:
      "Balancing embankment volume against stability margins meant several iterations between the Civil 3D geometry and the Slide2 stability model.",
    solutions:
      "Refined the embankment profile and drainage assumptions until the seepage and stability results met the design targets.",
    results:
      "Delivered a complete upstream TSF design with supporting seepage and slope stability analysis for the final-year project.",
    lessons:
      "This project sharpened my interest in geotechnical engineering, and set up my later work as a geotechnical lab assistant testing materials for pavement design.",
  },
  {
    id: "tshivhulani",
    icon: Building2,
    category: "Traffic Impact Assessment",
    title: "Tshivhulani Mall — Traffic Impact Assessment, Limpopo",
    summary:
      "A Traffic Impact Assessment for a proposed retail mall, including peak-hour intersection simulations and mitigation measures.",
    role: "Contributing engineer, OAR Consultants",
    duration: "OAR Consultants",
    software: ["Traffix", "AutoCAD"],
    overview:
      "A TIA for a proposed retail development in Limpopo, assessing how the new mall's traffic generation would affect surrounding intersections at peak times.",
    problem:
      "The proposed mall's trip generation risked pushing key surrounding intersections past acceptable levels of service without mitigation.",
    objectives: [
      "Forecast trip generation for the proposed retail development",
      "Simulate peak-hour operation at key surrounding intersections",
      "Propose mitigation measures where capacity was exceeded",
    ],
    process:
      "Assessed traffic impacts using peak-hour simulations in Traffix, testing key intersections against forecast trip generation for the mall.",
    decisions:
      "Mitigation measures were proposed at the specific intersections where simulated peak-hour performance fell below an acceptable level of service.",
    challenges:
      "Forecasting realistic trip generation for a development of this scale required care to avoid over- or under-stating the mitigation required.",
    solutions:
      "Developed peak-hour simulations and used the results to target mitigation measures at the intersections that needed them most.",
    results:
      "Delivered a TIA with peak-hour simulation results and mitigation recommendations for the proposed development.",
    lessons:
      "Retail TIAs taught me to be precise about trip-generation assumptions — small errors there compound quickly through an intersection simulation.",
  },
];

const SKILL_GROUPS = [
  {
    title: "Engineering Software",
    items: [
      { name: "AutoCAD", level: 92 },
      { name: "Civil 3D", level: 85 },
      { name: "ArcGIS", level: 78 },
      { name: "Traffix", level: 82 },
      { name: "Prokon", level: 75 },
      { name: "RocScience Slide2", level: 68 },
      { name: "GeoStudio", level: 62 },
      { name: "HEC-RAS", level: 60 },
      { name: "EPANET", level: 60 },
      { name: "MATLAB / Python", level: 65 },
    ],
  },
  {
    title: "Engineering Knowledge",
    items: [
      { name: "Transport Planning & TIAs", level: 85 },
      { name: "Geotechnical Engineering", level: 75 },
      { name: "Structural & Concrete Design", level: 72 },
      { name: "Water Resources", level: 65 },
      { name: "SANS / TMH & TRH Design Codes", level: 78 },
      { name: "Report Writing & Tenders", level: 82 },
    ],
  },
  {
    title: "Professional Skills",
    items: [
      { name: "Teamwork", level: 90 },
      { name: "Adaptability", level: 88 },
      { name: "Accountability", level: 85 },
      { name: "Interpersonal Skills", level: 84 },
      { name: "Fast Learner", level: 88 },
      { name: "Versatility", level: 80 },
    ],
  },
];

const EXPERIENCE = [
  {
    year: "Feb 2026 — Present",
    title: "Civil Engineering Intern, OAR Consultants (formerly Koleko Solutions)",
    detail:
      "Supporting transport planning and traffic engineering projects — TIAs, masterplans, parking studies, road closures and BRT integrated transport planning. Site visits, traffic surveys and Traffix analysis, layouts in AutoCAD and GIS, and technical reports, tenders and proposals.",
    tag: "Internship",
  },
  {
    year: "2025",
    title: "Captain, Wits Esports Team",
    detail: "Led the university's competitive esports team, including its FC League squad.",
    tag: "Leadership",
  },
  {
    year: "Aug — Sep 2025",
    title: "Geotechnical Lab Assistant, University of the Witwatersrand",
    detail: "Supported a master's research project on pavement design for heavy-duty mine trucks, running CBR and UCS soil and material testing.",
    tag: "Research",
  },
  {
    year: "Jul — Oct 2025",
    title: "Vacation Work, University of the Witwatersrand",
    detail: "Worked with the Head of School to extend and optimise a rainwater harvesting system — design improvements, performance monitoring and remote monitoring via CR-Basic programming. Also curated the Cement & Concrete SA archive for the school.",
    tag: "Research",
  },
  {
    year: "Apr 2021 — Feb 2022",
    title: "Assistant Teacher, Shudintlhe Intermediate School",
    detail: "Supported classroom teaching and learner development ahead of starting university.",
    tag: "Teaching",
  },
];

const CERTIFICATIONS = [
  { title: "ECSA Candidate Engineer (Civil) — Reg. No. 20262010815", org: "ECSA", year: "Active" },
  { title: "AutoCAD Autodesk Certified Professional", org: "Udemy", year: "Completed" },
  { title: "Certificates of Distinction — Engineering Physics, Mathematics & Ethics", org: "University of the Witwatersrand", year: "2022" },
  { title: "Knockando Certificate of Excellence", org: "University of the Witwatersrand", year: "2022" },
  { title: "1st Place, Wits Esports FC League", org: "Wits Esports", year: "2024 & 2025" },
  { title: "USSA E-Sports Competition — Qualified Representative", org: "University Sport South Africa", year: "2024 & 2025" },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
const SectionEyebrow = ({ index, total, children }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="cep-pill">
      {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </span>
    <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "var(--ink-faint)" }}>
      {children}
    </span>
    <span className="flex-1 h-px cep-hairline" />
  </div>
);

const ProgressBar = ({ level, delay }) => {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: inView ? `${level}%` : "0%",
          background: "var(--accent)",
          transition: `width 1s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title block — signature element, fixed corner drawing stamp         */
/* ------------------------------------------------------------------ */
const TitleBlock = ({ activeSection, dark }) => {
  const idx = Math.max(0, NAV_ITEMS.findIndex((n) => n.id === activeSection));
  const label = NAV_ITEMS[idx]?.label ?? "Home";
  return (
    <div
      className="hidden md:block fixed bottom-5 right-5 z-40 cep-titleblock font-mono text-[10px] leading-tight select-none"
      style={{ width: 220 }}
      aria-hidden="true"
    >
      <div className="grid grid-cols-2">
        <div className="px-2 py-1.5" style={{ color: "var(--ink-faint)" }}>DRAWING</div>
        <div className="px-2 py-1.5 cell" style={{ color: "var(--ink)" }}>{label.toUpperCase()}</div>
      </div>
      <div className="grid grid-cols-2 row">
        <div className="px-2 py-1.5" style={{ color: "var(--ink-faint)" }}>PROJECT</div>
        <div className="px-2 py-1.5 cell" style={{ color: "var(--ink)" }}>PORTFOLIO SET</div>
      </div>
      <div className="grid grid-cols-3 row">
        <div className="px-2 py-1.5" style={{ color: "var(--ink-faint)" }}>SCALE</div>
        <div className="px-2 py-1.5 cell" style={{ color: "var(--ink)" }}>NTS</div>
        <div className="px-2 py-1.5 cell" style={{ color: "var(--ink)" }}>REV {idx}</div>
      </div>
      <div className="grid grid-cols-2 row">
        <div className="px-2 py-1.5" style={{ color: "var(--ink-faint)" }}>SHEET</div>
        <div className="px-2 py-1.5 cell" style={{ color: "var(--ink)" }}>
          {String(idx + 1).padStart(2, "0")} OF {String(NAV_ITEMS.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Nav                                                                  */
/* ------------------------------------------------------------------ */
const Nav = ({ active, onNavigate, dark, setDark }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--surface)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 font-display font-semibold tracking-tight cep-focus"
          style={{ color: "var(--ink)" }}
        >
          <span
            className="w-7 h-7 flex items-center justify-center font-mono text-[10px]"
            style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
          >
            NM
          </span>
          <span className="text-sm">Neo Matsietsa — Civil Engineering</span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`cep-nav-link cep-focus font-mono text-xs tracking-wide uppercase pb-1 ${
                active === item.id ? "active" : ""
              }`}
            >
              {item.label}
              <span className="underline" />
            </button>
          ))}
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className="cep-focus cep-icon-btn w-8 h-8 flex items-center justify-center rounded-full"
            style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className="cep-focus cep-icon-btn w-9 h-9 flex items-center justify-center rounded-full"
            style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
            className="cep-focus cep-icon-btn w-9 h-9 flex items-center justify-center rounded-full"
            style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-1" style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="text-left py-2.5 font-mono text-xs tracking-wide uppercase cep-focus"
              style={{ color: active === item.id ? "var(--ink)" : "var(--ink-soft)", borderBottom: "1px solid var(--line-soft)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Hero watermark composition — a fresh random arrangement every time  */
/* the Hero mounts (i.e. every page load/refresh): which drawings show */
/* up, where, at what size, starting tilt, and drift seed. Nothing is  */
/* pinned to the edges — drawings are free to land anywhere in the     */
/* section, including behind the heading, buttons, and cards.          */
/*                                                                      */
/* The INITIAL layout is grid-based (jittered), not purely random —    */
/* that's what guarantees even spread with no clustering and no        */
/* overlap at load time. Once floating starts, drawings drift freely   */
/* and are allowed to cross paths, per spec.                           */
/* ------------------------------------------------------------------ */
function generateHeroComposition() {
  const count = 14 + Math.floor(Math.random() * 6); // 14–19 drawings
  const cols = Math.max(3, Math.round(Math.sqrt(count * 1.8)));
  const rows = Math.max(2, Math.ceil(count / cols));

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ r, c });
  }
  const chosenCells = cells.sort(() => Math.random() - 0.5).slice(0, count);
  const shuffledVariants = [...WATERMARK_KEYS].sort(() => Math.random() - 0.5);

  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const jitter = 0.3; // fraction of cell size — keeps each drawing inside its own cell, so no initial overlap

  return chosenCells.map((cell, i) => {
    const variant = shuffledVariants[i % shuffledVariants.length];
    const baseTop = cell.r * cellH;
    const baseLeft = cell.c * cellW;
    const jitterTop = (Math.random() - 0.5) * cellH * jitter;
    const jitterLeft = (Math.random() - 0.5) * cellW * jitter;
    return {
      key: `${variant}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      variant,
      size: Math.round(140 + Math.random() * 100), // 140–240px
      top: `${Math.max(0, Math.min(94, baseTop + jitterTop)).toFixed(1)}%`,
      left: `${Math.max(0, Math.min(92, baseLeft + jitterLeft)).toFixed(1)}%`,
      initialRotate: +(Math.random() * 14 - 7).toFixed(1), // -7°..7° starting scatter
      seed: Math.floor(Math.random() * 10000), // drives unique amplitude/phase/period
    };
  });
}

const Hero = ({ onNavigate }) => {
  const [composition] = useState(generateHeroComposition);
  const heroRef = useRef(null);
  return (
  <section id="home" ref={heroRef} className="relative pt-32 pb-24 md:pt-44 md:pb-32 cep-blueprint-bg cep-hero-clip">
    {/* CAD crosshair — replaces the OS cursor with a full crosshair + live
        X/Y readout (Hero centre = 0,0) while hovering this section. Pure
        transform/textContent writes from a rAF loop; no re-renders. */}
    <CadCrosshair containerRef={heroRef} />

    {/* corner registration marks */}
    <div className="hidden md:block absolute top-24 left-6 font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>A</div>
    <div className="hidden md:block absolute top-24 right-6 font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>B</div>

    {/* engineering watermarks — scattered freely across the whole Hero (not pinned
        to edges), drifting continuously via sine-wave motion and easing away from
        the cursor within ~240px via a critically-damped spring blended on top of
        the drift. cep-hero-clip keeps everything inside the section regardless of
        where a drawing lands or drifts to; cep-watermark-responsive hides them on
        small screens where there's no room to breathe. */}
    {composition.map((w) => (
      <Watermark
        key={w.key}
        variant={w.variant}
        size={w.size}
        seed={w.seed}
        initialRotate={w.initialRotate}
        className="cep-watermark-responsive"
        style={{ top: w.top, left: w.left }}
      />
    ))}

    <div className="max-w-6xl mx-auto px-5 md:px-8 relative" style={{ zIndex: 2 }}>
      <Reveal>
        <div className="flex items-center gap-3 mb-6 font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent-ink)" }}>
          <Compass size={14} />
          ECSA Candidate Engineer — Transport &amp; Infrastructure
          <span className="inline-flex items-center gap-1.5 ml-1 normal-case tracking-normal" style={{ color: "var(--ink-faint)" }}>
            <span className="w-1 h-1 rounded-full cep-pulse" style={{ background: "var(--spark)" }} />
            open to graduate roles
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="font-display font-semibold tracking-tight leading-[1.03] text-5xl md:text-7xl max-w-4xl" style={{ color: "var(--ink)" }}>
          Designing sustainable infrastructure for tomorrow.
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-6 max-w-xl text-base md:text-lg font-medium leading-relaxed tracking-[-0.005em]" style={{ color: "var(--ink-soft)" }}>
          I'm Neo Matsietsa, a civil engineering graduate from the University
          of the Witwatersrand, currently interning at OAR Consultants. My
          work spans transport planning, traffic impact assessments and GIS
          modelling — grounded in academic projects across geotechnical,
          structural and concrete engineering.
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate("projects")}
            className="cep-btn-primary cep-focus px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2"
          >
            View Projects <ArrowRight size={15} className="cep-btn-icon" />
          </button>
          <button
            onClick={() => onNavigate("resume")}
            className="cep-btn-outline cep-focus px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2"
          >
            <Download size={15} className="cep-btn-icon" /> Download Resume
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="cep-btn-outline cep-focus px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2"
          >
            Contact Me
          </button>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px max-w-2xl" style={{ background: "var(--line)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="p-5" style={{ background: "var(--surface)" }}>
              <div className="font-display text-3xl font-semibold" style={{ color: "var(--ink)" }}>{s.value}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <button
        onClick={() => onNavigate("about")}
        aria-label="Scroll to about section"
        className="cep-focus mt-16 flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--ink-faint)" }}
      >
        Scroll
        <ChevronDown size={14} className="animate-bounce" />
      </button>
    </div>
  </section>
  );
};

/* ------------------------------------------------------------------ */
/* About                                                                */
/* ------------------------------------------------------------------ */
const About = () => (
  <section id="about" className="py-28 md:py-40" style={{ background: "var(--surface-alt)" }}>
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <Reveal><SectionEyebrow index={2} total={8}>About</SectionEyebrow></Reveal>

      <div className="grid md:grid-cols-5 gap-12 mt-8">
        <Reveal className="md:col-span-2" delay={60}>
          <ImageSlot
            src="/images/profile.jpg"
            alt="Portrait"
            className="aspect-[4/5] w-full cep-card overflow-hidden"
            placeholder="Photo placeholder — 4:5. Add public/images/profile.jpg to fill this."
          />
          <div className="mt-6 space-y-3">
            {EDUCATION.map((e) => (
              <div key={e.title} className="pl-4" style={{ borderLeft: "2px solid var(--accent)" }}>
                <div className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--accent)" }}>{e.year}</div>
                <div className="font-medium mt-0.5" style={{ color: "var(--ink)" }}>{e.title}</div>
                <div className="text-sm mt-0.5" style={{ color: "var(--ink-soft)" }}>{e.place}</div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>{e.detail}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="md:col-span-3" delay={120}>
          <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--ink)" }}>
            I think in networks — traffic, water and terrain.
          </h2>
          <p className="mt-6 leading-[1.75] max-w-2xl" style={{ color: "var(--ink-soft)" }}>
            I'm a civil engineering graduate from the University of the
            Witwatersrand, currently working as a Civil Engineering Intern at
            OAR Consultants and registered as an ECSA Candidate Engineer. My
            practical experience covers transport planning, traffic impact
            assessments, GIS modelling and AutoCAD design, backed by academic
            projects in geotechnical, structural and concrete engineering —
            from an upstream tailings storage facility to a reinforced-concrete
            multi-storey building.
          </p>
          <p className="mt-5 leading-[1.75] max-w-2xl" style={{ color: "var(--ink-soft)" }}>
            I'm drawn to the problems that sit at the intersection of people
            and infrastructure — a road alignment across 30° terrain, or a
            traffic assessment that has to work for learners who can't rely
            on visual or auditory cues. Practical, sustainable solutions
            developed in multidisciplinary teams are what I optimise for.
          </p>

          <div className="mt-8">
            <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Career goals</div>
            <p style={{ color: "var(--ink-soft)" }}>
              I'm looking to grow within a global consulting environment and
              contribute to complex infrastructure projects across South
              Africa and internationally, building on my current transport
              planning and traffic engineering experience at OAR Consultants.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="p-6 cep-card cep-card-hover">
                <div className="font-medium" style={{ color: "var(--ink)" }}>{v.title}</div>
                <div className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{v.detail}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Projects                                                             */
/* ------------------------------------------------------------------ */
const ProjectCard = ({ project, open, onToggle, delay }) => {
  const Icon = project.icon;
  return (
    <Reveal delay={delay} className="cep-card cep-card-hover">
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--line)", color: "var(--accent-ink)", background: "var(--pill-bg)" }}>
              <Icon size={18} />
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--accent-ink)" }}>{project.category}</div>
              <h3 className="font-display font-bold text-2xl mt-1.5 leading-snug tracking-tight" style={{ color: "var(--ink)" }}>{project.title}</h3>
            </div>
          </div>
          <button
            onClick={onToggle}
            aria-expanded={open}
            className="cep-focus cep-icon-btn flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full"
            style={{ color: open ? "var(--accent-ink)" : "var(--ink-faint)", borderColor: open ? "var(--accent)" : "var(--line)" }}
          >
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        <p className="mt-4 text-sm leading-[1.75]" style={{ color: "var(--ink-soft)" }}>{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.software.map((s) => (
            <span key={s} className="cep-pill cep-pill-hover">
              {s}
            </span>
          ))}
        </div>

        <div
          className="grid overflow-hidden transition-all duration-500 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            <div className="mt-6 pt-6 space-y-5" style={{ borderTop: "1px solid var(--line-soft)" }}>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs" style={{ color: "var(--ink-faint)" }}>
                <div>ROLE — <span style={{ color: "var(--ink-soft)" }}>{project.role}</span></div>
                <div>DURATION — <span style={{ color: "var(--ink-soft)" }}>{project.duration}</span></div>
              </div>

              <ProjectField label="Overview" text={project.overview} />
              <ProjectField label="Problem" text={project.problem} />
              <ProjectFieldList label="Objectives" items={project.objectives} />
              <ProjectField label="Engineering process" text={project.process} />
              <ProjectField label="Design decisions" text={project.decisions} />
              <ProjectField label="Challenges" text={project.challenges} />
              <ProjectField label="Solutions" text={project.solutions} />
              <ProjectField label="Results" text={project.results} />
              <ProjectField label="Lessons learned" text={project.lessons} />

              <div className="aspect-video w-full flex items-center justify-center font-mono text-xs" style={{ border: "1px dashed var(--line)", color: "var(--ink-faint)" }}>
                Project gallery placeholder — drawings / renders / site photos
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const ProjectField = ({ label, text }) => (
  <div>
    <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--ink-faint)" }}>{label}</div>
    <p className="text-sm leading-[1.75]" style={{ color: "var(--ink-soft)" }}>{text}</p>
  </div>
);

const ProjectFieldList = ({ label, items }) => (
  <div>
    <div className="font-mono text-[11px] uppercase tracking-widest mb-1.5" style={{ color: "var(--ink-faint)" }}>{label}</div>
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it} className="text-sm flex gap-2" style={{ color: "var(--ink-soft)" }}>
          <span style={{ color: "var(--accent)" }}>—</span>{it}
        </li>
      ))}
    </ul>
  </div>
);

const Projects = () => {
  const [openId, setOpenId] = useState(PROJECTS[0].id);
  return (
    <section id="projects" className="relative py-28 md:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative">
        <Reveal><SectionEyebrow index={3} total={8}>Projects</SectionEyebrow></Reveal>
        <Reveal delay={60}>
          <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: "var(--ink)" }}>
            Case studies, not just a gallery.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Seven projects spanning transport planning, geotechnical and
            structural design — each one expands into the full brief,
            process and outcome.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              open={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
              delay={i * 40}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Skills                                                               */
/* ------------------------------------------------------------------ */
const Skills = () => (
  <section id="skills" className="py-28 md:py-40" style={{ background: "var(--surface-alt)" }}>
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <Reveal><SectionEyebrow index={4} total={8}>Skills</SectionEyebrow></Reveal>
      <Reveal delay={60}>
        <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: "var(--ink)" }}>
          Tools and judgement, side by side.
        </h2>
      </Reveal>

      <div className="mt-12 grid md:grid-cols-3 gap-10">
        {SKILL_GROUPS.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 100}>
            <div className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>{group.title}</div>
            <div className="space-y-4">
              {group.items.map((item, ii) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: "var(--ink)" }}>{item.name}</span>
                    <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>{item.level}%</span>
                  </div>
                  <ProgressBar level={item.level} delay={ii * 60} />
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Experience                                                           */
/* ------------------------------------------------------------------ */
const Experience = () => (
  <section id="experience" className="py-28 md:py-40">
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <Reveal><SectionEyebrow index={5} total={8}>Experience</SectionEyebrow></Reveal>
      <Reveal delay={60}>
        <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: "var(--ink)" }}>
          Beyond the classroom.
        </h2>
      </Reveal>

      <div className="mt-12 max-w-3xl">
        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.title} delay={i * 60}>
            <div className="flex gap-6 pb-10 relative">
              <div className="flex flex-col items-center flex-shrink-0 w-20">
                <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>{e.year}</span>
                <span className="w-2.5 h-2.5 rounded-full mt-2" style={{ background: "var(--accent)" }} />
                {i !== EXPERIENCE.length - 1 && <span className="flex-1 w-px mt-2" style={{ background: "var(--line)" }} />}
              </div>
              <div className="pb-2">
                <span className="cep-pill">
                  {e.tag}
                </span>
                <div className="font-medium mt-3" style={{ color: "var(--ink)" }}>{e.title}</div>
                <div className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{e.detail}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Certifications                                                       */
/* ------------------------------------------------------------------ */
const Certifications = () => (
  <section id="certifications" className="py-28 md:py-40" style={{ background: "var(--surface-alt)" }}>
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <Reveal><SectionEyebrow index={6} total={8}>Certifications</SectionEyebrow></Reveal>
      <Reveal delay={60}>
        <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: "var(--ink)" }}>
          Credentials on file.
        </h2>
      </Reveal>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CERTIFICATIONS.map((c, i) => (
          <Reveal key={c.title} delay={i * 50} className="cep-card cep-card-hover p-6">
            <Award size={18} style={{ color: "var(--ink-faint)" }} />
            <div className="font-medium mt-3 leading-snug" style={{ color: "var(--ink)" }}>{c.title}</div>
            <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>{c.org}</div>
            <div className="font-mono text-[11px] mt-2" style={{ color: "var(--ink-faint)" }}>{c.year}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Resume                                                               */
/* ------------------------------------------------------------------ */
const Resume = () => (
  <section id="resume" className="py-28 md:py-40">
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <Reveal><SectionEyebrow index={7} total={8}>Resume</SectionEyebrow></Reveal>

      <div className="grid md:grid-cols-3 gap-10 mt-8">
        <Reveal className="md:col-span-1">
          <h2 className="font-display text-3xl font-semibold" style={{ color: "var(--ink)" }}>
            One page. Everything a recruiter needs.
          </h2>
          <p className="mt-4 text-sm leading-[1.75]" style={{ color: "var(--ink-soft)" }}>
            Replace the button below with a link to your actual PDF once it's
            hosted, then keep this preview in sync with it.
          </p>
          <button
            className="cep-btn-primary cep-focus mt-6 px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2"
          >
            <Download size={15} className="cep-btn-icon" /> Download PDF
          </button>
          <p className="mt-3 font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
            resume.pdf — placeholder link
          </p>
        </Reveal>

        <Reveal delay={100} className="md:col-span-2 cep-card p-7 md:p-9">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display font-semibold text-xl" style={{ color: "var(--ink)" }}>Neo Matsietsa</div>
              <div className="text-sm" style={{ color: "var(--ink-soft)" }}>Graduate Civil Engineer</div>
            </div>
            <div className="font-mono text-[11px] text-right" style={{ color: "var(--ink-faint)" }}>
              neomatsietsa1@gmail.com<br />+27 64 024 7250
            </div>
          </div>

          <div className="mt-6">
            <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Education</div>
            {EDUCATION.map((e) => (
              <div key={e.title} className="flex justify-between text-sm py-1.5" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <span style={{ color: "var(--ink)" }}>{e.title}</span>
                <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>{e.year}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Experience</div>
            {EXPERIENCE.slice(0, 3).map((e) => (
              <div key={e.title} className="flex justify-between text-sm py-1.5" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <span style={{ color: "var(--ink)" }}>{e.title}</span>
                <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>{e.year}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Key skills</div>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {SKILL_GROUPS.flatMap((g) => g.items.slice(0, 3).map((i) => i.name)).join(" · ")}
            </p>
          </div>

          <div className="mt-6 text-sm italic" style={{ color: "var(--ink-faint)" }}>
            References available upon request.
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-28 md:py-40" style={{ background: "var(--surface-alt)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative">
        <Reveal><SectionEyebrow index={8} total={8}>Contact</SectionEyebrow></Reveal>
        <Reveal delay={60}>
          <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: "var(--ink)" }}>
            Let's talk about a graduate role.
          </h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-5 gap-10">
          <Reveal delay={100} className="md:col-span-2 space-y-5">
            <a href="mailto:neomatsietsa1@gmail.com" className="cep-focus flex items-center gap-3 text-sm cep-card cep-card-hover p-5" style={{ color: "var(--ink)" }}>
              <Mail size={16} style={{ color: "var(--accent)" }} /> neomatsietsa1@gmail.com
            </a>
            <a href="tel:+27640247250" className="cep-focus flex items-center gap-3 text-sm cep-card cep-card-hover p-5" style={{ color: "var(--ink)" }}>
              <Phone size={16} style={{ color: "var(--accent)" }} /> +27 64 024 7250
            </a>
            <div className="flex items-center gap-3 text-sm cep-card p-5" style={{ color: "var(--ink)" }}>
              <MapPin size={16} style={{ color: "var(--ink-faint)" }} /> 1226 Park Street, Pretoria
            </div>
            <div className="flex gap-3 pt-2">
              <a href="https://linkedin.com/in/neomatsietsa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="cep-focus cep-icon-btn w-10 h-10 flex items-center justify-center rounded-full" style={{ color: "var(--ink)" }}>
                <Linkedin size={16} />
              </a>
              <a href="https://neomatsietsa.my.canva.site/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio link" className="cep-focus cep-icon-btn w-10 h-10 flex items-center justify-center rounded-full" style={{ color: "var(--ink)" }}>
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="aspect-video w-full flex items-center justify-center font-mono text-xs mt-2" style={{ border: "1px dashed var(--line)", color: "var(--ink-faint)" }}>
              Map placeholder
            </div>
          </Reveal>

          <Reveal delay={160} className="md:col-span-3 cep-card p-7 md:p-9">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <CheckCircle2 size={28} style={{ color: "var(--accent)" }} />
                <div className="font-display text-xl font-semibold mt-4" style={{ color: "var(--ink)" }}>Message ready.</div>
                <p className="mt-2 text-sm max-w-xs" style={{ color: "var(--ink-soft)" }}>
                  This form is a UI placeholder — connect it to your email
                  service or a form backend to actually receive messages.
                </p>
                <button onClick={() => setSent(false)} className="cep-btn-outline cep-focus mt-6 px-5 py-2.5 text-sm">
                  Back to form
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="cep-focus cep-input mt-2 w-full px-4 py-3 text-sm bg-transparent"
                    style={{ color: "var(--ink)" }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="cep-focus cep-input mt-2 w-full px-4 py-3 text-sm bg-transparent"
                    style={{ color: "var(--ink)" }}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="cep-focus cep-input mt-2 w-full px-4 py-3 text-sm bg-transparent resize-none"
                    style={{ color: "var(--ink)" }}
                    placeholder="Tell me about the role..."
                  />
                </div>
                <button type="submit" className="cep-btn-primary cep-focus px-6 py-3.5 text-sm font-medium inline-flex items-center gap-2">
                  Send message <Send size={14} className="cep-btn-icon" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <footer className="py-10" style={{ borderTop: "1px solid var(--line)" }}>
    <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
      <span>© {new Date().getFullYear()} Neo Matsietsa. Drawing set for informational purposes only.</span>
      <span>Built with React &amp; Tailwind — DWG REV 0</span>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/* Back to top                                                          */
/* ------------------------------------------------------------------ */
const BackToTop = ({ visible, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Back to top"
    className={`cep-focus fixed bottom-5 left-5 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
    }`}
    style={{ background: "var(--ink)", color: "var(--surface)", boxShadow: "var(--shadow-md)" }}
  >
    <ChevronUp size={16} />
  </button>
);

/* ------------------------------------------------------------------ */
/* Reading progress                                                     */
/* ------------------------------------------------------------------ */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setPct(height > 0 ? (scrolled / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60]" style={{ background: "transparent" }}>
      <div className="h-full" style={{ width: `${pct}%`, background: "var(--accent)", transition: "width .1s linear" }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */
export default function CivilEngineeringPortfolio() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("home");
  const [showTop, setShowTop] = useState(false);

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));

    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="cep-root min-h-screen" data-theme={dark ? "dark" : "light"}>
      <FontLoader />
      <ThemeStyles />
      <ReadingProgress />
      <Nav active={active} onNavigate={handleNavigate} dark={dark} setDark={setDark} />
      <main>
        <Hero onNavigate={handleNavigate} />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Certifications />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <TitleBlock activeSection={active} dark={dark} />
      <BackToTop visible={showTop} onClick={() => handleNavigate("home")} />
    </div>
  );
}
