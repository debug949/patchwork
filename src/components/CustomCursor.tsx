"use client"

import { useEffect, useRef } from "react"

// Patchwork cursor — soft blue editorial dot + ring matching the Bloom changelog theme
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(pointer: coarse)").matches) return

    document.body.style.cursor = "none"

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number

    const DOT_R = 3   // half of 6px
    const RING_R = 14 // half of 28px

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onEnter = () => { hoverRef.current = true }
    const onLeave = () => { hoverRef.current = false }

    const attachListeners = () => {
      document.querySelectorAll<Element>("a, button, [role='button'], input, textarea, select, label")
        .forEach(el => {
          el.addEventListener("mouseenter", onEnter)
          el.addEventListener("mouseleave", onLeave)
        })
    }

    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })
    attachListeners()

    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      ringX = lerp(ringX, mouseX, 0.11)
      ringY = lerp(ringY, mouseY, 0.11)

      const isHover = hoverRef.current

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - DOT_R}px, ${mouseY - DOT_R}px) scale(${isHover ? 0 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - RING_R}px, ${ringY - RING_R}px) scale(${isHover ? 1.5 : 1})`
        ringRef.current.style.opacity = isHover ? "0.5" : "1"
        ringRef.current.style.background = isHover ? "rgba(88,166,255,0.12)" : "transparent"
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
      {/* Blue dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#58a6ff",
          boxShadow: "0 0 5px rgba(88,166,255,0.5)",
          pointerEvents: "none",
          zIndex: 999999,
          willChange: "transform",
          transition: "transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />
      {/* Blue ring — trails */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(88,166,255,0.5)",
          pointerEvents: "none",
          zIndex: 999998,
          willChange: "transform",
          transition: "opacity 0.25s, background 0.2s",
        }}
      />
    </>
  )
}
