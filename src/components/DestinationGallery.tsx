"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DestinationCard, { Destination } from "./DestinationCard";
import DestinationModal from "./DestinationModal";

// ─── Données complètes des destinations ──────────────────────────────
const destinations: Destination[] = [
  {
    id: "paris-1889",
    title: "Paris 1889",
    expeditionName: "Expédition Paris 1889",
    epoch: "Exposition Universelle",
    description:
      "Revivez l'effervescence de l'Exposition Universelle et assistez à l'inauguration de la Tour Eiffel. Plongez dans le Paris de la Belle Époque, entre innovation et élégance.",
    image: "/images/paris.jpg",
    price: "À partir de 12 500 €",
    danger: "Faible",
    dangerLevel: 1,
    details: {
      climate: "Tempéré océanique — Été doux (18-25°C), averses possibles",
      language: "Français (XIXe siècle) — Quelques tournures archaïques",
      currency: "Franc français (pièces d'or et d'argent fournies par l'agence)",
      duration: "3 à 7 jours d'immersion",
      groupSize: "6 voyageurs maximum",
      highlights: [
        "Inauguration de la Tour Eiffel — vue depuis le Champ-de-Mars",
        "Visite de la Galerie des Machines et ses innovations révolutionnaires",
        "Soirée au Moulin Rouge, qui ouvre ses portes cette année-là",
        "Dégustation gastronomique au Grand Véfour avec le chef Escoffier",
        "Promenade sur les Grands Boulevards illuminés à l'électricité",
        "Rencontre encadrée avec des figures de la Belle Époque",
      ],
      securityProtocols: [
        "Encadrement discret par un chrononaute spécialiste du XIXe siècle, habillé en gentleman parisien.",
        "Costume d'époque obligatoire : redingote et haut-de-forme pour les hommes, robe à tournure pour les femmes. Fourni par notre atelier.",
        "Communication via micro-émetteur dissimulé dans un bijou d'époque. Fréquence cryptée temporellement.",
        "Zone de repli sécurisée dans une boutique du 7e arrondissement, accessible en cas d'urgence.",
      ],
      survivalRules: [
        "Ne mentionnez jamais les événements futurs — les guerres mondiales, l'aviation, Internet.",
        "Discrétion anachronique requise : aucun objet moderne ne doit être visible.",
        "Ne pas interférer avec les personnalités historiques au-delà des interactions encadrées.",
        "En cas de contrôle policier, votre chrononaute gère la situation. Restez calme.",
      ],
      fullDescription:
        "Paris, 1889. La Ville Lumière brille de mille feux pour l'Exposition Universelle qui célèbre le centenaire de la Révolution française. " +
        "La Tour Eiffel, achevée depuis quelques semaines seulement, domine un panorama de progrès et d'audace. " +
        "Trente-deux millions de visiteurs se pressent aux portes de l'Exposition — et vous serez parmi eux. " +
        "Flânez entre les pavillons des nations, émerveillez-vous devant les premières démonstrations d'éclairage électrique, " +
        "et laissez-vous porter par l'optimisme effervescent d'une époque qui croit que le progrès n'a pas de limites.",
    },
  },
  {
    id: "cretace",
    title: "Crétacé",
    expeditionName: "Expédition Crétacé",
    epoch: "-68 millions d'années",
    description:
      "Explorez la nature sauvage du Crétacé supérieur. Observez les géants préhistoriques dans leur habitat naturel. Combinaison de protection et guide paléontologue inclus.",
    image: "/images/cretace.png",
    price: "À partir de 45 000 €",
    danger: "Extrême",
    dangerLevel: 5,
    details: {
      climate: "Tropical humide — 28-35°C constant, atmosphère riche en oxygène",
      language: "Aucune — Communication uniquement au sein du groupe",
      currency: "Aucune — Économie inexistante. Tout le matériel est fourni.",
      duration: "24 à 72 heures d'immersion (maximum strict)",
      groupSize: "4 voyageurs maximum",
      highlights: [
        "Observation de Tyrannosaures en chasse depuis un poste blindé camouflé",
        "Troupeaux de Tricératops traversant les plaines de magnolias primitifs",
        "Vol de Ptéranodons au-dessus de la canopée — spectacle aérien du Mésozoïque",
        "Flore préhistorique intacte : fougères géantes, conifères araucarias, premières fleurs",
        "Nuit dans le dôme d'observation sous un ciel sans pollution lumineuse",
        "Prélèvement d'échantillons géologiques (autorisé sous protocole strict)",
      ],
      securityProtocols: [
        "Combinaison exosquelettique renforcée au titane avec champ de force personnel (rayon : 3 mètres).",
        "Balise de retour d'urgence implantée au poignet — extraction en 4,7 secondes en cas de danger critique.",
        "Dôme d'invisibilité de 500 mètres autour du campement. Aucun prédateur ne peut pénétrer le périmètre.",
        "Guide paléontologue-chrononaute armé en permanence. Ratio : 1 guide pour 2 voyageurs.",
        "Surveillance biométrique continue — rythme cardiaque, stress, position GPS temporelle.",
      ],
      survivalRules: [
        "Immobilité absolue en cas d'alerte T-Rex — leur vision est basée sur le mouvement.",
        "Ne jamais quitter le périmètre du dôme sans autorisation explicite du guide.",
        "Aucun prélèvement biologique vivant — risque de contamination inter-temporelle.",
        "Ne pas nourrir, toucher ou approcher la faune, quelle que soit sa taille.",
        "En cas de défaillance du champ de force : protocole CHRONO-RED — extraction immédiate.",
      ],
      fullDescription:
        "Il y a 68 millions d'années. La Terre est méconnaissable : des forêts denses de conifères et de fougères géantes s'étendent à perte de vue, " +
        "traversées par des rivières aux eaux chaudes. L'air est plus riche en oxygène, les couleurs plus vives, les sons plus primitifs. " +
        "C'est le règne des dinosaures — et vous allez le voir de vos propres yeux. " +
        "Notre expédition au Crétacé supérieur est la plus extrême et la plus exclusive que nous proposons. " +
        "Depuis notre dôme d'observation invisible, vous assisterez au spectacle le plus ancien et le plus grandiose de l'histoire de la vie sur Terre. " +
        "Ce voyage changera à jamais votre perception du temps, de la nature et de votre place dans l'univers.",
    },
  },
  {
    id: "florence-1504",
    title: "Florence 1504",
    expeditionName: "Expédition Florence 1504",
    epoch: "Renaissance italienne",
    description:
      "Vivez l'apogée de la Renaissance aux côtés de Léonard de Vinci et Michel-Ange. Découvrez Florence à son âge d'or, entre art, science et politique des Médicis.",
    image: "/images/renaissance.png",
    price: "À partir de 18 000 €",
    danger: "Modéré",
    dangerLevel: 3,
    details: {
      climate: "Méditerranéen — Étés chauds (28-33°C), hivers doux",
      language: "Italien toscan (Renaissance) — Cours accéléré de 2 jours inclus",
      currency: "Florin d'or (répliques authentiques fournies par l'agence)",
      duration: "5 à 10 jours d'immersion",
      groupSize: "5 voyageurs maximum",
      highlights: [
        "Visite de l'atelier de Michel-Ange pendant la finalisation du David",
        "Observation des carnets de Léonard de Vinci dans son studio privé",
        "Dîner de gala dans le Palazzo Médicis avec la haute société florentine",
        "Promenade sur le Ponte Vecchio parmi les orfèvres et marchands de soie",
        "Messe à la Cathédrale Santa Maria del Fiore sous le dôme de Brunelleschi",
        "Débat philosophique à l'Académie platonicienne (observation encadrée)",
      ],
      securityProtocols: [
        "Chrononaute spécialiste de la Renaissance, déguisé en marchand toscan. Parle italien couramment.",
        "Garde-robe complète d'époque confectionnée sur mesure : pourpoint, chausses, gamurra selon le genre.",
        "Dispositif de traduction auriculaire invisible pour conversations en italien du XVIe siècle.",
        "Réseau de maisons sûres dans 3 quartiers de Florence, accessibles via mot de passe temporel.",
        "Antidote universel contre les maladies de l'époque — vaccination pré-départ obligatoire.",
      ],
      survivalRules: [
        "Ne pas interférer avec les ancêtres — toute interaction doit rester superficielle et encadrée.",
        "Discrétion anachronique requise : aucune référence à l'avenir, la science moderne ou la technologie.",
        "Évitez les conflits politiques entre factions — Florence est un nid d'intrigues en 1504.",
        "Ne jamais révéler le destin des œuvres d'art ou des personnalités que vous rencontrez.",
        "En cas de suspicion d'espionnage par les gardes Médicis : protocole FIORENZA — extraction douce.",
      ],
      fullDescription:
        "Florence, 1504. Le cœur battant de la Renaissance italienne. En cette année charnière, " +
        "Michel-Ange dévoile son David monumental sur la Piazza della Signoria, tandis que Léonard de Vinci " +
        "perfectionne ses études sur le vol humain dans son atelier secret. Les Médicis règnent sur la ville " +
        "avec un mélange de mécénat artistique et de calcul politique impitoyable. " +
        "Vous déambulerez dans des rues où chaque pierre respire le génie, où chaque conversation pourrait changer le cours de l'art occidental. " +
        "La beauté y est partout — dans les fresques des églises, dans la lumière toscane, dans les regards de ceux qui savent " +
        "qu'ils vivent un moment unique de l'histoire humaine. Et vous le saurez aussi.",
    },
  },
];

// ─── Props ───────────────────────────────────────────────────────────
interface DestinationGalleryProps {
  onBookingClick: (destinationId: string) => void;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function DestinationGallery({ onBookingClick }: DestinationGalleryProps) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDetailsClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Petit délai pour l'animation de sortie
    setTimeout(() => setSelectedDestination(null), 300);
  };

  const handleBookFromModal = (destinationId: string) => {
    handleCloseModal();
    // Petit délai pour que la modale se ferme avant d'ouvrir le booking
    setTimeout(() => onBookingClick(destinationId), 350);
  };

  return (
    <>
      <section id="destinations" className="py-20 md:py-32 px-4 relative">
        {/* Fond décoratif */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* En-tête */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
            >
              Nos destinations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold"
            >
              Choisissez votre{" "}
              <span className="text-gold-gradient">Timeline</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
            />
          </div>

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {destinations.map((dest, index) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                index={index}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modale de détails */}
      <DestinationModal
        destination={selectedDestination}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onBookClick={handleBookFromModal}
      />
    </>
  );
}
