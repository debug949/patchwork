"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const SERVICES_VIDEO_1 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
const SERVICES_VIDEO_2 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"

const SERVICES = [
  {
    video: SERVICES_VIDEO_1,
    tag: "Strategy",
    title: "GitHub Integration",
    description:
      "We connect directly to your repositories via OAuth 2.0, fetching your full commit history to surface the insights that matter most to your users.",
  },
  {
    video: SERVICES_VIDEO_2,
    tag: "Craft",
    title: "AI Changelog Writing",
    description:
      "From raw commits to polished release notes, our AI obsesses over every detail to deliver changelogs that feel effortless and read extraordinarily.",
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]">
          <motion.div
            className="flex items-end justify-between mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-3xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              What we do
            </h2>
            <span
              className="text-white/40 text-sm hidden md:block"
              style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
            >
              Our services
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                className="liquid-glass rounded-3xl overflow-hidden group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              >
                {/* Video */}
                <div className="aspect-video overflow-hidden relative">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-white/40 text-xs tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
                    >
                      {service.tag}
                    </span>
                    <div className="liquid-glass rounded-full p-2">
                      <ArrowUpRight size={16} className="text-white" />
                    </div>
                  </div>
                  <h3
                    className="text-white text-xl md:text-2xl mb-3 tracking-tight"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-white/50 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-poppins, sans-serif)" }}
                  >
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
