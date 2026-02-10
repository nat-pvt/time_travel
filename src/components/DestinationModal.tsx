"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Destination } from "./DestinationCard";

// ─── Props ───────────────────────────────────────────────────────────
interface DestinationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  onBookClick: (destinationId: string) => void;
}

// ─── Icônes SVG inline ───────────────────────────────────────────────
function IconThermometer({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9V3m0 0a2 2 0 10-4 0v9.354a4 4 0 106.166 3.242A4.001 4.001 0 0016 12.354V3a2 2 0 10-4 0zm0 0v6" />
    </svg>
  );
}

function IconLanguage({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

function IconCurrency({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
    </svg>
  );
}

// ─── Barre de danger ─────────────────────────────────────────────────
function DangerBar({ level, label }: { level: number; label: string }) {
  const colors = [
    "bg-green-400",
    "bg-lime-400",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-red-500",
  ];
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-28 shrink-0">Risque temporel</span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i < level ? colors[level - 1] : "bg-dark-border"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${level >= 4 ? "text-red-400" : level >= 3 ? "text-orange-400" : "text-green-400"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────
export default function DestinationModal({
  destination,
  isOpen,
  onClose,
  onBookClick,
}: DestinationModalProps) {
  if (!destination) return null;

  const { details } = destination;

  const infoItems = [
    { icon: IconThermometer, label: "Climat", value: details.climate },
    { icon: IconLanguage, label: "Langue", value: details.language },
    { icon: IconCurrency, label: "Monnaie", value: details.currency },
    { icon: IconClock, label: "Durée", value: details.duration },
    { icon: IconUsers, label: "Groupe max.", value: details.groupSize },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />

          {/* ── Modal plein écran ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl mx-4 my-8 md:my-12 rounded-3xl overflow-hidden border border-dark-border shadow-2xl shadow-black/60 bg-dark-card"
            >
              {/* ── Header image ─────────────────────────────────── */}
              <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark/50 to-transparent" />

                {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white hover:border-gold/40 transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2 z-10">
                  <div className="px-3 py-1.5 glass rounded-full">
                    <span className="text-gold text-xs font-medium">{destination.epoch}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gold/20 backdrop-blur-sm rounded-full">
                    <span className="text-gold text-xs font-bold">{destination.price}</span>
                  </div>
                </div>

                {/* Titre sur l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gold/60 text-xs tracking-[0.25em] uppercase mb-2"
                  >
                    Expédition temporelle
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold"
                  >
                    <span className="text-gold-gradient">{destination.expeditionName}</span>
                  </motion.h2>
                </div>
              </div>

              {/* ── Contenu ──────────────────────────────────────── */}
              <div className="p-6 md:p-10 space-y-8">
                {/* Jauge de danger */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <DangerBar level={destination.dangerLevel} label={destination.danger} />
                </motion.div>

                {/* Description complète */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {details.fullDescription}
                  </p>
                </motion.div>

                {/* ── Informations Pratiques ──────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Informations Pratiques
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {infoItems.map((item) => (
                      <div
                        key={item.label}
                        className="glass rounded-xl p-4 flex items-start gap-3 hover:border-gold/25 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-gold" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                          <p className="text-sm text-white font-medium">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Points forts ────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Points Forts de l&apos;Expédition
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gold/5 border border-gold/10">
                        <IconStar className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-200">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Protocole de Sécurité ───────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                      <IconShield className="w-5 h-5 text-red-400" />
                      Protocole de Sécurité Temporelle
                    </h3>
                  </div>

                  <div className="glass rounded-2xl p-5 md:p-6 space-y-4">
                    {/* Protocoles */}
                    <div className="space-y-3">
                      {details.securityProtocols.map((protocol, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-gold text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed">{protocol}</p>
                        </div>
                      ))}
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-dark-border" />

                    {/* Règles de survie */}
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-red-400/70 mb-3 font-semibold">
                        Règles de survie temporelle
                      </p>
                      <div className="space-y-2">
                        {details.survivalRules.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-red-400 text-sm mt-0.5">⚠</span>
                            <p className="text-sm text-gray-300 italic">{rule}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── CTA Réservation ─────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-dark-border"
                >
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-white font-semibold text-lg">
                      Prêt à voyager vers {destination.title} ?
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {destination.price} — Formation pré-départ incluse
                    </p>
                  </div>
                  <motion.button
                    onClick={() => onBookClick(destination.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 text-sm"
                  >
                    Réserver ce voyage
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
