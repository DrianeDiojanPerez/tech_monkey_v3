import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

export const Route = createFileRoute("/")({ component: Landing })

type Theme = "light" | "dark"

function CountUp({
  end,
  duration = 1600,
  delay = 0,
  format,
  suffix,
}: {
  end: number
  duration?: number
  delay?: number
  format?: (n: number) => string
  suffix?: React.ReactNode
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const timer = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(eased * end))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [end, duration, delay])

  return (
    <>
      {format ? format(value) : value}
      {suffix}
    </>
  )
}

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const marqueeItems: Array<{ label: string; icon: React.ReactNode }> = [
  {
    label: "Banners",
    icon: (
      <svg {...iconProps}>
        <path d="M4 3v18" />
        <path d="M4 4h13l-3 4 3 4H4z" />
      </svg>
    ),
  },
  {
    label: "Vehicle wraps",
    icon: (
      <svg {...iconProps}>
        <path d="M5 16h14v-3l-2-5H7l-2 5v3z" />
        <path d="M7 16v2M17 16v2" />
        <circle cx="8" cy="16" r="1.3" />
        <circle cx="16" cy="16" r="1.3" />
      </svg>
    ),
  },
  {
    label: "Storefront signs",
    icon: (
      <svg {...iconProps}>
        <path d="M4 10l1-5h14l1 5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    label: "POS systems",
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
        <path d="M3.5 10h17" />
        <path d="M7 14.5h3M7 17h6" />
      </svg>
    ),
  },
  {
    label: "Networking",
    icon: (
      <svg {...iconProps}>
        <path d="M4 12a11 11 0 0 1 16 0" />
        <path d="M7.5 15a6 6 0 0 1 9 0" />
        <path d="M10.5 17.8a2.2 2.2 0 0 1 3 0" />
      </svg>
    ),
  },
  {
    label: "Vinyl decals",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" strokeDasharray="3 2.5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Apparel",
    icon: (
      <svg {...iconProps}>
        <path d="M8 4l-4.5 2.5L5.5 11 8 10v10h8V10l2.5 1 2-4.5L16 4l-2.2 1.6a3 3 0 0 1-3.6 0z" />
      </svg>
    ),
  },
  {
    label: "Surveillance",
    icon: (
      <svg {...iconProps}>
        <path d="M3 7.5l13.5-3 2 7L5 14.5z" />
        <path d="M18 12l3 1-1 3-3-1" />
        <path d="M10 13v3" />
        <path d="M8 19h6" />
      </svg>
    ),
  },
]

function Landing() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light"
    return (document.documentElement.getAttribute("data-theme") as Theme) ?? "light"
  })
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [blinkOn, setBlinkOn] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )
    document.querySelectorAll(".tm-landing .reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setBlinkOn((v) => !v), 520)
    return () => clearInterval(id)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      try {
        localStorage.setItem("tm-theme", next)
      } catch {}
      return next
    })
  }

  const scrollSvc = (dir: -1 | 1) =>
    trackRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" })

  return (
    <div className="tm-landing">
      {/* NAV */}
      <div className="nav-wrap">
        <nav className="nav">
          <a className="brand" href="#">
            <span className="brand-mark">
              <img src="https://github.com/DrianeDiojanPerez/tech_monkey_v3/blob/master/public/logo.jpg?raw=true" alt="" />
            </span>{" "}
            Tech Monkeys
          </a>
          <div className="nav-links">
            <a href="#services">
              Services <span className="caret" />
            </a>
            <a href="#showcase">Work</a>
            <a href="#process">
              Process <span className="caret" />
            </a>
            <a href="#about">About</a>
          </div>
          <div className="nav-cta">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              type="button"
            >
              <svg
                className="sun"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg
                className="moon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            </button>
            <button className="tm-btn tm-btn-ghost" type="button">
              Sign in
            </button>
            <button className="tm-btn tm-btn-dark" type="button">
              Get a quote <span className="arrow">→</span>
            </button>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-ground" aria-hidden="true">
          <svg viewBox="0 0 1600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="tm-sea-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c5dde6" stopOpacity="0.55" />
                <stop offset="1" stopColor="#a8cdd9" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* SEA — top quarter (y 0–50) */}
            <rect x="0" y="0" width="1600" height="50" fill="url(#tm-sea-fill)" />
            <path
              d="M0 6 L 1600 6"
              fill="none"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="ocean-horizon-line"
            />
            <path
              d="M-40 16 Q 60 13, 160 16 T 360 16 T 560 16 T 760 16 T 960 16 T 1160 16 T 1360 16 T 1560 16 L 1640 16"
              fill="none"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              className="wave wave-1"
            />
            <path
              d="M-40 26 Q 80 23, 200 26 T 440 26 T 680 26 T 920 26 T 1160 26 T 1400 26 T 1640 26"
              fill="none"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="wave wave-2"
            />
            <path
              d="M-40 36 Q 110 33, 260 36 T 560 36 T 860 36 T 1160 36 T 1460 36 L 1640 36"
              fill="none"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              className="wave wave-3"
            />
            {/* shoreline foam — wavy boundary between sea and sand */}
            <path
              d="M-40 44 Q 160 41, 360 45 T 760 45 T 1160 45 T 1640 44 L 1640 50 L -40 50 Z"
              fill="#fff"
              opacity="0.35"
              className="wave wave-1"
            />

            {/* SAND — bottom three quarters (y 50–200) */}
            <path
              d="M0 52 Q 400 46, 800 50 T 1600 52 L 1600 200 L 0 200 Z"
              fill="#efe2c6"
            />
            <path
              d="M0 52 Q 400 46, 800 50 T 1600 52"
              stroke="#d4c298"
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <g fill="#a89a78" opacity="0.5">
              <circle cx="60" cy="110" r="1.2" />
              <circle cx="180" cy="138" r="1" />
              <circle cx="320" cy="118" r="1.4" />
              <circle cx="460" cy="150" r="1" />
              <circle cx="600" cy="124" r="1.2" />
              <circle cx="740" cy="162" r="1" />
              <circle cx="880" cy="118" r="1.3" />
              <circle cx="1020" cy="144" r="1.1" />
              <circle cx="1160" cy="120" r="1.4" />
              <circle cx="1300" cy="158" r="1" />
              <circle cx="1440" cy="126" r="1.2" />
              <circle cx="1560" cy="150" r="1.1" />
            </g>
          </svg>
        </div>
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="pulse" /> Signs · Print · IT — Belize City
              </span>

              <h1 className="title">
                <span className="word" style={{ animationDelay: ".05s" }}>
                  Big
                </span>{" "}
                <span className="word" style={{ animationDelay: ".15s" }}>
                  ideas,
                </span>
                <br />
                <span className="word" style={{ animationDelay: ".25s" }}>
                  printed
                </span>{" "}
                <span
                  className="word italic"
                  style={{ animationDelay: ".35s" }}
                >
                  beautifully.
                </span>
              </h1>

              <p className="hero-sub">
                From storefront signage to fleet wraps and POS systems — Tech
                Monkeys is the all-in-one shop for businesses in Belize that
                need to look (and run) sharper.
              </p>
              <div className="hero-cta-row">
                <button className="tm-btn tm-btn-green" type="button">
                  Start a project <span className="arrow">→</span>
                </button>
                <button className="tm-btn tm-btn-ghost" type="button">
                  See our work
                </button>
              </div>
              <div className="hero-meta">
                <div>
                  <b>
                    <CountUp
                      end={14}
                      delay={500}
                      suffix={<span className="serif">+</span>}
                    />
                  </b>
                  <span>Years in Belize</span>
                </div>
                <div>
                  <b>
                    <CountUp
                      end={2400}
                      duration={1800}
                      delay={650}
                      format={(n) => n.toLocaleString()}
                    />
                  </b>
                  <span>Projects shipped</span>
                </div>
                <div>
                  <b>
                    <CountUp end={48} delay={800} suffix="h" />
                  </b>
                  <span>Avg turnaround</span>
                </div>
              </div>
            </div>

            <div className="hero-stage" aria-hidden="true">
              <svg
                width="0"
                height="0"
                style={{ position: "absolute" }}
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="tm-sun-halo" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#ff9a4a" stopOpacity="0.5" />
                    <stop offset="0.5" stopColor="#ffb874" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#f6c794" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="tm-moon-halo" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#cfd8e8" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#cfd8e8" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="tm-wall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f6f0df" />
                    <stop offset="1" stopColor="#e6dcbf" />
                  </linearGradient>
                  <linearGradient id="tm-wood-warm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7a5230" />
                    <stop offset="1" stopColor="#3a2812" />
                  </linearGradient>
                  <linearGradient id="tm-window" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffd97a" />
                    <stop offset="1" stopColor="#f0a050" />
                  </linearGradient>
                </defs>
              </svg>

              {/* SKY — sun/moon, clouds, ocean, atmosphere */}
              <div className="float scene-sky">
                <svg
                  viewBox="0 0 460 460"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* DAY — sunset sun */}
                  <g className="day-sky">
                    <ellipse
                      cx="330"
                      cy="130"
                      rx="118"
                      ry="86"
                      fill="url(#tm-sun-halo)"
                    />
                    <circle
                      cx="330"
                      cy="130"
                      r="32"
                      fill="#ff9a4a"
                      className="sun-disc"
                    />
                    <circle
                      cx="330"
                      cy="130"
                      r="44"
                      fill="none"
                      stroke="#ff9a4a"
                      strokeWidth="1"
                      opacity="0.5"
                      className="sun-ring"
                    />
                  </g>

                  {/* NIGHT — moon + stars */}
                  <g className="night-sky">
                    <ellipse
                      cx="330"
                      cy="130"
                      rx="100"
                      ry="74"
                      fill="url(#tm-moon-halo)"
                    />
                    <circle cx="330" cy="130" r="28" fill="#f6f0df" />
                    {/* moon craters */}
                    <circle cx="322" cy="120" r="4" fill="#cfc7ad" opacity="0.45" />
                    <circle cx="340" cy="138" r="3.5" fill="#cfc7ad" opacity="0.4" />
                    <circle cx="324" cy="142" r="2.2" fill="#cfc7ad" opacity="0.35" />
                    {/* stars */}
                    <g className="stars">
                      <circle cx="40" cy="32" r="1.2" fill="#fff" className="star star-a" />
                      <circle cx="92" cy="18" r="0.9" fill="#fff" className="star star-b" />
                      <circle cx="148" cy="40" r="1.4" fill="#fff" className="star star-c" />
                      <circle cx="208" cy="22" r="1" fill="#fff" className="star star-a" />
                      <circle cx="244" cy="56" r="1.2" fill="#fff" className="star star-b" />
                      <circle cx="62" cy="80" r="1" fill="#fff" className="star star-c" />
                      <circle cx="170" cy="80" r="1.1" fill="#fff" className="star star-a" />
                      <circle cx="118" cy="106" r="1" fill="#fff" className="star star-b" />
                      <circle cx="246" cy="100" r="1.3" fill="#fff" className="star star-c" />
                      <circle cx="22" cy="120" r="0.9" fill="#fff" className="star star-a" />
                      <circle cx="80" cy="156" r="1.1" fill="#fff" className="star star-b" />
                      <circle cx="194" cy="156" r="1" fill="#fff" className="star star-c" />
                      <circle cx="404" cy="32" r="1.3" fill="#fff" className="star star-a" />
                      <circle cx="446" cy="58" r="1" fill="#fff" className="star star-b" />
                      <circle cx="430" cy="98" r="1.2" fill="#fff" className="star star-c" />
                      <circle cx="406" cy="178" r="1" fill="#fff" className="star star-a" />
                      <circle cx="40" cy="200" r="1" fill="#fff" className="star star-b" />
                      <circle cx="138" cy="200" r="1.2" fill="#fff" className="star star-c" />
                    </g>
                  </g>

                  <g className="cloud cloud-1">
                    <ellipse cx="120" cy="80" rx="42" ry="10" fill="#fff" opacity="0.9" />
                    <ellipse cx="140" cy="74" rx="22" ry="8" fill="#fff" opacity="0.9" />
                    <ellipse cx="100" cy="74" rx="18" ry="7" fill="#fff" opacity="0.9" />
                  </g>
                  <g className="cloud cloud-2">
                    <ellipse cx="260" cy="50" rx="34" ry="9" fill="#fff" opacity="0.8" />
                    <ellipse cx="280" cy="44" rx="18" ry="7" fill="#fff" opacity="0.8" />
                  </g>
                  {/* bird silhouette flying across */}
                  <g className="bird">
                    <path
                      d="M0 0 q 4 -4, 8 0 q 4 -4, 8 0"
                      stroke="#0e1a14"
                      strokeWidth="1.4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>

              {/* BUILDING — café storefront with TM-made sign */}
              <div className="float scene-building">
                <svg
                  viewBox="0 0 460 460"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* ground shadow */}
                  <ellipse
                    cx="240"
                    cy="408"
                    rx="160"
                    ry="10"
                    fill="rgba(14,26,20,0.18)"
                  />

                  {/* roof sign posts */}
                  <rect x="186" y="174" width="5" height="38" fill="#3a2812" />
                  <rect x="294" y="174" width="5" height="38" fill="#3a2812" />

                  {/* sign frame (dark) */}
                  <rect
                    x="170"
                    y="158"
                    width="146"
                    height="50"
                    rx="5"
                    fill="#0e1a14"
                  />
                  <rect
                    x="170"
                    y="158"
                    width="146"
                    height="6"
                    rx="3"
                    fill="#1c2a22"
                  />
                  {/* sign inner panel */}
                  <rect
                    x="176"
                    y="166"
                    width="134"
                    height="36"
                    rx="3"
                    fill="#142420"
                    className="sign-glow"
                  />
                  {/* sign tiny lights (corners of panel) */}
                  <circle
                    cx="184"
                    cy="184"
                    r="2"
                    fill="#ffd97a"
                    className="bulb bulb-1"
                  />
                  <circle
                    cx="302"
                    cy="184"
                    r="2"
                    fill="#ffd97a"
                    className="bulb bulb-2"
                  />
                  {/* sign brand mark (small logo) */}
                  <clipPath id="tm-sign-logo-clip">
                    <circle cx="202" cy="184" r="7" />
                  </clipPath>
                  <image
                    href="https://github.com/DrianeDiojanPerez/tech_monkey_v3/blob/master/public/logo.jpg?raw=true"
                    x="195"
                    y="177"
                    width="14"
                    height="14"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#tm-sign-logo-clip)"
                  />
                  {/* sign text */}
                  <text
                    x="214"
                    y="190"
                    fontFamily="Instrument Serif"
                    fontStyle="italic"
                    fontSize="15"
                    fill="#dbeae1"
                  >
                    Tech Monkeys
                  </text>

                  {/* building body */}
                  <rect
                    x="138"
                    y="208"
                    width="204"
                    height="194"
                    fill="url(#tm-wall)"
                  />
                  {/* top trim */}
                  <rect x="138" y="208" width="204" height="4" fill="#cdc0a0" />
                  {/* bottom trim */}
                  <rect x="138" y="398" width="204" height="4" fill="#a89a78" />
                  {/* wall shadow stripe (sun side opposite) */}
                  <rect
                    x="138"
                    y="208"
                    width="14"
                    height="194"
                    fill="rgba(14,26,20,0.05)"
                  />

                  {/* awning (green & cream stripes) */}
                  <rect x="132" y="214" width="216" height="24" fill="#0f5132" />
                  {/* awning scallop edge */}
                  <path
                    d="M132 238 L 144 256 L 156 238 L 168 256 L 180 238 L 192 256 L 204 238 L 216 256 L 228 238 L 240 256 L 252 238 L 264 256 L 276 238 L 288 256 L 300 238 L 312 256 L 324 238 L 336 256 L 348 238 Z"
                    fill="#0f5132"
                  />
                  {/* awning cream vertical stripes */}
                  <rect x="148" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  <rect x="184" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  <rect x="220" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  <rect x="256" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  <rect x="292" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  <rect x="328" y="214" width="6" height="24" fill="#f1e6d2" opacity="0.65" />
                  {/* awning shadow under */}
                  <rect x="138" y="256" width="204" height="4" fill="rgba(0,0,0,0.18)" />

                  {/* window */}
                  <rect x="158" y="276" width="86" height="86" fill="#3a2812" />
                  <rect
                    x="164"
                    y="282"
                    width="74"
                    height="74"
                    fill="url(#tm-window)"
                    className="window-glow"
                  />
                  <line
                    x1="201"
                    y1="276"
                    x2="201"
                    y2="362"
                    stroke="#3a2812"
                    strokeWidth="3"
                  />
                  <line
                    x1="158"
                    y1="319"
                    x2="244"
                    y2="319"
                    stroke="#3a2812"
                    strokeWidth="3"
                  />
                  {/* OPEN chip in window */}
                  <rect
                    x="170"
                    y="328"
                    width="44"
                    height="14"
                    rx="2"
                    fill="#e26a2c"
                  />
                  <text
                    x="192"
                    y="338"
                    fontFamily="Geist Mono, monospace"
                    fontSize="9"
                    fontWeight="600"
                    fill="#fff"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    OPEN
                  </text>
                  {/* tiny silhouette inside (a barista) */}
                  <circle cx="218" cy="304" r="6" fill="#3a2812" opacity="0.5" />
                  <rect
                    x="212"
                    y="310"
                    width="12"
                    height="10"
                    fill="#3a2812"
                    opacity="0.5"
                  />

                  {/* door */}
                  <rect
                    x="262"
                    y="280"
                    width="60"
                    height="118"
                    fill="url(#tm-wood-warm)"
                  />
                  <rect x="266" y="284" width="52" height="56" fill="#7a5230" />
                  <rect x="266" y="346" width="52" height="48" fill="#5e3e22" />
                  <circle cx="312" cy="342" r="2.5" fill="#ffd97a" />
                  {/* door number plate */}
                  <text
                    x="292"
                    y="274"
                    fontFamily="Instrument Serif"
                    fontStyle="italic"
                    fontSize="13"
                    fill="#5e3e22"
                    textAnchor="middle"
                  >
                    № 14
                  </text>

                  {/* hanging plant near door */}
                  <g>
                    <line
                      x1="245"
                      y1="262"
                      x2="245"
                      y2="278"
                      stroke="#3a2812"
                      strokeWidth="1"
                    />
                    <ellipse cx="245" cy="284" rx="8" ry="4" fill="#5e3e22" />
                    <path
                      d="M240 282 Q 236 274, 240 270"
                      stroke="#0f5132"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M245 282 Q 246 270, 252 268"
                      stroke="#0f5132"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M250 283 Q 256 278, 254 272"
                      stroke="#0f5132"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </g>

                  {/* "by Tech Monkeys" tiny credit on wall */}
                  <text
                    x="338"
                    y="392"
                    fontFamily="Geist Mono, monospace"
                    fontSize="6.5"
                    fill="#a89a78"
                    textAnchor="end"
                    letterSpacing="1"
                  >
                    SIGN BY TECH MONKEYS
                  </text>
                </svg>
              </div>

              {/* FOREGROUND — palm tree + sand */}
              <div className="float scene-fg">
                <svg
                  viewBox="0 0 460 460"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* palm trunk */}
                  <path
                    d="M 64 408 Q 54 320, 60 240 Q 64 190, 76 154"
                    stroke="#5e3e22"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* trunk rings */}
                  <line x1="58" y1="220" x2="68" y2="220" stroke="#3a2812" strokeWidth="1.5" opacity="0.6" />
                  <line x1="56" y1="260" x2="66" y2="260" stroke="#3a2812" strokeWidth="1.5" opacity="0.6" />
                  <line x1="54" y1="300" x2="64" y2="300" stroke="#3a2812" strokeWidth="1.5" opacity="0.6" />
                  <line x1="52" y1="340" x2="62" y2="340" stroke="#3a2812" strokeWidth="1.5" opacity="0.6" />
                  <line x1="50" y1="378" x2="60" y2="378" stroke="#3a2812" strokeWidth="1.5" opacity="0.6" />

                  {/* coconut */}
                  <circle cx="80" cy="158" r="6" fill="#3a2812" />
                  <g className="coconut-fall">
                    <ellipse cx="88" cy="164" rx="5" ry="5.5" fill="#3a2812" />
                    <circle cx="86" cy="162.5" r="0.9" fill="#1a0a02" />
                    <ellipse
                      cx="86.5"
                      cy="163"
                      rx="1.4"
                      ry="0.7"
                      fill="#5a4a32"
                      opacity="0.55"
                    />
                  </g>

                  {/* palm fronds */}
                  <g className="palm">
                    {/* upper left */}
                    <g>
                      <path
                        d="M76 154 Q 30 124, 4 100"
                        stroke="#0a3a24"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M52 130 L 46 124" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                      <path d="M40 116 L 32 112" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                      <path d="M28 108 L 18 106" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* mid left */}
                    <g>
                      <path
                        d="M76 154 Q 40 158, 0 156"
                        stroke="#0f5132"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M44 156 L 38 162" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                      <path d="M28 155 L 22 162" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* upper right */}
                    <g>
                      <path
                        d="M76 154 Q 110 120, 152 102"
                        stroke="#0a3a24"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M100 134 L 106 128" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                      <path d="M120 122 L 128 118" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                      <path d="M140 110 L 148 108" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* mid right */}
                    <g>
                      <path
                        d="M76 154 Q 116 156, 156 162"
                        stroke="#0f5132"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M112 158 L 116 164" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                      <path d="M134 160 L 140 168" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* upper */}
                    <g>
                      <path
                        d="M76 154 Q 92 110, 102 70"
                        stroke="#0a3a24"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M90 116 L 96 110" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                      <path d="M96 92 L 102 88" stroke="#0a3a24" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* up-left */}
                    <g>
                      <path
                        d="M76 154 Q 52 116, 42 78"
                        stroke="#0f5132"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path d="M58 120 L 52 116" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                      <path d="M48 96 L 42 92" stroke="#0f5132" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </g>

                </svg>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="row">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>
              <span className="m-ico">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="section-eyebrow">01 — Services</div>
              <h2 className="h2">
                A full kit for{" "}
                <span className="italic">every Belizean business.</span>
              </h2>
            </div>
            <div />
            <div className="svc-controls">
              <button
                className="svc-btn"
                aria-label="Previous"
                onClick={() => scrollSvc(-1)}
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="svc-btn"
                aria-label="Next"
                onClick={() => scrollSvc(1)}
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="svc-strip">
            <div className="svc-track" ref={trackRef}>
              <article className="svc-card c-banner reveal">
                <div className="copy">
                  Indoor and outdoor banner printing — any size, weather-rated
                  vinyl, finished in 24h.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="20"
                    y="200"
                    width="240"
                    height="120"
                    fill="#fff"
                    stroke="#0f5132"
                    strokeWidth="2"
                  />
                  <text
                    x="40"
                    y="250"
                    fontFamily="Instrument Serif"
                    fontSize="42"
                    fill="#0f5132"
                    fontStyle="italic"
                  >
                    Grand
                  </text>
                  <text
                    x="40"
                    y="290"
                    fontFamily="Instrument Serif"
                    fontSize="42"
                    fill="#e26a2c"
                    fontStyle="italic"
                  >
                    Opening
                  </text>
                  <circle cx="40" cy="200" r="6" fill="#e26a2c" />
                  <circle cx="240" cy="200" r="6" fill="#e26a2c" />
                  <circle cx="40" cy="320" r="6" fill="#e26a2c" />
                  <circle cx="240" cy="320" r="6" fill="#e26a2c" />
                </svg>
                <div className="tag">
                  Banner printing
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>

              <article className="svc-card c-sticker reveal d1">
                <div className="copy">
                  Glossy, matte and die-cut stickers. Decals, vinyl labels and
                  mug prints — built to last 3+ years outdoors.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <circle cx="80" cy="280" r="50" fill="#e26a2c" />
                  <circle
                    cx="80"
                    cy="280"
                    r="50"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <circle cx="180" cy="220" r="40" fill="#d8c34a" />
                  <circle
                    cx="180"
                    cy="220"
                    r="40"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <circle cx="220" cy="340" r="30" fill="#7fb593" />
                  <circle
                    cx="220"
                    cy="340"
                    r="30"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
                <div className="tag">
                  Stickers &amp; decals
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>

              <article className="svc-card c-decal reveal d2">
                <div className="copy">
                  Storefront vinyl, wall graphics and window decals — installed
                  by our crew.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="30"
                    y="180"
                    width="220"
                    height="200"
                    fill="#fff"
                    stroke="#9a4a18"
                    strokeWidth="2"
                  />
                  <rect
                    x="30"
                    y="180"
                    width="220"
                    height="40"
                    fill="#9a4a18"
                  />
                  <text
                    x="50"
                    y="208"
                    fontFamily="Instrument Serif"
                    fontStyle="italic"
                    fontSize="22"
                    fill="#fff"
                  >
                    Cafe del Mar
                  </text>
                  <rect
                    x="60"
                    y="240"
                    width="60"
                    height="80"
                    fill="#f1e1cf"
                  />
                  <rect
                    x="160"
                    y="240"
                    width="60"
                    height="80"
                    fill="#f1e1cf"
                  />
                  <circle cx="90" cy="280" r="10" fill="#9a4a18" />
                  <circle cx="190" cy="280" r="10" fill="#9a4a18" />
                </svg>
                <div className="tag">
                  Storefront decals
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>

              <article className="svc-card c-wrap reveal d3">
                <div className="copy">
                  Full and partial vehicle wraps. Turn your fleet into a moving
                  billboard across Belize.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="20"
                    y="240"
                    width="240"
                    height="90"
                    rx="10"
                    fill="#fff"
                  />
                  <rect
                    x="40"
                    y="220"
                    width="200"
                    height="50"
                    rx="14"
                    fill="#fff"
                  />
                  <clipPath id="tm-wrap-logo-clip">
                    <circle cx="140" cy="280" r="32" />
                  </clipPath>
                  <image
                    href="https://github.com/DrianeDiojanPerez/tech_monkey_v3/blob/master/public/logo.jpg?raw=true"
                    x="108"
                    y="248"
                    width="64"
                    height="64"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#tm-wrap-logo-clip)"
                  />
                  <circle cx="80" cy="340" r="22" fill="#1c2a22" />
                  <circle cx="80" cy="340" r="8" fill="#fff" />
                  <circle cx="220" cy="340" r="22" fill="#1c2a22" />
                  <circle cx="220" cy="340" r="8" fill="#fff" />
                </svg>
                <div className="tag">
                  Vehicle wraps
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>

              <article className="svc-card c-it reveal d4">
                <div className="copy">
                  Computer repair, virus removal, wired and wireless networks —
                  keeping your office online.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="40"
                    y="200"
                    width="200"
                    height="130"
                    rx="8"
                    fill="#fff"
                    stroke="#0f4d44"
                    strokeWidth="2"
                  />
                  <rect
                    x="55"
                    y="215"
                    width="170"
                    height="90"
                    fill="#0e1a14"
                  />
                  <rect x="65" y="225" width="40" height="2" fill="#7fb593" />
                  <rect x="65" y="235" width="60" height="2" fill="#7fb593" />
                  <rect x="65" y="245" width="80" height="2" fill="#dbeae1" />
                  <rect x="65" y="255" width="100" height="2" fill="#e26a2c" />
                  <rect x="65" y="265" width="50" height="2" fill="#7fb593" />
                  <rect
                    x="100"
                    y="330"
                    width="80"
                    height="6"
                    fill="#0e1a14"
                  />
                </svg>
                <div className="tag">
                  IT services
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>

              <article className="svc-card c-pos reveal d4">
                <div className="copy">
                  POS hardware, receipt printers and inventory systems — set up
                  for restaurants and retail.
                </div>
                <svg
                  className="svc-art"
                  viewBox="0 0 280 420"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="60"
                    y="200"
                    width="160"
                    height="120"
                    rx="8"
                    fill="#fff"
                    stroke="#7a1e36"
                    strokeWidth="2"
                  />
                  <rect
                    x="75"
                    y="215"
                    width="130"
                    height="60"
                    fill="#7a1e36"
                  />
                  <text
                    x="90"
                    y="252"
                    fontFamily="Geist Mono"
                    fontSize="22"
                    fill="#fff"
                  >
                    $ 84.20
                  </text>
                  <rect
                    x="75"
                    y="285"
                    width="38"
                    height="22"
                    rx="4"
                    fill="#7a1e36"
                  />
                  <rect
                    x="121"
                    y="285"
                    width="38"
                    height="22"
                    rx="4"
                    fill="#7a1e36"
                  />
                  <rect
                    x="167"
                    y="285"
                    width="38"
                    height="22"
                    rx="4"
                    fill="#e26a2c"
                  />
                  <rect
                    x="100"
                    y="320"
                    width="80"
                    height="40"
                    fill="#fff"
                    stroke="#7a1e36"
                  />
                </svg>
                <div className="tag">
                  Point of sale
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="showcase reveal">
            <div className="showcase-grid">
              <div>
                <div className="show-meta">02 — Featured project</div>
                <h3 className="show-title">
                  A 40-ft billboard for the{" "}
                  <span
                    className="serif"
                    style={{ fontStyle: "italic", color: "var(--green)" }}
                  >
                    Northern Highway.
                  </span>
                </h3>
                <p className="show-body">
                  Designed, printed and installed in 9 days. Weather-rated 13oz
                  vinyl, mounted on a steel structure visible from 400 m. The
                  client booked four more locations before the first one came
                  down.
                </p>
                <div className="show-stats">
                  <div>
                    <b>9 days</b>
                    <span>From brief to install</span>
                  </div>
                  <div>
                    <b>40 ft</b>
                    <span>Width on highway</span>
                  </div>
                  <div>
                    <b>+38%</b>
                    <span>Foot traffic, month 1</span>
                  </div>
                </div>
              </div>
              <div className="show-art" aria-hidden="true">
                <div className="post1" />
                <div className="post2" />
                <div className="billboard">
                  <img src="https://github.com/DrianeDiojanPerez/tech_monkey_v3/blob/master/public/logo.jpg?raw=true" alt="" className="billboard-logo" />
                </div>
                <div className="road" />
                <div className="stripe" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS / order block */}
      <section id="process">
        <div className="wrap">
          <div className="biz-wrap">
            <div className="reveal">
              <div className="section-eyebrow">03 — Process</div>
              <h2 className="h2" style={{ marginTop: 6 }}>
                Built for{" "}
                <span className="italic">small business owners,</span> not
                designers.
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  maxWidth: "46ch",
                  margin: "18px 0 24px",
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                Send a sketch, a photo, or just a description. We handle the
                design, proofing, printing and installation — and walk you
                through every step.
              </p>
              <button className="tm-btn tm-btn-green" type="button">
                Start an order <span className="arrow">→</span>
              </button>
            </div>
            <div className="reveal d1">
              <div className="order-card">
                <span className="c"># tech-monkeys/order.txt</span>
                {"\n"}
                <span className="k">client</span>:{" "}
                <span className="v">"Cafe del Mar"</span>
                {"\n"}
                <span className="k">project</span>:{" "}
                <span className="v">"Storefront refresh"</span>
                {"\n"}
                <span className="k">items</span>:{"\n"}
                {"  - "}
                <span className="s">banner</span> · 8 × 3 ft · vinyl{"\n"}
                {"  - "}
                <span className="s">decals</span> · window × 6{"\n"}
                {"  - "}
                <span className="s">menu</span> · A2 laminated × 4{"\n"}
                <span className="k">install</span>:{" "}
                <span className="v">"on-site"</span>
                {"\n"}
                <span className="k">turnaround</span>: <span className="v">48h</span>
                {"\n"}
                <span className="k">status</span>:{" "}
                <span className="v">{blinkOn ? "printing ▍" : "printing  "}</span>
              </div>
              <div className="chips">
                <span className="chip dark" style={{ left: 0, top: 0 }}>
                  &lt;Banners /&gt;
                </span>
                <span className="chip" style={{ left: 160, top: 10 }}>
                  return &lt;Signage /&gt;
                </span>
                <span className="chip mauve" style={{ left: 0, top: 60 }}>
                  import {"{Vinyl}"}
                </span>
                <span className="chip orange" style={{ left: 200, top: 80 }}>
                  Install()
                </span>
                <span className="chip cream" style={{ left: 60, top: 120 }}>
                  export {"{POS}"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="section-eyebrow">04 — Why Tech Monkeys</div>
              <h2 className="h2">
                Faster, sharper,{" "}
                <span className="italic">all under one roof.</span>
              </h2>
            </div>
          </div>
          <div className="feat-grid">
            <div className="feat reveal">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12l4-4 4 4 6-6 4 4" />
                  <path d="M3 18h18" />
                </svg>
              </div>
              <h3>One vendor, everything</h3>
              <p>
                Signs, print and IT in a single shop. No more juggling three
                suppliers — or three invoices.
              </p>
            </div>
            <div className="feat reveal d1">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <h3>48-hour turnaround</h3>
              <p>
                Most banner and sticker jobs are out the door in two business
                days. Rush jobs welcome.
              </p>
            </div>
            <div className="feat reveal d2">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z" />
                </svg>
              </div>
              <h3>Built in Belize</h3>
              <p>
                Local team that understands the climate, the regulations and
                the timelines that actually matter here.
              </p>
            </div>
            <div className="feat reveal">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <h3>POS &amp; networking</h3>
              <p>
                Get your retail floor running — POS hardware, Wi-Fi,
                surveillance and on-call support.
              </p>
            </div>
            <div className="feat reveal d1">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 17l6-6 4 4 6-6" />
                  <path d="M14 9h6v6" />
                </svg>
              </div>
              <h3>Grow-with-you pricing</h3>
              <p>
                Volume discounts kick in early. Repeat clients lock in pricing
                for a full calendar year.
              </p>
            </div>
            <div className="feat reveal d2">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
                </svg>
              </div>
              <h3>3-year outdoor warranty</h3>
              <p>
                Premium vinyl and UV inks — your signage holds up to Belize
                sun, rain and salt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "40px 24px 100px" }}>
        <div className="wrap">
          <div className="cta reveal">
            <h2>
              Let&apos;s build something{" "}
              <span className="italic">people will actually look at.</span>
            </h2>
            <p>
              Tell us about your business. We&apos;ll send back ideas, a quote
              and a timeline within one working day.
            </p>
            <button
              className="tm-btn tm-btn-green"
              style={{ position: "relative" }}
              type="button"
            >
              Start a project <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tm-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              Tech<span className="italic"> Monkeys.</span>
            </div>
            <p
              style={{
                color: "rgba(246,241,231,.7)",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: "32ch",
                margin: 0,
              }}
            >
              A full-service signs, printing and IT shop based in Belize City.
              Big ideas, printed beautifully — since 2012.
            </p>
          </div>
          <div>
            <h4>Print</h4>
            <ul>
              <li>
                <a href="#">Banners</a>
              </li>
              <li>
                <a href="#">Stickers &amp; decals</a>
              </li>
              <li>
                <a href="#">Vehicle wraps</a>
              </li>
              <li>
                <a href="#">Apparel</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Tech</h4>
            <ul>
              <li>
                <a href="#">POS systems</a>
              </li>
              <li>
                <a href="#">Networking</a>
              </li>
              <li>
                <a href="#">Surveillance</a>
              </li>
              <li>
                <a href="#">Computer repair</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li>
                <a href="#">Our work</a>
              </li>
              <li>
                <a href="#">Process</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li>Belize City, BZ</li>
              <li>Mon–Fri · 8:30–17:30</li>
              <li>
                <a href="mailto:hello@techmonkeys.bz">hello@techmonkeys.bz</a>
              </li>
              <li>+501 ⋅ 000 ⋅ 0000</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Tech Monkeys Belize · All rights reserved</span>
          <span>Designed &amp; built in Belize 🇧🇿</span>
        </div>
      </footer>
    </div>
  )
}
