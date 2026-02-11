"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────
type DestinationId = "paris-1889" | "cretace" | "florence-1504";

interface QuizOption {
  id: string;
  label: string;
  icon: string;
  scores: Record<DestinationId, number>;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

interface QuizAnswer {
  questionId: string;
  answerId: string;
  label: string;
  scores: Record<DestinationId, number>;
}

interface QuizResult {
  destination: DestinationId;
  label: string;
  recommendation: string;
  fromAPI: boolean;
  scores: Record<DestinationId, number>;
}

// ─── Données du quiz ─────────────────────────────────────────────────
const QUESTIONS: QuizQuestion[] = [
  {
    id: "passion",
    question: "Qu'est-ce qui vous passionne le plus ?",
    subtitle: "Votre centre d'intérêt principal guidera votre voyage",
    options: [
      {
        id: "art",
        label: "L'art et la créativité humaine",
        icon: "🎨",
        scores: { "paris-1889": 1, cretace: 0, "florence-1504": 3 },
      },
      {
        id: "nature",
        label: "La nature et les grands espaces",
        icon: "🌿",
        scores: { "paris-1889": 0, cretace: 3, "florence-1504": 0 },
      },
      {
        id: "innovation",
        label: "La science et l'innovation",
        icon: "⚡",
        scores: { "paris-1889": 3, cretace: 1, "florence-1504": 1 },
      },
      {
        id: "culture",
        label: "La gastronomie et l'art de vivre",
        icon: "🍷",
        scores: { "paris-1889": 2, cretace: 0, "florence-1504": 2 },
      },
    ],
  },
  {
    id: "risk",
    question: "Quel est votre rapport au risque ?",
    subtitle: "Chaque époque a son niveau de danger temporel",
    options: [
      {
        id: "safe",
        label: "Je préfère le confort et l'élégance",
        icon: "🛡️",
        scores: { "paris-1889": 3, cretace: 0, "florence-1504": 2 },
      },
      {
        id: "moderate",
        label: "Un peu de frisson, mais encadré",
        icon: "⚖️",
        scores: { "paris-1889": 1, cretace: 1, "florence-1504": 3 },
      },
      {
        id: "extreme",
        label: "L'adrénaline, c'est ma raison de vivre",
        icon: "🔥",
        scores: { "paris-1889": 0, cretace: 3, "florence-1504": 0 },
      },
    ],
  },
  {
    id: "dream",
    question: "Que rêvez-vous de voir de vos propres yeux ?",
    subtitle: "Le moment qui justifierait à lui seul le voyage",
    options: [
      {
        id: "monument",
        label: "Un monument mythique en construction",
        icon: "🗼",
        scores: { "paris-1889": 3, cretace: 0, "florence-1504": 1 },
      },
      {
        id: "creature",
        label: "Des créatures disparues depuis des millions d'années",
        icon: "🦖",
        scores: { "paris-1889": 0, cretace: 3, "florence-1504": 0 },
      },
      {
        id: "genius",
        label: "Un génie au travail dans son atelier",
        icon: "🖌️",
        scores: { "paris-1889": 1, cretace: 0, "florence-1504": 3 },
      },
      {
        id: "event",
        label: "Un événement historique majeur",
        icon: "📜",
        scores: { "paris-1889": 2, cretace: 1, "florence-1504": 2 },
      },
    ],
  },
  {
    id: "vibe",
    question: "Quelle ambiance vous attire le plus ?",
    subtitle: "L'atmosphère qui vous fera sentir à votre place",
    options: [
      {
        id: "festive",
        label: "Festive et lumineuse — une ville en fête",
        icon: "✨",
        scores: { "paris-1889": 3, cretace: 0, "florence-1504": 1 },
      },
      {
        id: "raw",
        label: "Sauvage et primitive — un monde sans humains",
        icon: "🌋",
        scores: { "paris-1889": 0, cretace: 3, "florence-1504": 0 },
      },
      {
        id: "refined",
        label: "Raffinée et politique — cours et palais",
        icon: "👑",
        scores: { "paris-1889": 1, cretace: 0, "florence-1504": 3 },
      },
    ],
  },
];

const DESTINATION_META: Record<DestinationId, { label: string; image: string; color: string }> = {
  "paris-1889": { label: "Paris 1889", image: "/images/paris.jpg", color: "from-amber-500/20 to-yellow-500/20" },
  cretace: { label: "Crétacé", image: "/images/cretace.png", color: "from-green-500/20 to-emerald-500/20" },
  "florence-1504": { label: "Florence 1504", image: "/images/renaissance.png", color: "from-red-500/20 to-orange-500/20" },
};

// ─── Props ───────────────────────────────────────────────────────────
interface TimeQuizProps {
  onBookClick: (destinationId: string) => void;
}

// ─── Composant principal ─────────────────────────────────────────────
export default function TimeQuiz({ onBookClick }: TimeQuizProps) {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Calcul des scores
  const calculateScores = useCallback((allAnswers: QuizAnswer[]): Record<DestinationId, number> => {
    const scores: Record<DestinationId, number> = {
      "paris-1889": 0,
      cretace: 0,
      "florence-1504": 0,
    };
    for (const answer of allAnswers) {
      scores["paris-1889"] += answer.scores["paris-1889"];
      scores.cretace += answer.scores.cretace;
      scores["florence-1504"] += answer.scores["florence-1504"];
    }
    return scores;
  }, []);

  // Déterminer le gagnant
  const getWinner = useCallback((scores: Record<DestinationId, number>): DestinationId => {
    const entries = Object.entries(scores) as [DestinationId, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }, []);

  // Soumettre et obtenir la recommandation IA
  const submitQuiz = useCallback(
    async (allAnswers: QuizAnswer[]) => {
      setLoading(true);

      const scores = calculateScores(allAnswers);
      const winner = getWinner(scores);
      const winnerLabel = DESTINATION_META[winner].label;

      try {
        interface QuizAPIResponse {
          destination?: DestinationId;
          recommendation: string;
          fromAPI: boolean;
        }

        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: allAnswers.map((a) => ({
              questionId: a.questionId,
              answerId: a.answerId,
              label: a.label,
            })),
            scores,
            winner,
            winnerLabel,
          }),
        });

        const data = (await response.json()) as QuizAPIResponse;
        const destination: DestinationId = data.destination ?? winner;

        setResult({
          destination,
          label: DESTINATION_META[destination].label,
          recommendation: data.recommendation,
          fromAPI: data.fromAPI,
          scores,
        });
      } catch {
        // Fallback complet
        setResult({
          destination: winner,
          label: winnerLabel,
          recommendation:
            `Nos archives temporelles pointent vers ${winnerLabel} comme votre destination idéale. ` +
            "Cliquez sur « Réserver » pour préparer votre expédition.",
          fromAPI: false,
          scores,
        });
      }

      setLoading(false);
    },
    [calculateScores, getWinner]
  );

  // Sélection d'une réponse
  const handleAnswer = useCallback(
    (option: QuizOption) => {
      const question = QUESTIONS[currentStep];
      const newAnswer: QuizAnswer = {
        questionId: question.id,
        answerId: option.id,
        label: option.label,
        scores: option.scores,
      };

      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);

      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        submitQuiz(newAnswers);
      }
    },
    [currentStep, answers, submitQuiz]
  );

  // Reset
  const handleReset = () => {
    setStarted(false);
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
    setLoading(false);
  };

  const progress = ((currentStep + (result ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <section id="quiz" className="py-20 md:py-32 px-4 relative">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* ── En-tête de section ─────────────────────────────── */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Recommandation personnalisée
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Trouvez votre{" "}
            <span className="text-gold-gradient">époque idéale</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
          />
        </div>

        {/* ── Contenu du quiz ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {/* ── État initial : invitation ──────────────────── */}
            {!started && !result && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🧭</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  Quelle époque est faite pour vous ?
                </h3>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                  Répondez à 4 questions rapides et notre algorithme temporel,
                  assisté par l&apos;IA de Chronos, déterminera votre destination idéale.
                </p>
                <motion.button
                  onClick={() => setStarted(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all"
                >
                  Commencer le quiz
                </motion.button>
              </motion.div>
            )}

            {/* ── Questions ──────────────────────────────────── */}
            {started && !result && !loading && (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="p-6 md:p-10"
              >
                {/* Barre de progression */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs text-gray-500">
                    {currentStep + 1}/{QUESTIONS.length}
                  </span>
                  <div className="flex-1 h-1.5 bg-dark-elevated rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                      initial={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  {QUESTIONS[currentStep].question}
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  {QUESTIONS[currentStep].subtitle}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {QUESTIONS[currentStep].options.map((option, i) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleAnswer(option)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-elevated hover:border-gold/30 hover:bg-gold/[0.03] transition-all duration-200 text-left group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {option.icon}
                      </span>
                      <span className="text-sm md:text-base text-gray-200 group-hover:text-white transition-colors">
                        {option.label}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-600 group-hover:text-gold ml-auto shrink-0 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Chargement IA ───────────────────────────────── */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 md:p-16 text-center"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-gold/20"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border-2 border-gold/30"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold-light" />
                  </motion.div>
                  <div className="absolute inset-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-xl">🧭</span>
                  </div>
                </div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-gold font-semibold"
                >
                  Chronos analyse votre profil temporel...
                </motion.p>
                <p className="text-gray-500 text-xs mt-2">
                  Consultation des archives de toutes les époques
                </p>
              </motion.div>
            )}

            {/* ── Résultat ────────────────────────────────────── */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Image de la destination */}
                <div
                  className={`relative h-40 md:h-52 bg-gradient-to-br ${DESTINATION_META[result.destination].color} overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-40">
                    <Image
                      src={DESTINATION_META[result.destination].image}
                      alt={DESTINATION_META[result.destination].label}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 relative">
                    <p className="text-gold/60 text-xs tracking-[0.2em] uppercase mb-1">
                      Votre destination idéale
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gold-gradient">
                      {result.label}
                    </h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Barres de score */}
                  <div className="space-y-2.5">
                    {(Object.entries(result.scores) as [DestinationId, number][])
                      .sort((a, b) => b[1] - a[1])
                      .map(([destId, score]) => {
                        const maxScore = Math.max(...Object.values(result.scores));
                        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                        const isWinner = destId === result.destination;
                        return (
                          <div key={destId} className="flex items-center gap-3">
                            <span className={`text-xs w-24 shrink-0 ${isWinner ? "text-gold font-semibold" : "text-gray-500"}`}>
                              {DESTINATION_META[destId].label}
                            </span>
                            <div className="flex-1 h-2 bg-dark-elevated rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`h-full rounded-full ${
                                  isWinner
                                    ? "bg-gradient-to-r from-gold to-gold-light"
                                    : "bg-dark-border"
                                }`}
                              />
                            </div>
                            <span className={`text-xs w-6 text-right ${isWinner ? "text-gold font-bold" : "text-gray-500"}`}>
                              {score}
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Recommandation IA */}
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">⏳</span>
                      <span className="text-xs font-semibold text-gold">
                        Recommandation de Chronos
                      </span>
                      {result.fromAPI && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                          IA
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed italic">
                      &ldquo;{result.recommendation}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => onBookClick(result.destination)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all text-sm"
                    >
                      Réserver {result.label}
                    </motion.button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3.5 border border-dark-border text-gray-300 font-medium rounded-xl hover:border-gold/30 hover:text-white transition-all text-sm"
                    >
                      Recommencer le quiz
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
