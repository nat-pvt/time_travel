"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background vidéo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/40 to-dark" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4"
        >
          TimeTravel Agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-gold-gradient">L&apos;Histoire</span>
          <br />
          <span className="text-white">vous attend</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-300 text-base md:text-lg max-w-2xl mb-10"
        >
          Vivez des moments uniques à travers les époques les plus fascinantes
          de l&apos;humanité. Votre aventure temporelle commence ici.
        </motion.p>

        <motion.a
          href="#destinations"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 border-2 border-gold text-gold font-semibold rounded-full overflow-hidden transition-all duration-500 hover:text-dark"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-gold to-gold-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <span className="relative flex items-center gap-2">
            Explorer les époques
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </motion.a>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center"
          >
            <motion.div className="w-1.5 h-1.5 bg-gold rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
