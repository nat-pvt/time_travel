"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Données FAQ ─────────────────────────────────────────────────────
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

const faqItems: FAQItem[] = [
  {
    id: "paradoxe",
    question: "Que se passe-t-il en cas de paradoxe temporel ?",
    icon: "🌀",
    answer:
      "Le paradoxe temporel est le risque le plus surveillé par nos équipes. " +
      "Chaque voyageur est équipé d'un Stabilisateur de Causalité Quantique (SCQ), un dispositif implanté temporairement dans votre poignet " +
      "qui maintient votre signature temporelle intacte. Si un événement paradoxal est détecté — par exemple, une interaction " +
      "qui pourrait altérer la chaîne causale — le SCQ déclenche une extraction immédiate en 4,7 secondes. " +
      "Depuis la création de l'agence, nous avons géré 3 alertes de niveau jaune et aucune de niveau rouge. " +
      "Notre taux de résolution est de 100 %. Le temps se protège mieux qu'on ne le croit, " +
      "et nous avons appris à travailler avec lui, jamais contre lui. " +
      "Une formation de 3 jours pré-départ couvre tous les scénarios possibles.",
  },
  {
    id: "trex",
    question: "L'assurance couvre-t-elle les morsures de T-Rex ?",
    icon: "🦖",
    answer:
      "Question légitime — et plus fréquente qu'on ne l'imagine. " +
      "Oui, notre Assurance Paradoxe Temporel Premium (incluse dans tout forfait Crétacé) couvre intégralement : " +
      "les blessures causées par la mégafaune, les chocs atmosphériques liés à la composition de l'air du Mésozoïque, " +
      "les allergies aux pollens préhistoriques, et même le stress post-temporel. " +
      "Cependant, soyons clairs : aucune morsure n'a jamais été enregistrée. " +
      "Notre dôme d'invisibilité et les combinaisons exosquelettiques en titane rendent tout contact physique avec un prédateur " +
      "statistiquement impossible. La question n'est pas « serez-vous mordu ? » mais « à quelle distance oserez-vous observer ? ». " +
      "Notre record actuel : 12 mètres d'un Tyrannosaure en chasse. Frissons garantis, crocs à distance.",
  },
  {
    id: "souvenirs",
    question: "Puis-je ramener des souvenirs de mon voyage temporel ?",
    icon: "🎁",
    answer:
      "C'est l'une des questions les plus sensibles du voyage temporel. " +
      "La réponse courte : des souvenirs oui, des objets physiques non. " +
      "Le Protocole de Non-Extraction Matérielle (PNEM) interdit formellement de prélever tout objet, " +
      "organisme ou matière d'une époque visitée. Même un grain de sable du Crétacé pourrait théoriquement " +
      "perturber la chaîne géologique sur 68 millions d'années. " +
      "En revanche, vous repartirez avec des souvenirs bien réels : " +
      "un journal de bord numérique enregistré par votre implant rétinien (photos haute résolution et vidéo immersive 360°), " +
      "un certificat d'expédition holographique signé par votre chrononaute, " +
      "et surtout, des souvenirs gravés dans votre mémoire que le temps lui-même ne pourra effacer. " +
      "Nos voyageurs disent souvent que c'est le cadeau le plus précieux qu'ils aient jamais reçu.",
  },
];

// ─── Item accordéon ──────────────────────────────────────────────────
function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-gold/30 bg-gold/[0.03] shadow-lg shadow-gold/5"
          : "border-dark-border bg-dark-card hover:border-dark-border/80"
      }`}
    >
      {/* Question (bouton) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 md:p-6 text-left group"
      >
        {/* Icône */}
        <span className="text-2xl shrink-0">{item.icon}</span>

        {/* Texte */}
        <span
          className={`flex-1 font-semibold text-sm md:text-base transition-colors duration-300 ${
            isOpen ? "text-gold" : "text-white group-hover:text-gold/80"
          }`}
        >
          {item.question}
        </span>

        {/* Chevron animé */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
            isOpen
              ? "bg-gold/20 text-gold"
              : "bg-dark-elevated text-gray-400 group-hover:text-gold/60"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Réponse (accordéon) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem] md:pl-[4.75rem]">
              <div className="w-12 h-0.5 bg-gradient-to-r from-gold/40 to-transparent mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────
export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-32 px-4 relative">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* En-tête */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Questions fréquentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Les mystères du temps,{" "}
            <span className="text-gold-gradient">dévoilés</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
          />
        </div>

        {/* Accordéon */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={index}
            />
          ))}
        </div>

        {/* Note de bas */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-xs mt-8"
        >
          D&apos;autres questions ? L&apos;Agent Chronos est disponible 24h/24 via le chat.
        </motion.p>
      </div>
    </section>
  );
}
