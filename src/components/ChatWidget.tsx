"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  displayedContent?: string;
  isStreaming?: boolean;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  message: string;
  icon: string;
}

interface APIResponse {
  response?: string;
  error?: string;
  message?: string;
  fallback?: boolean;
}

// ─── Quick Replies ───────────────────────────────────────────────────
const QUICK_REPLIES: QuickReply[] = [
  {
    label: "Vêtements pour 1504 ?",
    message: "Quels vêtements pour Florence 1504 ?",
    icon: "👗",
  },
  {
    label: "Sécurité au Crétacé ?",
    message: "Quels sont les protocoles de sécurité au Crétacé ?",
    icon: "🛡️",
  },
  {
    label: "Que voir en 1889 ?",
    message: "Que voir à Paris en 1889 ?",
    icon: "🗼",
  },
];

// ─── Réponses de fallback (quand l'API n'est pas configurée) ─────────
// Conservées pour garantir un fonctionnement même sans clé API.
interface KnowledgeEntry {
  keywords: string[];
  response: string;
  priority: number;
}

const FALLBACK_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["vêtement", "vetement", "habit", "tenue", "porter", "costume", "1504", "pourpoint"],
    response:
      "Ah, Florence en 1504... une époque où le vêtement était un langage à part entière. " +
      "Pour les hommes, un pourpoint de velours sombre, des chausses ajustées et une beretta — le couvre-chef des érudits — seront de rigueur. " +
      "Pour les femmes, une gamurra à manches bouffantes, cintrée à la taille, dans des tons de cramoisi ou d'azur. " +
      "Notre atelier de costumerie vous préparera un trousseau complet avant le départ.",
    priority: 10,
  },
  {
    keywords: ["florence", "renaissance", "médicis", "medicis", "vinci", "michel-ange"],
    response:
      "Florence, 1504. L'air vibre encore de l'énergie créatrice qui a changé le monde. " +
      "Vous marcherez dans les mêmes rues que Léonard de Vinci et Michel-Ange — ce dernier achève justement son David cette année-là. " +
      "Niveau de risque : Modéré. Les intrigues politiques des Médicis peuvent être... imprévisibles.",
    priority: 5,
  },
  {
    keywords: ["sécurité", "securite", "danger", "risque", "protection", "crétacé", "cretace", "survie"],
    response:
      "Le Crétacé supérieur, il y a 68 millions d'années... un monde aussi majestueux que mortel. " +
      "Nos protocoles : combinaison exosquelettique titane, champ de force personnel (3 mètres), " +
      "dôme d'invisibilité (500 mètres), balise d'extraction (4,7 secondes). " +
      "Les T-Rex ont un champ de vision basé sur le mouvement. Si l'alarme retentit : immobilité absolue.",
    priority: 10,
  },
  {
    keywords: ["dinosaure", "t-rex", "triceratops"],
    response:
      "Vous observerez des Tricératops paître dans les plaines de magnolias, des Ptéranodons fendre le ciel primordial, " +
      "et peut-être un Tyrannosaure dans toute sa terrifiante majesté. " +
      "Vous verrez ce qu'aucun être humain n'était censé voir. C'est le privilège ultime du voyageur temporel.",
    priority: 5,
  },
  {
    keywords: ["voir", "visite", "1889", "exposition", "paris", "eiffel", "tour"],
    response:
      "Paris, 1889. Vous assisterez à l'inauguration de la Tour Eiffel, " +
      "visiterez la Galerie des Machines, les premières démonstrations d'électricité. " +
      "Flânez sur les Grands Boulevards, assistez à un spectacle au Moulin Rouge. " +
      "Le tout baigné dans la lumière dorée de la Belle Époque.",
    priority: 10,
  },
  {
    keywords: ["prix", "tarif", "coût", "cout", "combien", "budget"],
    response:
      "Paris 1889 : à partir de 12 500 €. Florence 1504 : à partir de 18 000 €. Crétacé : à partir de 45 000 €. " +
      "Tous les forfaits incluent l'assurance paradoxe temporel, l'équipement d'époque et le guide chrononaute.",
    priority: 8,
  },
  {
    keywords: ["réserver", "reserver", "réservation", "reservation"],
    response:
      "Cliquez sur le bouton doré « Réserver » dans la barre de navigation. " +
      "Vous choisirez votre époque, votre date de départ et le nombre de voyageurs. " +
      "Notre équipe du Chronoport Central vous contactera sous 24h.",
    priority: 8,
  },
  {
    keywords: ["paradoxe", "changer", "modifier", "histoire", "passé"],
    response:
      "Notre technologie repose sur la « Bulle d'Observation » : vous vivrez l'Histoire sans la réécrire. " +
      "L'effet papillon est réel, c'est pourquoi chaque geste est encadré. " +
      "C'est la promesse fondatrice de TimeTravel Agency.",
    priority: 7,
  },
  {
    keywords: ["machine", "technologie", "comment", "fonctionne", "quantique"],
    response:
      "Distorsion Quantique Contrôlée. Le transfert dure exactement 7 secondes. " +
      "Un léger vertige, une sensation de lumière dorée, puis le monde autour de vous sera... différent. " +
      "Le retour est garanti. Vous ne serez jamais perdu dans le temps.",
    priority: 7,
  },
  {
    keywords: ["bonjour", "salut", "hello", "hey", "coucou"],
    response:
      "Salutations, voyageur. Je suis Chronos, gardien des timelines. " +
      "Quelle époque fait battre votre cœur ? Paris 1889 ? Le Crétacé ? Florence 1504 ?",
    priority: 3,
  },
  {
    keywords: ["merci", "super", "génial", "parfait"],
    response:
      "C'est un honneur de vous guider à travers les méandres du temps. " +
      "Le temps est le plus grand des voyages. Et vous êtes sur le point de le vivre.",
    priority: 2,
  },
  {
    keywords: ["qui es-tu", "qui es tu", "ton nom", "chronos"],
    response:
      "Je suis Chronos — nommé d'après le titan primordial qui personnifie le Temps. " +
      "Expert en voyage temporel et votre guide personnel chez TimeTravel Agency. " +
      "Le temps est ma spécialité... et ma demeure.",
    priority: 6,
  },
];

const FALLBACK_DEFAULTS = [
  "Fascinante question, voyageur. Je peux vous orienter vers nos trois destinations : Paris 1889, le Crétacé ou Florence 1504. Laquelle éveille votre curiosité ?",
  "Le temps recèle bien des mystères. Puis-je vous renseigner sur nos destinations, nos tarifs ou nos protocoles de sécurité ?",
  "N'hésitez pas à me questionner sur nos voyages vers Paris 1889, Florence 1504 ou le Crétacé. Là, mes connaissances sont infinies.",
];

function getFallbackResponse(userMessage: string): string {
  const normalized = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of FALLBACK_KNOWLEDGE) {
    let matchCount = 0;
    for (const keyword of entry.keywords) {
      const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(normalizedKeyword)) matchCount++;
    }
    if (matchCount > 0) {
      const score = matchCount * entry.priority;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
  }

  return bestMatch?.response || FALLBACK_DEFAULTS[Math.floor(Math.random() * FALLBACK_DEFAULTS.length)];
}

// ─── Appel API ───────────────────────────────────────────────────────
async function fetchChronosResponse(
  message: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<{ content: string; fromAPI: boolean }> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    const data: APIResponse = await response.json();

    // Réponse IA réussie
    if (data.response && !data.fallback && !data.error) {
      return { content: data.response, fromAPI: true };
    }

    // Erreur de rate limit — message explicite pour l'utilisateur
    if (data.error === "RATE_LIMIT") {
      return {
        content:
          "Le flux temporel est momentanément surchargé — trop de voyageurs consultent les archives en ce moment. " +
          "Veuillez patienter quelques secondes et réessayer. Mes connaissances restent intactes, promis.",
        fromAPI: false,
      };
    }

    // Clé API manquante ou invalide — message clair
    if (data.error === "API_KEY_MISSING" || data.error === "AUTH_ERROR") {
      console.warn("[Chronos] Clé API non configurée, fallback local activé.");
      return { content: getFallbackResponse(message), fromAPI: false };
    }

    // Autre erreur serveur
    if (data.fallback || data.error) {
      console.warn("[Chronos] Fallback activé :", data.message || data.error);
      return { content: getFallbackResponse(message), fromAPI: false };
    }

    return { content: getFallbackResponse(message), fromAPI: false };
  } catch (error) {
    console.warn("[Chronos] Erreur réseau, fallback activé :", error);
    return { content: getFallbackResponse(message), fromAPI: false };
  }
}

// ─── Composant principal ─────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Salutations, voyageur. Je suis Chronos, gardien des timelines et expert en voyage temporel. " +
        "J'ai arpenté mille époques pour mieux vous guider. " +
        "Où souhaitez-vous que le temps vous emmène ?",
      displayedContent:
        "Salutations, voyageur. Je suis Chronos, gardien des timelines et expert en voyage temporel. " +
        "J'ai arpenté mille époques pour mieux vous guider. " +
        "Où souhaitez-vous que le temps vous emmène ?",
      isStreaming: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // ─── Effet de typing lettre par lettre ───────────────────────────
  const streamMessage = useCallback((fullContent: string, messageId: string) => {
    let charIndex = 0;
    const speed = 15;

    setIsStreaming(true);

    const newMsg: Message = {
      id: messageId,
      role: "assistant",
      content: fullContent,
      displayedContent: "",
      isStreaming: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);

    streamIntervalRef.current = setInterval(() => {
      charIndex++;
      const displayed = fullContent.slice(0, charIndex);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                displayedContent: displayed,
                isStreaming: charIndex < fullContent.length,
              }
            : msg
        )
      );

      if (charIndex >= fullContent.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setIsStreaming(false);
      }
    }, speed);
  }, []);

  // ─── Envoi d'un message ──────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isTyping || isStreaming) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        displayedContent: content.trim(),
        isStreaming: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Préparer l'historique pour l'API (uniquement role + content)
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      // Appel à l'API (avec fallback automatique)
      const { content: responseContent } = await fetchChronosResponse(
        content.trim(),
        history
      );

      const responseId = (Date.now() + 1).toString();
      setIsTyping(false);
      streamMessage(responseContent, responseId);
    },
    [isTyping, isStreaming, messages, streamMessage]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.message);
  };

  const isBusy = isTyping || isStreaming;

  return (
    <>
      {/* ── Bouton flottant ─────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-dark flex items-center justify-center shadow-lg shadow-gold/25 transition-all duration-300 ${
          !isOpen ? "pulse-gold" : ""
        }`}
        aria-label="Ouvrir le chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
          </svg>
        )}
      </motion.button>

      {/* ── Fenêtre de chat ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[560px] max-h-[75vh] rounded-2xl overflow-hidden border border-dark-border shadow-2xl shadow-black/50 flex flex-col bg-dark-card"
          >
            {/* ── Header ───────────────────────────────────────── */}
            <div className="px-4 py-3 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-dark-border flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <span className="text-lg">⏳</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-card" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Chronos</h3>
                <p className="text-xs text-gold/60">Expert en voyage temporel</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-400/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 font-medium">En ligne</span>
              </div>
            </div>

            {/* ── Messages ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold-dark/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <span className="text-xs">⏳</span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold/20 text-white rounded-br-sm"
                        : "bg-dark-elevated text-gray-200 rounded-bl-sm border border-dark-border"
                    }`}
                  >
                    {msg.role === "assistant"
                      ? msg.displayedContent || msg.content
                      : msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 align-middle animate-pulse" />
                    )}
                  </motion.div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold-dark/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <span className="text-xs">⏳</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-elevated text-gray-400 px-4 py-3 rounded-2xl rounded-bl-sm border border-dark-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs text-gold/40 italic">
                        Chronos consulte les archives...
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Replies ─────────────────────────────────── */}
            <div className="px-3 pt-2 pb-1 border-t border-dark-border/50 shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => handleQuickReply(reply)}
                    disabled={isBusy}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold/80 bg-gold/5 border border-gold/15 rounded-full hover:bg-gold/15 hover:border-gold/30 hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span>{reply.icon}</span>
                    <span className="whitespace-nowrap">{reply.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Input ────────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-dark-border bg-dark-card shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Interrogez Chronos..."
                  disabled={isBusy}
                  className="flex-1 bg-dark-elevated border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isBusy}
                  className="px-4 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-dark rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/25 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
