"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const navItems: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Booking History", href: "/booking-history" },
];

// Variants
const logoVariant = {
  hidden: { x: -80, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const navContainerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const navItemVariant = {
  hidden: { y: -40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const authVariant = {
  hidden: { x: 80, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const Header: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 border-b transition-colors
    ${
      scrolled || pathname !== "/"
        ? "bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-xl border-white/10 shadow-lg"
        : "border-transparent"
    }
  `;

  return (
    <motion.header className={headerClasses} initial="hidden" animate="visible">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Brand */}
        <motion.div variants={logoVariant} className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-brand rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">BT</span>
            </motion.div>
            <span className="text-2xl font-bold text-white hover:text-brand transition-colors">
              Banaja Travels
            </span>
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          variants={navContainerVariant}
          className="hidden md:flex items-center space-x-8"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              variants={navItemVariant}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-white/80 hover:text-brand transition-colors font-medium"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Auth Buttons */}
        <motion.div variants={authVariant} className="flex items-center space-x-3">
          <Link href="/sign-in">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="text-black border-white/50 hover:bg-white/20 cursor-pointer"
              >
                Sign In
              </Button>
            </motion.div>
          </Link>
          <Link href="/sign-up">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="hidden sm:flex bg-brand hover:bg-brand-dark text-white cursor-pointer">
                Sign Up
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
