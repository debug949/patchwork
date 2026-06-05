"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, color: "#fff" }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    title: "GitHub OAuth",
    desc: "Raw OAuth 2.0 — CSRF protected, encrypted sessions.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: "#fff" }}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "AI Categorization",
    desc: "Commits sorted into features, fixes, refactors, and breaking changes.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: "#fff" }}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Public Pages",
    desc: "Every changelog gets a shareable URL at /log/owner/repo.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: "#fff" }}>
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Embed Widget",
    desc: "One iframe tag shows your live changelog anywhere.",
  },
]

const blurIn = { filter: "blur(10px)", opacity: 0, y: 20 } as const
const blurOut = { filter: "blur(0px)", opacity: 1, y: 0 } as const

interface Props { isLoggedIn: boolean }

export function LandingClient({ isLoggedIn }: Props) {
  return (
    <div style={{ background: "#000", minHeight: "100dvh", position: "relative" }}>
      {/* Video background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <video autoPlay muted loop playsInline preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* Two-panel layout */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100dvh", display: "flex" }}>

        {/* LEFT PANEL */}
        <div style={{ width: "100%", maxWidth: "52%", position: "relative", padding: "20px" }}>
          <div className="liquid-glass-strong" style={{ position: "absolute", inset: "20px", borderRadius: 28, display: "flex", flexDirection: "column", padding: "28px 32px" }}>

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: "#fff" }}>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-poppins,sans-serif)", fontWeight: 600, fontSize: 17, color: "#fff", letterSpacing: "-0.03em" }}>patchwork</span>
              </div>
              <div className="liquid-glass" style={{ borderRadius: 9999, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-poppins,sans-serif)" }}>Menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, color: "rgba(255,255,255,0.65)" }}>
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
            </div>

            {/* Hero */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 0" }}>
              <motion.div initial={blurIn} animate={blurOut} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} style={{ marginBottom: 22 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, color: "#fff" }}>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
              </motion.div>

              <motion.h1
                initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
                style={{ fontFamily: "var(--font-poppins,sans-serif)", fontWeight: 500, fontSize: "clamp(28px,4vw,48px)", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em", margin: "0 0 14px" }}>
                Generate changelogs{" "}
                <em style={{ fontFamily: "var(--font-source-serif,serif)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
                  your users love.
                </em>
              </motion.h1>

              <motion.p
                initial={blurIn} animate={blurOut} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 300, lineHeight: 1.65, marginBottom: 28, maxWidth: 360 }}>
                Connect a GitHub repository. Patchwork fetches your commits and generates a categorized changelog — ready to share or embed anywhere.
              </motion.p>

              <motion.div initial={blurIn} animate={blurOut} transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}>
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="liquid-glass-strong"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 9999, padding: "11px 22px", fontSize: 13, fontWeight: 500, color: "#fff", textDecoration: "none", fontFamily: "var(--font-poppins,sans-serif)" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  {isLoggedIn ? "Go to Dashboard" : "Connect GitHub"}
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18 }}>
                {["AI Categorization", "GitHub OAuth", "Public Pages", "Embeddable"].map((pill) => (
                  <div key={pill} className="liquid-glass" style={{ borderRadius: 9999, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-poppins,sans-serif)" }}>{pill}</div>
                ))}
              </motion.div>
            </div>

            {/* Bottom quote */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-poppins,sans-serif)" }}>Visionary Design</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-source-serif,serif)", fontStyle: "italic", margin: 0 }}>&ldquo;Every commit tells a story.&rdquo;</p>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL — desktop only via CSS */}
        <div className="pw-right-panel" style={{ display: "none", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "28px 28px 28px 8px" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="liquid-glass" style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 9999, padding: "8px 10px" }}>
              <a href="https://github.com/debug949/patchwork" target="_blank" rel="noopener noreferrer"
                style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="liquid-glass" style={{ borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", marginBottom: 4, fontFamily: "var(--font-poppins,sans-serif)" }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, fontWeight: 300, fontFamily: "var(--font-poppins,sans-serif)" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .pw-right-panel { display: flex !important; } }
        @media (max-width: 1023px) { [style*="max-width: 52%"] { max-width: 100% !important; } }
      `}</style>
    </div>
  )
}
