"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { EduNexusLogo } from "./edunexus-logo"

/*
  Splash animation:
  Phase 1 (0-1.8s)  – Logo + title large and centered, glass card behind, subtle tagline fades in
  Phase 2 (1.8-3s)  – Logo shrinks and moves to the exact position it occupies on the login page
  Phase 3 (3s+)     – Overlay fades out revealing the real login page beneath
*/

const TAGLINE_WORDS = ["Unified", "AI-Powered", "Knowledge", "Search"]

export function InitAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Phase 1 -> Phase 2: start shrink after 1.8s
    const t1 = setTimeout(() => setPhase(2), 1800)
    // Phase 2 -> Phase 3: begin fade-out after 3s
    const t2 = setTimeout(() => setPhase(3), 3000)
    // Hide overlay after fade completes
    const t3 = setTimeout(() => setVisible(false), 3600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background bg-grid overflow-hidden"
        >
          {/* Background glow orbs – same as login page */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

          {/* Subtle radial pulse behind logo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: phase === 1 ? 420 : 200,
              height: phase === 1 ? 420 : 200,
              opacity: phase >= 3 ? 0 : 0.08,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            }}
          />

          {/* Animated glass card behind the logo */}
          <motion.div
            className="absolute glass-strong rounded-3xl"
            initial={{ width: 280, height: 180, opacity: 0, scale: 0.9 }}
            animate={{
              width: phase === 1 ? 320 : 0,
              height: phase === 1 ? 200 : 0,
              opacity: phase === 1 ? 1 : 0,
              scale: phase === 1 ? 1 : 0.7,
            }}
            transition={{
              duration: phase === 1 ? 0.7 : 0.5,
              ease: "easeInOut",
            }}
            style={{ boxShadow: "0 0 60px oklch(0.55 0.20 220 / 0.12)" }}
          />

          {/* Logo + Title – animates from center-large to login-page position */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 1, y: 0 }}
            animate={{
              scale: phase >= 2 ? 0.65 : 1,
              y: phase >= 2 ? -120 : 0,
              opacity: phase >= 3 ? 0 : 1,
            }}
            transition={{
              duration: phase >= 2 ? 0.9 : 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Logo icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-4"
            >
              <div className="relative">
                {/* Glow ring behind logo */}
                <motion.div
                  className="absolute -inset-3 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 1 ? [0, 0.5, 0.3] : 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(circle, oklch(0.55 0.20 220 / 0.2) 0%, transparent 70%)",
                  }}
                />
                <EduNexusLogo size={72} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              EduNexus
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-sm text-muted-foreground mt-2 tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : -4 }}
              transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            >
              Smart Campus
            </motion.p>

            {/* Animated tagline words */}
            <motion.div
              className="flex items-center gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 1 ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {TAGLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.15, ease: "easeOut" }}
                >
                  {word}
                  {i < TAGLINE_WORDS.length - 1 && (
                    <span className="ml-2 text-primary/40">{"/"}</span>
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* Progress dots */}
            <motion.div
              className="flex items-center gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 1 ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-primary/40"
                  initial={{ width: 6 }}
                  animate={{
                    width: [6, 20, 6],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.8 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom tagline that fades in */}
          <motion.p
            className="absolute bottom-8 text-xs text-muted-foreground/50 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 1 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Initializing Campus Knowledge Engine
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
