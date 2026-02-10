import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ─── System Prompt spécifique au quiz ────────────────────────────────
const QUIZ_SYSTEM_PROMPT = `Tu es Chronos, le conseiller en voyage temporel de TimeTravel Agency.

On vient de faire passer un quiz de personnalité à un client pour déterminer quelle destination temporelle lui correspond le mieux. Tu vas recevoir :
1. La destination recommandée par notre algorithme (Paris 1889, Crétacé, ou Florence 1504)
2. Les réponses du client au quiz (ses préférences)
3. Les scores calculés pour chaque destination

Ton rôle : rédiger une recommandation PERSONNALISÉE et enthousiaste de 4-6 phrases.

Règles :
- Adresse-toi directement au client (vouvoiement)
- Explique POURQUOI cette destination lui correspond en te basant sur SES réponses spécifiques
- Mentionne 2-3 détails concrets de la destination qui collent avec ses préférences
- Termine par une phrase engageante qui donne envie de réserver
- Ton : professionnel, chaleureux, passionné d'histoire
- Ne mentionne PAS les scores ni l'algorithme, parle naturellement
- Si les scores sont serrés, mentionne brièvement la 2e destination comme alternative`;

// ─── Types ───────────────────────────────────────────────────────────
interface QuizAnswer {
  questionId: string;
  answerId: string;
  label: string;
}

interface QuizScores {
  "paris-1889": number;
  cretace: number;
  "florence-1504": number;
}

interface QuizRequestBody {
  answers: QuizAnswer[];
  scores: QuizScores;
  winner: string;
  winnerLabel: string;
}

// ─── Handler OpenAI ──────────────────────────────────────────────────
async function generateWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    max_tokens: 400,
    temperature: 0.85,
  });
  return completion.choices[0]?.message?.content || "";
}

// ─── Handler Gemini ──────────────────────────────────────────────────
async function generateWithGemini(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: QUIZ_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.85 },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Route POST ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AI_API_KEY;
    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

    const body: QuizRequestBody = await request.json();
    const { answers, scores, winner, winnerLabel } = body;

    // Construire le prompt contextuel
    const answersText = answers
      .map((a) => `- ${a.label}`)
      .join("\n");

    const scoresText = Object.entries(scores)
      .map(([dest, score]) => `${dest}: ${score} points`)
      .join(", ");

    const userPrompt = `Destination recommandée par l'algorithme : ${winnerLabel}

Réponses du client au quiz :
${answersText}

Scores calculés : ${scoresText}

Rédige ta recommandation personnalisée.`;

    // Vérifier la clé API
    if (!apiKey || apiKey.includes("VOTRE_CLE") || apiKey.length < 10) {
      // Fallback sans IA : recommandation générique
      return NextResponse.json({
        recommendation: getFallbackRecommendation(winner, winnerLabel),
        destination: winner,
        fromAPI: false,
      });
    }

    // Appel IA
    let recommendation: string;
    if (provider === "gemini") {
      recommendation = await generateWithGemini(apiKey, userPrompt);
    } else {
      recommendation = await generateWithOpenAI(apiKey, userPrompt);
    }

    return NextResponse.json({
      recommendation,
      destination: winner,
      fromAPI: true,
    });
  } catch (error: unknown) {
    console.error("[Quiz API Error]", error);

    const body = await request.clone().json().catch(() => ({} as QuizRequestBody));

    return NextResponse.json({
      recommendation: getFallbackRecommendation(
        body.winner || "paris-1889",
        body.winnerLabel || "Paris 1889"
      ),
      destination: body.winner || "paris-1889",
      fromAPI: false,
    });
  }
}

// ─── Fallback sans IA ────────────────────────────────────────────────
function getFallbackRecommendation(destinationId: string, label: string): string {
  const fallbacks: Record<string, string> = {
    "paris-1889":
      "Votre profil révèle une âme éprise de culture, d'élégance et d'innovation. " +
      "Paris 1889 est faite pour vous : l'inauguration de la Tour Eiffel, les lumières de l'Exposition Universelle, " +
      "les Grands Boulevards vibrant d'une énergie sans précédent. " +
      "La Belle Époque vous tend les bras — il ne vous reste plus qu'à franchir le seuil du temps.",
    cretace:
      "Votre esprit aventurier ne fait aucun doute. Le Crétacé est votre terrain de jeu idéal : " +
      "des paysages primitifs à couper le souffle, des géants préhistoriques que personne d'autre n'a vus de ses propres yeux, " +
      "et une immersion dans la nature la plus brute et la plus spectaculaire qui ait jamais existé. " +
      "Préparez-vous à vivre l'aventure ultime.",
    "florence-1504":
      "Vous êtes un esthète, sensible à la beauté et à la grandeur de la création humaine. " +
      "Florence 1504 vous offrira ce que des siècles entiers n'ont pu reproduire : " +
      "Michel-Ange dévoilant son David, Léonard de Vinci dans son atelier, les intrigues des Médicis. " +
      "La Renaissance vous attend — et elle est encore plus belle en vrai.",
  };
  return fallbacks[destinationId] || fallbacks["paris-1889"];
}
