"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "../app/context/UserContext";
import Image from "next/image";

const navItems: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Booking History", href: "/booking-history" },
];

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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/sign-in");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 border-b transition-colors
    ${scrolled || pathname !== "/"
      ? "bg-[#cfd1e8] backdrop-blur-xl border-gray-200 shadow-lg"
      : "bg-transparent border-transparent"
    }
  `;

  // ✅ Dynamic text color
  const linkClasses = scrolled || pathname !== "/"
    ? "text-gray-800 hover:text-brand"
    : "text-white/80 hover:text-brand";

  const signInBtnClasses = scrolled || pathname !== "/"
    ? "text-gray-800 border-gray-400 hover:bg-gray-100"
    : "text-black border-white/50 hover:bg-white/20";

  const signUpBtnClasses = scrolled || pathname !== "/"
    ? "bg-brand hover:bg-brand-dark text-black"
    : "bg-brand hover:bg-brand-dark text-white";

  return (
    <motion.header className={headerClasses} initial="hidden" animate="visible">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* ✅ Logo */}
        <motion.div variants={logoVariant} className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Image
                src="/images/logo.png"
                alt="Banaja Travels"
                width={230}
                height={60}
                className="object-contain"
                priority
              />
            </motion.div>
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
              <Link href={item.href} className={`${linkClasses} transition-colors font-medium`}>
                {item.name}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Auth Buttons */}
        <motion.div variants={authVariant} className="flex items-center space-x-3">
          {!user ? (
            <>
              <Link href="/sign-in">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className={`${signInBtnClasses} cursor-pointer`}>
                    Sign In
                  </Button>
                </motion.div>
              </Link>
              <Link href="/sign-up">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className={`${signUpBtnClasses} hidden sm:flex cursor-pointer`}>
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </>
          ) : (
            <Button
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={handleLogout}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
