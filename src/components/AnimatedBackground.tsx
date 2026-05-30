"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#050508]"
        aria-hidden
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050508]">
      <motion.div
        className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 42% 38% at 28% 32%, rgba(34, 211, 238, 0.35), transparent 55%),
            radial-gradient(ellipse 45% 40% at 72% 38%, rgba(167, 139, 250, 0.32), transparent 55%),
            radial-gradient(ellipse 50% 45% at 48% 78%, rgba(244, 114, 182, 0.22), transparent 60%)
          `,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background: `
            radial-gradient(circle 520px at 20% 20%, rgba(99, 102, 241, 0.12), transparent),
            radial-gradient(circle 480px at 85% 75%, rgba(34, 211, 238, 0.1), transparent)
          `,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.6, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.45) 100%)",
        }}
        animate={{ opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
