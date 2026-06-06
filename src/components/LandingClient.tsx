"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Globe, ArrowRight, Music2, Send } from "lucide-react"
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
          style={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

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
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1
            className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Document it <em className="italic">all.</em>
          </h1>

          {/* Email input */}
          <div className="max-w-xl w-full mt-10">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
                style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
              />
              <button className="bg-white rounded-full p-3 text-black flex-shrink-0">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <p
            className="text-white text-sm leading-relaxed px-4 mt-6 max-w-md"
            style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
          >
            Connect your GitHub repositories and let Patchwork generate beautiful, AI-powered changelogs your users will actually read.
          </p>

          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-6"
            style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
          >
            Start for free
          </Link>
        </div>

        {/* Social icons */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          {[Music2, Send, Globe].map((Icon, i) => (
            <button
              key={i}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon size={20} />
            </button>
          ))}
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
