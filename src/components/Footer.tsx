"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-dark-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-dark"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gold-gradient">
                TimeTravel Agency
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pionniers du voyage temporel depuis 2024. Nous rendons
              l&apos;impossible accessible, une époque à la fois.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", href: "#hero" },
                { label: "Destinations", href: "#destinations" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Chronoport Central, Paris</li>
              <li>contact@timetravel.agency</li>
              <li>+33 1 23 45 67 89</li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="pt-8 border-t border-dark-border text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TimeTravel Agency. Tous droits
            réservés à travers toutes les lignes temporelles.
          </p>
        </div>
      </div>
    </footer>
  );
}
