"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ─── Types enrichis ──────────────────────────────────────────────────
export interface DestinationDetails {
  climate: string;
  language: string;
  currency: string;
  duration: string;
  groupSize: string;
  highlights: string[];
  securityProtocols: string[];
  survivalRules: string[];
  fullDescription: string;
}

export interface Destination {
  id: string;
  title: string;
  expeditionName: string;
  epoch: string;
  description: string;
  image: string;
  price: string;
  danger: string;
  dangerLevel: number; // 1–5
  details: DestinationDetails;
}

// ─── Props ───────────────────────────────────────────────────────────
interface DestinationCardProps {
  destination: Destination;
  index: number;
  onDetailsClick: (destination: Destination) => void;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function DestinationCard({
  destination,
  index,
  onDetailsClick,
}: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative rounded-2xl overflow-hidden bg-dark-card border border-dark-border hover:border-gold/30 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Badge époque */}
        <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full">
          <span className="text-gold text-xs font-medium">
            {destination.epoch}
          </span>
        </div>

        {/* Badge prix */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-gold/20 rounded-full">
          <span className="text-gold text-xs font-bold">
            {destination.price}
          </span>
        </div>

        {/* Contenu overlay au hover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {destination.title}
          </h3>

          <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
            {destination.description}
          </p>

          {/* Niveau de danger */}
          <div className="flex items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
            <span className="text-xs text-gray-400">Risque temporel :</span>
            <span className="text-xs font-semibold text-gold">
              {destination.danger}
            </span>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDetailsClick(destination);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 hover:shadow-lg hover:shadow-gold/25"
          >
            Détails
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
