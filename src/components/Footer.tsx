"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Mail, Phone, Globe, ArrowRight } from "lucide-react";
import { FaYoutube, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import type { IconType } from "react-icons";

const container: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 14,
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 14 },
  },
};

export default function Footer() {
  const socials: { href: string; Icon: IconType; hover: string; label: string }[] = [
    { href: "https://www.instagram.com/banajatravels", Icon: FaInstagram, hover: "hover:bg-pink-500", label: "Instagram" },
    { href: "https://www.facebook.com/banajatravels", Icon: FaFacebookF, hover: "hover:bg-blue-600", label: "Facebook" },
    { href: "https://www.youtube.com/@banajatravels", Icon: FaYoutube, hover: "hover:bg-red-600", label: "YouTube" },
    { href: "https://www.banajatravels.com", Icon: Globe as unknown as IconType, hover: "hover:bg-cyan-500", label: "Website" },
    { href: "https://wa.me/917789810517", Icon: FaWhatsapp as unknown as IconType, hover: "hover:bg-green-500", label: "Whatsapp" },
  ];


  const quickLinks = ["Home", "Pricing", "Contact Us"];

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1120] to-[#0F172A] text-gray-300 pt-12 pb-12 px-6 overflow-hidden">
      {/* Animated top shimmer line */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        {/* Brand & About */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              className="bg-gradient-to-tr from-blue-400 to-cyan-400 text-white font-bold px-3 py-2 rounded-full text-lg shadow-[0_0_25px_rgba(34,211,238,0.25)]"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              BT
            </motion.div>
            <span className="text-lg font-semibold text-white">Banaja Travels</span>
          </div>
          <p className="text-sm mb-5">
            Premium car rental service offering comfort, safety, and style — anytime, anywhere.
          </p>

          <div className="flex gap-3">
            {socials.map(({ href, Icon, hover, label }, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.15, rotate: 4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`bg-gray-800/80 backdrop-blur-[1px] p-2 rounded-full transition-colors ${hover} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                >
                  <Icon size={20} className="text-white" />
                </a>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Quick Links */}
        <motion.div variants={item}>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((label, i) => (
              <li key={i} className="group">
                <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    href="#"
                    className="relative inline-block hover:text-cyan-400 transition-colors"
                  >
                    {label}
                    <span className="block h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Get in Touch */}
        <motion.div variants={item}>
          <h4 className="text-white font-semibold mb-4">Get in Touch</h4>

          {/* Email */}
          <a
            href="mailto:service@banajatravels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mb-3 hover:text-cyan-400 transition-colors"
          >
            <Mail size={18} className="text-cyan-400" />
            <span className="text-sm">service@banajatravels.com</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+917789810517"
            className="flex items-center gap-3 mb-3 hover:text-cyan-400 transition-colors"
          >
            <Phone size={18} className="text-cyan-400" />
            <span className="text-sm">+91 99373 76969</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919937376969"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-cyan-400 transition-colors"
          >
            <FaWhatsapp size={18} className="text-green-500" />
            <span className="text-sm">+91 99373 76969</span>
          </a>

        </motion.div>

        {/* Newsletter */}
        <motion.div variants={item}>
          <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm mb-4">
            Sign up for exclusive offers, travel tips, and latest car arrivals.
          </p>
          <motion.form
            className="flex items-center bg-gray-800/70 rounded-lg overflow-hidden border border-gray-700/60 focus-within:border-cyan-500 transition-colors"
            initial={{ opacity: 0.95 }}
            whileHover={{ opacity: 1 }}
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <motion.button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 px-3 py-2 text-white flex items-center justify-center"
              whileHover={{ scale: 1.08, boxShadow: "0 8px 24px rgba(34,211,238,0.35)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <ArrowRight size={18} />
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="max-w-7xl mx-auto mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <p>
          © 2025 <span className="text-cyan-400">Banaja Travels</span>. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookies"].map((link, i) => (
            <Link key={i} href="#" className="relative group hover:text-cyan-400">
              {link}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
