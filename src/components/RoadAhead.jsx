import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { GraduationCap, Award, Briefcase, Building2, HardHat, Compass } from "lucide-react";

/* ==================================================================== */
/* RoadAhead — "The milestones continue, even if they haven't been      */
/* defined yet."                                                        */
/*                                                                       */
/* A time-proportional horizontal timeline: gap between checkpoints is  */
/* a direct function of elapsed years, not a fixed grid. Past milestones*/
/* are settled and solid; future ones progressively lose contrast and   */
/* dissolve into an atmospheric mist at the right edge — the timeline   */
/* never resolves to a hard stop, because the trajectory hasn't either. */
/*                                                                       */
/* Depends only on this file's own markup/CSS plus the design tokens    */
/* already defined globally on .cep-root (--surface, --ink, --line,     */
/* --accent-ink, etc.) — drop it in anywhere inside that root and it     */
/* will pick up the site's existing palette and type scale.             */
/* ==================================================================== */

/* ---------------------------------------------------------------- */
/* MilestoneImage — same contract as the site's existing ImageSlot:  */
/* shows the photo/certificate if it exists at the given path, and    */
/* quietly falls back to a plain placeholder if it doesn't, so an     */
/* unfinished image set never looks like a broken page. Duplicated    */
/* locally (rather than imported) so this file stays fully standalone.*/
/* ---------------------------------------------------------------- */
const MilestoneImage = ({ src, alt, className = "" }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center text-center px-3 font-mono text-[10px] leading-snug ${className}`}
        style={{ color: "var(--ink-faint)", border: "1px dashed var(--line)", borderRadius: 12 }}
      >
        Photo / certificate
        <br />
        placeholder
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      style={{ borderRadius: 12 }}
    />
  );
};

/* ---------------------------------------------------------------- */
/* Timeline data                                                     */
/* ---------------------------------------------------------------- */
/* `year` drives horizontal position on a real time scale — it is the */
/* only thing that determines spacing. `dateLabel` is just what's      */
/* printed (so "Current" can still sit at its true 2025 position).     */
const NOW_ID = "oar-practice";

const MILESTONES = [
  {
    id: "matric",
    year: 2019,
    dateLabel: "2019",
    category: "Academic Foundation",
    title: "Matriculation",
    summary: "Completed secondary schooling — the starting point of a path toward professional engineering practice.",
    icon: GraduationCap,
    image: "/images/milestones/matric.jpg",
  },
  {
    id: "bsc-start",
    year: 2020,
    dateLabel: "2020",
    category: "University",
    title: "BSc Civil Engineering — Wits",
    summary: "Began undergraduate study in Civil Engineering at the University of the Witwatersrand.",
    icon: GraduationCap,
    image: "/images/milestones/bsc-start.jpg",
  },
  {
    id: "bsc-hons",
    year: 2023,
    dateLabel: "2023",
    category: "Milestone",
    title: "BSc (Hons) Civil Engineering, Graduate",
    summary: "Graduated with Honours, with academic project work spanning geotechnical, structural and concrete engineering.",
    icon: Award,
    image: "/images/milestones/bsc-hons.jpg",
  },
  {
    id: "ecsa-candidate",
    year: 2024,
    dateLabel: "2024",
    category: "Professional Registration",
    title: "ECSA Candidate Engineer",
    summary: "Registered as a Candidate Engineer with the Engineering Council of South Africa.",
    icon: Award,
    image: "/images/milestones/ecsa-candidate.jpg",
  },
  {
    id: NOW_ID,
    year: 2025,
    dateLabel: "Current",
    category: "Professional Practice — OAR Consultants",
    title: "Transport & Traffic Engineering Practice",
    summary: "Practising in transport planning, traffic impact assessment and GIS-based modelling.",
    icon: Briefcase,
    image: "/images/milestones/oar-practice.jpg",
    current: true,
  },
  {
    id: "pr-eng",
    year: 2027,
    dateLabel: "2027",
    category: "Professional Standing",
    title: "Pr.Eng Professional Registration",
    summary: "The next formal milestone in practice — full professional registration.",
    icon: Award,
    image: "/images/milestones/pr-eng.jpg",
    future: true,
  },
  {
    id: "major-infra",
    year: 2029,
    dateLabel: "2029",
    category: "Technical Leadership",
    title: "Major Infrastructure Project Leadership",
    summary: "Leading delivery on infrastructure work at a larger scale and scope.",
    icon: Building2,
    image: "/images/milestones/major-infra.jpg",
    future: true,
  },
  {
    id: "mentoring",
    year: 2031,
    dateLabel: "2031",
    category: "Stewardship",
    title: "Mentoring & Graduate Development",
    summary: "Supporting the next generation of graduate engineers entering practice.",
    icon: HardHat,
    image: "/images/milestones/mentoring.jpg",
    future: true,
  },
  {
    id: "horizon",
    year: 2034,
    dateLabel: "Horizon",
    category: "Direction",
    title: "Long-Term Strategic Practice",
    summary: "The trajectory continues — future milestones not yet defined.",
    icon: Compass,
    image: null,
    future: true,
    horizon: true,
  },
];

/* ---------------------------------------------------------------- */
/* Layout constants — pure time-scale math, no illustrative fudging  */
/* ---------------------------------------------------------------- */
const BASE_YEAR = MILESTONES[0].year;
const PX_PER_YEAR = 130;
const PAD_LEFT = 64;
const TRAILING_MIST_PX = 460; // empty track kept past the last node so the mask always has room to fade, at any scroll position
const LIFT_RADIUS = 130; // px — cursor influence radius for the magnetic wave
const LIFT_MAX = 8; // px — max elevation at the cursor's exact position

const xForYear = (year) => PAD_LEFT + (year - BASE_YEAR) * PX_PER_YEAR;
const NOW_YEAR = MILESTONES.find((m) => m.id === NOW_ID).year;
const HORIZON_YEAR = MILESTONES[MILESTONES.length - 1].year;
const TRACK_WIDTH = xForYear(HORIZON_YEAR) + TRAILING_MIST_PX;

/* Contrast fades from --ink toward --ink-faint the further a milestone */
/* sits beyond "now" — a second, independent mist effect layered under  */
/* the edge mask so future items read as fainter even mid-scroll.       */
const contrastFor = (m) => {
  if (!m.future) return 1;
  const t = Math.min(1, (m.year - NOW_YEAR) / (HORIZON_YEAR - NOW_YEAR));
  return 1 - t * 0.7; // settles at 0.3 opacity by the horizon node
};

/* ---------------------------------------------------------------- */
/* useTimelineScrub — mirrors the site's existing CadCrosshair        */
/* pattern: a single rAF-throttled mousemove handler writing directly  */
/* to refs (scrub line position/label + each node's lift transform),  */
/* so the "magnetic wave" tracks the cursor with no React re-renders.  */
/* Skips entirely on touch/coarse-pointer devices, where the timeline  */
/* is still fully usable via scroll + tap.                             */
/* ---------------------------------------------------------------- */
function useTimelineScrub(viewportRef, nodePositions) {
  const scrubLineRef = useRef(null);
  const scrubLabelRef = useRef(null);
  const nodeRefs = useRef({});

  const setNodeRef = useCallback((id) => (el) => {
    nodeRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof window === "undefined" || !window.matchMedia) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = null;
    let lastEvent = null;

    const resetLifts = () => {
      Object.values(nodeRefs.current).forEach((node) => {
        if (node) node.style.transform = "translateY(0px)";
      });
    };

    const render = () => {
      raf = null;
      if (!lastEvent) return;
      const rect = el.getBoundingClientRect();
      const contentX = lastEvent.clientX - rect.left + el.scrollLeft;

      if (scrubLineRef.current) {
        scrubLineRef.current.style.transform = `translate3d(${contentX.toFixed(1)}px, 0, 0)`;
        scrubLineRef.current.style.opacity = "1";
      }
      if (scrubLabelRef.current) {
        const year = BASE_YEAR + (contentX - PAD_LEFT) / PX_PER_YEAR;
        scrubLabelRef.current.textContent = `≈ ${Math.round(year)}`;
      }

      nodePositions.forEach(({ id, x }) => {
        const node = nodeRefs.current[id];
        if (!node) return;
        const dist = Math.abs(contentX - x);
        const falloff = Math.max(0, 1 - dist / LIFT_RADIUS);
        const lift = LIFT_MAX * falloff;
        node.style.transform = `translateY(-${lift.toFixed(1)}px)`;
      });
    };

    const onMove = (e) => {
      lastEvent = e;
      if (raf == null) raf = requestAnimationFrame(render);
    };
    const onLeave = () => {
      lastEvent = null;
      if (scrubLineRef.current) scrubLineRef.current.style.opacity = "0";
      resetLifts();
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [viewportRef, nodePositions]);

  return { scrubLineRef, scrubLabelRef, setNodeRef };
}

/* ---------------------------------------------------------------- */
/* Redirect vertical mouse-wheel input into horizontal scroll, while  */
/* leaving trackpad horizontal gestures (which already arrive as      */
/* deltaX) untouched — a small desktop courtesy for a sideways track.  */
/* ---------------------------------------------------------------- */
function useWheelToHorizontal(viewportRef) {
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal input
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [viewportRef]);
}

/* ---------------------------------------------------------------- */
/* Docked detail panel — a single, fixed-position architectural        */
/* title-block that updates its content on hover/focus/tap, rather     */
/* than a floating tooltip pinned to each node. Deliberate departure    */
/* from a per-node popover: floating cards above a horizontally-        */
/* scrolling track either get clipped (overflow-x/overflow-y can't be  */
/* mixed the way you'd want here) or require constant reposition math  */
/* on every scroll frame. A single steady panel is also the calmer,    */
/* more "instrument panel" reading — content changes, the fixture      */
/* holding it doesn't, which sits closer to "quiet confidence" than     */
/* things popping up throughout the composition.                       */
/* ---------------------------------------------------------------- */
const DetailPanel = ({ milestone }) => {
  const Icon = milestone.icon;
  return (
    <div
      key={milestone.id}
      className="cep-road-panel-in mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-5 md:gap-7 p-5 md:p-7"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--line-soft)",
        borderRadius: 20,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase"
            style={{ background: "var(--pill-bg)", color: "var(--ink-soft)" }}
          >
            <Icon size={12} />
            {milestone.category}
          </span>
          <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--ink-faint)" }}>
            {milestone.dateLabel}
          </span>
        </div>
        <h4 className="font-display font-semibold text-lg md:text-xl" style={{ color: "var(--ink)" }}>
          {milestone.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--ink-soft)" }}>
          {milestone.summary}
        </p>
      </div>
      <MilestoneImage
        src={milestone.image}
        alt={milestone.title}
        className="w-full aspect-[4/3] md:aspect-auto md:h-full"
      />
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Main component                                                    */
/* ---------------------------------------------------------------- */
export default function RoadAhead() {
  const viewportRef = useRef(null);
  const [activeId, setActiveId] = useState(NOW_ID);

  const nodePositions = useMemo(
    () => MILESTONES.map((m) => ({ id: m.id, x: xForYear(m.year) })),
    []
  );

  const { scrubLineRef, scrubLabelRef, setNodeRef } = useTimelineScrub(viewportRef, nodePositions);
  useWheelToHorizontal(viewportRef);

  const activeMilestone = MILESTONES.find((m) => m.id === activeId) ?? MILESTONES[0];
  const nowX = xForYear(NOW_YEAR);
  const nowPct = (nowX / TRACK_WIDTH) * 100;

  return (
    <section className="py-28 md:py-40" aria-labelledby="road-ahead-heading">
      <style>{`
        .cep-road-viewport{
          overflow-x:auto;
          overflow-y:hidden;
          -webkit-mask-image: linear-gradient(to right, black 0%, black 70%, transparent 100%);
          mask-image: linear-gradient(to right, black 0%, black 70%, transparent 100%);
          scrollbar-width:none;
          -ms-overflow-style:none;
        }
        .cep-road-viewport::-webkit-scrollbar{ display:none; height:0; }

        .cep-road-node-btn{
          transition: transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
        }
        .cep-road-node-btn:hover, .cep-road-node-btn:focus-visible{
          box-shadow: 0 0 0 5px var(--accent-soft);
          border-color: var(--accent) !important;
        }
        .cep-road-node-lift{
          transition: transform 250ms cubic-bezier(.2,.7,.2,1);
          will-change: transform;
        }
        .cep-road-scrubline{
          transition: opacity 150ms ease;
          will-change: transform, opacity;
        }

        @keyframes cep-road-panel-in{
          from{ opacity:0; transform:translateY(6px); }
          to{ opacity:1; transform:translateY(0); }
        }
        .cep-road-panel-in{ animation: cep-road-panel-in 320ms cubic-bezier(.2,.7,.2,1); }

        @media (prefers-reduced-motion: reduce){
          .cep-road-node-lift, .cep-road-panel-in{ animation:none; transition:none; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "var(--ink-faint)" }}>
            Trajectory
          </span>
          <span className="flex-1 h-px" style={{ background: "var(--line)" }} />
        </div>
        <h3 id="road-ahead-heading" className="font-display font-semibold text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>
          The road ahead
        </h3>
        <p className="mt-3 max-w-lg text-sm md:text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          The milestones continue, even if they haven't been defined yet.
        </p>

        {/* Timeline viewport */}
        <div ref={viewportRef} className="cep-road-viewport mt-14 md:mt-16" style={{ paddingBottom: 8 }}>
          <div className="relative" style={{ width: TRACK_WIDTH, height: 128 }}>
            {/* baseline — solid through the present, dashed and fading beyond it */}
            <div
              className="absolute left-0"
              style={{
                top: "50%",
                width: `${nowPct}%`,
                height: 1,
                background: "var(--line)",
                transform: "translateY(-0.5px)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: "50%",
                left: `${nowPct}%`,
                right: 0,
                borderTop: "1.5px dashed var(--ink-faint)",
                opacity: 0.7,
                transform: "translateY(-0.75px)",
              }}
            />

            {/* cursor scrub line + live time readout (desktop, fine-pointer only) */}
            <div
              ref={scrubLineRef}
              className="cep-road-scrubline absolute top-0 bottom-0 pointer-events-none"
              style={{ left: 0, width: 1, background: "var(--accent)", opacity: 0 }}
            >
              <span
                ref={scrubLabelRef}
                className="absolute font-mono text-[10px] tracking-wide whitespace-nowrap"
                style={{ top: -22, left: 8, color: "var(--accent-ink)" }}
              />
            </div>

            {/* milestone nodes */}
            {MILESTONES.map((m) => {
              const Icon = m.icon;
              const x = xForYear(m.year);
              const contrast = contrastFor(m);
              const isActive = m.id === activeId;
              const color = m.current
                ? "var(--accent)"
                : m.future
                ? "var(--ink-faint)"
                : "var(--ink)";

              return (
                <div
                  key={m.id}
                  className="absolute"
                  style={{ left: x, top: "50%", transform: "translate(-50%, -50%)", opacity: contrast }}
                >
                  <div ref={setNodeRef(m.id)} className="cep-road-node-lift flex flex-col items-center">
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase mb-2 whitespace-nowrap"
                      style={{ color: m.future ? "var(--ink-faint)" : "var(--ink-soft)" }}
                    >
                      {m.dateLabel}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveId(m.id)}
                      onMouseEnter={() => setActiveId(m.id)}
                      onFocus={() => setActiveId(m.id)}
                      aria-label={`${m.title} — ${m.dateLabel}`}
                      aria-pressed={isActive}
                      className="cep-road-node-btn cep-focus rounded-full flex items-center justify-center"
                      style={{
                        width: m.current ? 14 : 11,
                        height: m.current ? 14 : 11,
                        background: m.future ? "var(--surface)" : color,
                        border: `1.5px ${m.horizon ? "dashed" : "solid"} ${color}`,
                        boxShadow: isActive ? "0 0 0 5px var(--accent-soft)" : "none",
                      }}
                    />

                    <span
                      className="mt-2 font-mono text-[10px] uppercase tracking-wide whitespace-nowrap max-w-[120px] text-center truncate"
                      style={{ color: "var(--ink-faint)" }}
                      title={m.title}
                    >
                      {m.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Docked title-block detail panel — always shows the active milestone */}
        <DetailPanel milestone={activeMilestone} />
      </div>
    </section>
  );
}
