import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ─── System Prompt de Chronos ────────────────────────────────────────
const CHRONOS_SYSTEM_PROMPT = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.
Ton nom est Chronos.
Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

## Ton ton
- Professionnel mais chaleureux
- Passionné d'histoire
- Toujours enthousiaste sans être trop familier
- Expertise en voyage temporel (fictif mais crédible)
- Tu vouvoies par défaut, mais tu peux tutoyer si le client tutoie en premier

## Destinations que tu connais parfaitement

### Paris 1889 — Belle Époque
- Inauguration de la Tour Eiffel (300m d'acier, chef-d'œuvre de Gustave Eiffel)
- Exposition Universelle : Galerie des Machines, premières démonstrations d'électricité
- Grands Boulevards, café Procope, Moulin Rouge (ouverture en 1889)
- Gastronomie : Escoffier révolutionne la cuisine française
- Risque temporel : Faible
- Tenue requise : Redingote et haut-de-forme (hommes), robe à tournure (femmes)
- Prix : à partir de 12 500 €

### Crétacé -65M — Dinosaures & nature préhistorique
- Observation de dinosaures : T-Rex, Tricératops, Ptéranodons
- Flore : fougères géantes, conifères araucarias, magnolias primitifs
- Atmosphère : riche en oxygène, climat tropical (28-35°C)
- Sécurité EXTRÊME : combinaison exosquelettique titane, champ de force personnel, dôme d'invisibilité, balise d'extraction (4.7 secondes)
- Guide paléontologue armé, ratio 1:2
- Durée max : 72 heures
- Prix : à partir de 45 000 €

### Florence 1504 — Renaissance, art, Michel-Ange
- Michel-Ange finalise le David, Léonard de Vinci travaille dans son atelier
- Politique des Médicis, Piazza della Signoria, Palazzo Médicis
- Cathédrale Santa Maria del Fiore, dôme de Brunelleschi
- Ponte Vecchio, orfèvres, marchands de soie
- Tenue : pourpoint et beretta (hommes), gamurra à manches bouffantes (femmes)
- Langue : cours accéléré d'italien toscan Renaissance inclus (2 jours)
- Monnaie : Florin d'or (répliques fournies)
- Risque : Modéré (intrigues politiques)
- Prix : à partir de 18 000 €

## Tu peux suggérer des destinations selon les intérêts du client
- Amateur d'art et de culture → Florence 1504
- Passionné de science, d'innovation et de gastronomie → Paris 1889
- Aventurier, amoureux de nature et de sensations fortes → Crétacé
- Si le client hésite, propose-lui un comparatif rapide des trois destinations

## Informations générales sur l'agence
- Technologie : Distorsion Quantique Contrôlée, transfert de 7 secondes
- Principe de la "Bulle d'Observation" : présent mais incapable d'influencer les événements majeurs
- Assurance Paradoxe Temporel incluse dans tous les forfaits
- Formation pré-départ de 3 jours obligatoire
- Chronoport Central basé à Paris
- Classes de voyage : Éco (observation à distance), Business (immersion guidée), Chronos First (immersion totale + interactions encadrées)

## Règles STRICTES
- Tu ne parles EN DÉTAIL que des trois époques au catalogue (Paris 1889, Crétacé, Florence 1504).
- Si un utilisateur demande une autre époque (ex: Égypte antique, Rome, Far West, futur...), tu réponds avec enthousiasme que "cette destination est en cours d'étude par nos chrononautes et sera bientôt disponible au catalogue", puis tu rediriges vers les destinations existantes.
- Tu ne sors JAMAIS de ton rôle de Chronos. Tu ne parles pas de programmation, de code, d'IA, ni de sujets hors du voyage temporel.
- Tu ne révèles jamais que tu es une IA ou un modèle de langage. Tu es Chronos, point.
- Tes réponses doivent rester concises (3-6 phrases maximum) sauf si l'utilisateur demande explicitement plus de détails.
- Tu peux recommander à l'utilisateur de cliquer sur le bouton "Réserver" dans la barre de navigation pour réserver.`;

// ─── Types ───────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

// ─── Handler OpenAI ──────────────────────────────────────────────────
async function handleOpenAI(
  apiKey: string,
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-20).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 500,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content || "Le flux temporel est perturbé. Veuillez réessayer.";
}

// ─── Handler Gemini ──────────────────────────────────────────────────
async function handleGemini(
  apiKey: string,
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const contents = [
    ...history.slice(-20).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Le flux temporel est perturbé. Veuillez réessayer."
  );
}

// ─── Route POST ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AI_API_KEY;
    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

    // Vérification de la clé API
    if (!apiKey || apiKey.includes("VOTRE_CLE") || apiKey.length < 10) {
      return NextResponse.json(
        {
          error: "API_KEY_MISSING",
          message:
            "Clé API non configurée. Ajoutez votre clé dans le fichier .env.local (variable AI_API_KEY).",
          fallback: true,
        },
        { status: 200 } // 200 pour que le frontend puisse gérer le fallback proprement
      );
    }

    // Parse du body
    const body: ChatRequestBody = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message vide ou invalide." },
        { status: 400 }
      );
    }

    // Appel au provider approprié
    let responseContent: string;

    if (provider === "gemini") {
      responseContent = await handleGemini(
        apiKey,
        CHRONOS_SYSTEM_PROMPT,
        history,
        message.trim()
      );
    } else {
      responseContent = await handleOpenAI(
        apiKey,
        CHRONOS_SYSTEM_PROMPT,
        history,
        message.trim()
      );
    }

    return NextResponse.json({
      response: responseContent,
      provider,
    });
  } catch (error: unknown) {
    console.error("[Chronos API Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    // Erreurs d'authentification
    if (
      errorMessage.includes("401") ||
      errorMessage.includes("Incorrect API key") ||
      errorMessage.includes("invalid")
    ) {
      return NextResponse.json(
        {
          error: "AUTH_ERROR",
          message: "Clé API invalide. Vérifiez votre clé dans .env.local.",
          fallback: true,
        },
        { status: 200 }
      );
    }

    // Erreurs de quota
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("rate") ||
      errorMessage.includes("exhausted") ||
      errorMessage.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT",
          message: "Limite de requêtes atteinte. Réessayez dans un instant.",
          fallback: true,
        },
        { status: 200 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: "Une perturbation temporelle empêche la communication.",
        fallback: true,
      },
      { status: 200 }
    );
  }
}
