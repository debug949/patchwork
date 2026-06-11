"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Globe, ArrowRight } from "lucide-react"
import { AboutSection } from "./AboutSection"
import { FeaturedVideoSection } from "./FeaturedVideoSection"
import { PhilosophySection } from "./PhilosophySection"
import { ServicesSection } from "./ServicesSection"

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"

interface Props { isLoggedIn: boolean }

export function LandingClient({ isLoggedIn }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingRef = useRef(false)
  const rafIdRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const animate = (from: number, to: number, ms: number, done?: () => void) => {
      cancelAnimationFrame(rafIdRef.current)
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / ms, 1)
        video.style.opacity = String(from + (to - from) * p)
        if (p < 1) rafIdRef.current = requestAnimationFrame(tick)
        else done?.()
      }
      rafIdRef.current = requestAnimationFrame(tick)
    }

    const onCanPlay = () => {
      void video.play()
      animate(0, 1, 500)
    }

    const onTimeUpdate = () => {
      if (!fadingRef.current && video.duration && video.duration - video.currentTime <= 0.55) {
        fadingRef.current = true
        animate(parseFloat(video.style.opacity) || 1, 0, 500)
      }
    }

    const onEnded = () => {
      video.style.opacity = "0"
      setTimeout(() => {
        fadingRef.current = false
        video.currentTime = 0
        void video.play()
        animate(0, 1, 500)
      }, 100)
    }

    video.addEventListener("canplay", onCanPlay)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("ended", onEnded)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      video.removeEventListener("canplay", onCanPlay)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("ended", onEnded)
    }
  }, [])

  return (
    <div className="bg-black">
      {/* ── SECTION 1: HERO ── */}
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Background video */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          preload="auto"
          style={{ opacity: 0, filter: "blur(14px) brightness(0.38) scale(1.06)" }}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          onMouseEnter={undefined}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* subtle gradient to ground the content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Navbar */}
        <div className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg ml-2" style={{ fontFamily: "var(--font-poppins, sans-serif)" }}>
                patchwork
              </span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                {["Features", "Pricing", "About"].map((link) => (
                  <a key={link} href="#" className="text-white/80 hover:text-white text-sm font-medium transition-colors" style={{ fontFamily: "var(--font-poppins, sans-serif)" }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="flex items-center gap-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="text-white text-sm font-medium"
                style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
              >
                {isLoggedIn ? "Dashboard" : "Sign in"}
              </Link>
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
                style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
              >
                {isLoggedIn ? "Open app" : "Get started"}
              </Link>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <p
            className="text-white/40 text-xs tracking-[0.18em] uppercase mb-8"
            style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
          >
            AI-powered changelogs
          </p>

          <h1
            className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05 }}
          >
            Document it <em className="italic">all.</em>
          </h1>

          <p
            className="text-white/40 text-sm leading-relaxed mt-7 max-w-xs"
            style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
          >
            Connect GitHub. Ship changelogs your users will actually read.
          </p>

          <div className="flex items-center gap-3 mt-10">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex items-center gap-2 bg-white text-black rounded-full px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
            >
              {isLoggedIn ? "Open dashboard" : "Get started"}
              <ArrowRight size={16} />
            </Link>
            {!isLoggedIn && (
              <Link
                href="/demo"
                className="flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors"
                style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
              >
                Live demo ↗
              </Link>
            )}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center pb-10">
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>

      {/* ── SECTIONS 2–5 ── */}
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  )
}
