"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDestination?: string;
}

type BookingStep = "form" | "confirming" | "confirmed";

// ─── Données ─────────────────────────────────────────────────────────
const destinations = [
  { value: "paris-1889", label: "Paris 1889 — Exposition Universelle", year: 1889 },
  { value: "cretace", label: "Crétacé — -68 000 000", year: -68000000 },
  { value: "florence-1504", label: "Florence 1504 — Renaissance", year: 1504 },
];

const travelClasses = [
  {
    value: "eco",
    label: "Éco",
    description: "Observation à distance sécurisée",
    price: "×1",
    color: "text-gray-300",
    border: "border-dark-border",
    bg: "bg-dark-elevated",
  },
  {
    value: "business",
    label: "Business",
    description: "Immersion guidée + accès privilégié",
    price: "×2.5",
    color: "text-blue-300",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
  },
  {
    value: "chronos-first",
    label: "Chronos First",
    description: "Immersion totale + interactions encadrées",
    price: "×5",
    color: "text-gold",
    border: "border-gold/30",
    bg: "bg-gold/5",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function formatTemporalYear(year: string): string {
  const num = parseInt(year);
  if (isNaN(num)) return "";
  if (num < 0) return `${Math.abs(num).toLocaleString("fr-FR")} av. J.-C.`;
  return `${num} ap. J.-C.`;
}

function getTemporalYearForDestination(destinationId: string): string {
  const dest = destinations.find((d) => d.value === destinationId);
  return dest ? dest.year.toString() : "";
}

// ─── Composant principal ─────────────────────────────────────────────
export default function BookingModal({
  isOpen,
  onClose,
  preselectedDestination,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    destination: "",
    temporalYear: "",
    departureDate: "",
    travelers: 1,
    travelClass: "eco",
    name: "",
    email: "",
  });
  const [step, setStep] = useState<BookingStep>("form");

  const resetForm = useCallback(() => {
    setFormData({
      destination: "",
      temporalYear: "",
      departureDate: "",
      travelers: 1,
      travelClass: "eco",
      name: "",
      email: "",
    });
    setStep("form");
  }, []);

  // Pré-remplir la destination et la date temporelle
  useEffect(() => {
    if (preselectedDestination && isOpen) {
      const year = getTemporalYearForDestination(preselectedDestination);
      setFormData((prev) => ({
        ...prev,
        destination: preselectedDestination,
        temporalYear: year,
      }));
    }
  }, [preselectedDestination, isOpen]);

  // Synchroniser la date temporelle quand la destination change
  const handleDestinationChange = (destinationId: string) => {
    const year = getTemporalYearForDestination(destinationId);
    setFormData((prev) => ({
      ...prev,
      destination: destinationId,
      temporalYear: year,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Réservation soumise :", formData);

    // Phase 1 : Animation de chargement
    setStep("confirming");

    // Phase 2 : Confirmation après 2.5s
    setTimeout(() => {
      setStep("confirmed");
    }, 2500);

    // Phase 3 : Fermeture après 5s au total
    setTimeout(() => {
      onClose();
      // Reset après la fermeture
      setTimeout(resetForm, 300);
    }, 5500);
  };

  const selectedClass = travelClasses.find((c) => c.value === formData.travelClass);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === "form" ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg my-8 bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-2xl">
              {/* ── Header ────────────────────────────────────────── */}
              <div className="px-6 py-5 bg-gradient-to-r from-gold/10 to-transparent border-b border-dark-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Réserver votre voyage
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Configurez votre expédition temporelle
                  </p>
                </div>
                {step === "form" && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-gold/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* ── Formulaire ─────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {step === "form" && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                  >
                    {/* Nom & Email — ligne compacte */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                          placeholder="jean@exemple.fr"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
                        Destination temporelle
                      </label>
                      <select
                        id="destination"
                        required
                        value={formData.destination}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Sélectionnez une époque...
                        </option>
                        {destinations.map((dest) => (
                          <option key={dest.value} value={dest.value}>
                            {dest.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date temporelle + Date de départ + Voyageurs */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Année temporelle (accepte négatif) */}
                      <div>
                        <label htmlFor="temporalYear" className="block text-sm font-medium text-gray-300 mb-2">
                          Année cible
                        </label>
                        <div className="relative">
                          <input
                            id="temporalYear"
                            type="number"
                            required
                            value={formData.temporalYear}
                            onChange={(e) =>
                              setFormData({ ...formData, temporalYear: e.target.value })
                            }
                            className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                            placeholder="-68000000"
                          />
                        </div>
                        {formData.temporalYear && (
                          <p className="text-[10px] text-gold/60 mt-1 truncate">
                            {formatTemporalYear(formData.temporalYear)}
                          </p>
                        )}
                      </div>

                      {/* Date de départ (réel) */}
                      <div>
                        <label htmlFor="departureDate" className="block text-sm font-medium text-gray-300 mb-2">
                          Départ réel
                        </label>
                        <input
                          id="departureDate"
                          type="date"
                          required
                          value={formData.departureDate}
                          onChange={(e) =>
                            setFormData({ ...formData, departureDate: e.target.value })
                          }
                          className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
                        />
                      </div>

                      {/* Voyageurs */}
                      <div>
                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-300 mb-2">
                          Voyageurs
                        </label>
                        <input
                          id="travelers"
                          type="number"
                          min={1}
                          max={6}
                          required
                          value={formData.travelers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              travelers: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full bg-dark-elevated border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Classe de voyage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Classe de voyage
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {travelClasses.map((cls) => {
                          const isSelected = formData.travelClass === cls.value;
                          return (
                            <button
                              key={cls.value}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, travelClass: cls.value })
                              }
                              className={`relative p-3 rounded-xl border text-left transition-all duration-300 ${
                                isSelected
                                  ? `${cls.border} ${cls.bg} shadow-md`
                                  : "border-dark-border bg-dark-elevated hover:border-dark-border/80"
                              }`}
                            >
                              {/* Indicateur de sélection */}
                              {isSelected && (
                                <motion.div
                                  layoutId="class-indicator"
                                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold"
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                              <p
                                className={`text-sm font-semibold mb-0.5 ${
                                  isSelected ? cls.color : "text-gray-300"
                                }`}
                              >
                                {cls.label}
                              </p>
                              <p className="text-[10px] text-gray-500 leading-tight mb-1.5">
                                {cls.description}
                              </p>
                              <p
                                className={`text-xs font-bold ${
                                  isSelected ? cls.color : "text-gray-400"
                                }`}
                              >
                                {cls.price}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Résumé tarif */}
                    {formData.destination && selectedClass && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="glass rounded-xl p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs text-gray-400">Estimation tarifaire</p>
                          <p className="text-sm text-white font-medium">
                            {destinations.find((d) => d.value === formData.destination)?.label}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Classe {selectedClass.label}</p>
                          <p className="text-sm text-gold font-bold">
                            Multiplicateur {selectedClass.price}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Bouton de soumission */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300"
                    >
                      Confirmer la réservation
                    </motion.button>

                    <p className="text-xs text-gray-500 text-center">
                      En confirmant, vous acceptez les Conditions Générales de
                      Voyage Temporel et les risques de paradoxe associés.
                    </p>
                  </motion.form>
                )}

                {/* ── Animation de traitement ──────────────────────── */}
                {step === "confirming" && (
                  <motion.div
                    key="confirming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 md:p-16 flex flex-col items-center justify-center"
                  >
                    {/* Horloge animée */}
                    <div className="relative w-24 h-24 mb-8">
                      {/* Cercle extérieur */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-gold/20"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
                      </motion.div>
                      {/* Cercle intérieur */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 rounded-full border-2 border-gold/30"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold-light" />
                      </motion.div>
                      {/* Centre pulsant */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-7 rounded-full bg-gold/20 flex items-center justify-center"
                      >
                        <span className="text-2xl">⏳</span>
                      </motion.div>
                    </div>

                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-gold font-semibold text-center"
                    >
                      Synchronisation temporelle en cours...
                    </motion.p>
                    <p className="text-gray-500 text-xs text-center mt-2">
                      Calibration du flux quantique
                    </p>
                  </motion.div>
                )}

                {/* ── Confirmation finale ───────────────────────────── */}
                {step === "confirmed" && (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="p-12 md:p-16 flex flex-col items-center justify-center"
                  >
                    {/* Cercle de succès animé */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                      className="relative w-20 h-20 mb-6"
                    >
                      {/* Halo doré */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="absolute inset-0 rounded-full bg-gold/20"
                      />
                      {/* Cercle principal */}
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30">
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                          className="w-10 h-10 text-dark"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                          />
                        </motion.svg>
                      </div>
                    </motion.div>

                    {/* Texte principal */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold text-center mb-2"
                    >
                      <span className="text-gold-gradient">Voyage validé !</span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 }}
                      className="text-white font-medium text-center text-lg mb-4"
                    >
                      Préparez votre départ
                    </motion.p>

                    {/* Détails du voyage */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="glass rounded-xl p-4 w-full max-w-xs space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Destination</span>
                        <span className="text-white font-medium">
                          {destinations.find((d) => d.value === formData.destination)?.label.split(" — ")[0] || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Époque</span>
                        <span className="text-gold font-medium">
                          {formData.temporalYear ? formatTemporalYear(formData.temporalYear) : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Classe</span>
                        <span className="text-white font-medium">
                          {selectedClass?.label || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Voyageurs</span>
                        <span className="text-white font-medium">{formData.travelers}</span>
                      </div>
                    </motion.div>

                    {/* Message final */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-gray-500 text-xs text-center mt-5"
                    >
                      Rendez-vous au Chronoport Central. Votre chrononaute vous contactera sous 24h.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
