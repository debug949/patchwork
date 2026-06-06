"use client"

import { useEffect, useRef } from "react"

// ── Canonical cursor engine ───────────────────────────────────
// Same physics across ShipSafe / Portfolio / Patchwork.
// Only color constants change per site.
// ─────────────────────────────────────────────────────────────

const COLOR        = "#58a6ff"
const COLOR_RGBA   = "88,166,255"  // for rgba() glow values

const DOT_SIZE  = 6
const DOT_R     = DOT_SIZE  / 2
const RING_SIZE = 30
const RING_R    = RING_SIZE / 2
const LERP      = 0.11

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(pointer: coarse)").matches) return

    document.body.style.cursor = "none"

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onEnter = () => { hoverRef.current = true  }
    const onLeave = () => { hoverRef.current = false }

    const attachListeners = () => {
      document.querySelectorAll<Element>(
        "a, button, [role='button'], input, textarea, select, label"
      ).forEach(el => {
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
      })
    }

    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })
    attachListeners()

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, LERP)
      ringY = lerp(ringY, mouseY, LERP)

      const h = hoverRef.current

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouseX - DOT_R}px, ${mouseY - DOT_R}px) scale(${h ? 0 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringX - RING_R}px, ${ringY - RING_R}px) scale(${h ? 1.5 : 1})`
        ringRef.current.style.opacity     = h ? "0.5" : "1"
        ringRef.current.style.borderColor = h
          ? `rgba(${COLOR_RGBA},0.9)`
          : `rgba(${COLOR_RGBA},0.65)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to cursor position */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:     "fixed",
          top: 0, left: 0,
          width:        DOT_SIZE,
          height:       DOT_SIZE,
          borderRadius: "50%",
          background:   COLOR,
          boxShadow:    `0 0 6px rgba(${COLOR_RGBA},0.7)`,
          pointerEvents:"none",
          zIndex:       999999,
          willChange:   "transform",
          transition:   "transform 0.12s cubic-bezier(0.25,0.1,0.25,1)",
        }}
      />
      {/* Ring — trails behind at lerp 0.11 */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:     "fixed",
          top: 0, left: 0,
          width:        RING_SIZE,
          height:       RING_SIZE,
          borderRadius: "50%",
          border:       `1.5px solid rgba(${COLOR_RGBA},0.65)`,
          boxShadow:    `0 0 6px rgba(${COLOR_RGBA},0.2)`,
          pointerEvents:"none",
          zIndex:       999998,
          willChange:   "transform",
          transition:   "opacity 0.25s, border-color 0.15s",
        }}
      />
    </>
  )
}
