# TimeTravel Agency — Webapp Interactive

Webapp immersive pour une agence de voyage temporel fictive de luxe. Le site propose trois destinations (Paris 1889, Crétacé, Florence 1504) avec un chatbot IA conversationnel, un quiz de recommandation personnalisée et un système de réservation complet.

> Projet pédagogique — M1/M2 Digital & IA

---

## Stack Technique

| Couche | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Langage** | TypeScript |
| **Style** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **IA — Chatbot & Quiz** | Google Gemini 2.0 Flash (via API REST) — compatible OpenAI gpt-4o |
| **SDK** | OpenAI Node SDK (utilisé aussi pour le provider Gemini en option) |
| **Hébergement** | Compatible Vercel / tout hébergeur Node.js |

---

## Features

### Interface Utilisateur
- **Hero Section** — Vidéo IA en arrière-plan en boucle, titre animé, CTA "Explorer les époques"
- **Navbar Glassmorphism** — Navigation sticky avec effet vitreux au scroll, menu hamburger mobile
- **Galerie de Destinations** — 3 cartes interactives (Paris 1889, Crétacé, Florence 1504) avec effet de survol, zoom image et apparition de description
- **Modale Destination** — Fiche détaillée plein écran : informations pratiques (climat, langue, monnaie), points forts, protocoles de sécurité temporelle, règles de survie
- **FAQ Accordéon** — 3 questions animées (paradoxe temporel, assurance T-Rex, souvenirs)
- **Footer** — Liens de navigation, coordonnées du Chronoport Central

### Intelligence Artificielle — Agent Chronos
- **Chatbot IA conversationnel** — Widget flottant connecté à l'API Gemini (ou OpenAI), avec :
  - System prompt configurant la personnalité de Chronos (professionnel, chaleureux, passionné d'histoire)
  - Historique de conversation (20 derniers messages envoyés comme contexte)
  - Quick Replies cliquables pour les questions fréquentes
  - Effet de typing lettre par lettre
  - Fallback automatique sur des réponses locales si l'API est indisponible
- **Quiz de Recommandation IA** — 4 questions de préférences avec :
  - Algorithme de scoring pondéré (chaque réponse attribue des points aux 3 destinations)
  - Appel IA pour générer une recommandation personnalisée basée sur le profil du client
  - Barres de score visuelles et résultat détaillé

### Réservation
- **Formulaire modal** — Nom, email, destination (dropdown), année temporelle cible (accepte les valeurs négatives), date de départ réelle, nombre de voyageurs
- **Sélecteur de classe** — Éco, Business, Chronos First (avec multiplicateur tarifaire)
- **Pré-sélection** — La destination est pré-remplie quand on vient d'une fiche ou du quiz
- **Animation de confirmation** — 3 phases : synchronisation temporelle → "Voyage validé !" avec récapitulatif

### Design
- Thème **Luxury Dark Mode** avec accents or (#D4AF37)
- **Glassmorphism** (backdrop-blur + bordures semi-transparentes)
- Animations Framer Motion (fade-in, scale, slide, typing)
- **Mobile-first** responsive (cartes empilées sur mobile, grille sur desktop)

---

## Architecture du Projet

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Route API — Chatbot Chronos (Gemini/OpenAI)
│   │   └── quiz/route.ts        # Route API — Recommandation personnalisée IA
│   ├── globals.css              # Styles globaux + variables Tailwind
│   ├── layout.tsx               # Layout racine (meta, police, thème)
│   └── page.tsx                 # Page principale (SPA)
├── components/
│   ├── Navbar.tsx               # Navigation glassmorphism responsive
│   ├── HeroSection.tsx          # Vidéo plein écran + titre animé
│   ├── DestinationGallery.tsx   # Section galerie + données des destinations
│   ├── DestinationCard.tsx      # Carte interactive avec hover reveal
│   ├── DestinationModal.tsx     # Modale détaillée plein écran
│   ├── TimeQuiz.tsx             # Quiz de recommandation (4 questions + résultat IA)
│   ├── FAQ.tsx                  # Accordéon FAQ animé
│   ├── ChatWidget.tsx           # Chatbot flottant (IA + fallback local)
│   ├── BookingModal.tsx         # Formulaire de réservation + confirmation
│   └── Footer.tsx               # Footer avec liens et contact
public/
├── images/                      # Visuels des destinations (générés par IA)
│   ├── paris.jpg
│   ├── cretace.png
│   └── renaissance.png
└── videos/
    └── hero-bg.mp4              # Vidéo d'arrière-plan hero (générée par IA)
```

---

## Installation

### Prérequis
- **Node.js** 18+ et **npm** 9+

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd Travel_agency

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API IA
#    Copiez .env.example en .env.local et ajoutez votre clé :
cp .env.example .env.local
```

Éditez `.env.local` :

```env
# Option A : Google Gemini (recommandé — gratuit)
AI_PROVIDER=gemini
AI_API_KEY=votre_clé_google_ai_studio

# Option B : OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-votre_clé_openai
```

Obtenez votre clé gratuite :
- **Gemini** : [Google AI Studio](https://aistudio.google.com/apikey)
- **OpenAI** : [OpenAI Platform](https://platform.openai.com/api-keys)

```bash
# 4. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

> **Note** : Le chatbot et le quiz fonctionnent même sans clé API grâce au système de fallback local. L'IA enrichit simplement les réponses.

---

## IA Utilisées

### Génération de code
- **Cursor** (Claude) — Assistance au développement de l'ensemble du code source

### Chatbot & Recommandation
- **Google Gemini 2.0 Flash** — Modèle IA pour le chatbot conversationnel (Agent Chronos) et la génération de recommandations personnalisées dans le quiz
- Compatible **OpenAI gpt-4o** (changement de provider via variable d'environnement)

### Assets visuels
- **Visuels des destinations** — Images générées par IA (Paris 1889, Crétacé, Florence 1504)
- **Vidéo Hero** — Teaser vidéo généré par IA utilisé en arrière-plan

---

## Scripts Disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (hot-reload) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |

---

## Crédits

- **Framework** : [Next.js](https://nextjs.org/) par Vercel
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Style** : [Tailwind CSS](https://tailwindcss.com/)
- **API IA** : [Google Gemini](https://ai.google.dev/) / [OpenAI](https://openai.com/)
- **SDK** : [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- **Police** : [Inter](https://rsms.me/inter/) via Google Fonts

---

## Licence

Projet pédagogique — M1/M2 Digital & IA.
Tous droits réservés à travers toutes les lignes temporelles.
