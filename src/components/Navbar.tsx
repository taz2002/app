
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

type Theme = "light" | "dark";

function getActiveTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const rootTheme = document.documentElement.getAttribute("data-theme");
  if (rootTheme === "light" || rootTheme === "dark") {
    return rootTheme;
  }

  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  localStorage.setItem("theme", theme);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(getActiveTheme());
    };

    syncTheme();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "theme") {
        syncTheme();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => {
    const currentTheme = theme ?? getActiveTheme();
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  const themeIcon = theme === null ? (
    <span className="inline-block h-[18px] w-[18px]" aria-hidden="true" />
  ) : theme === "dark" ? (
    <Sun size={18} />
  ) : (
    <Moon size={18} />
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-lg border-b py-4" : "bg-transparent py-6"
      }`}
      style={scrolled ? { backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" } : undefined}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[var(--text-primary)] font-bold text-xl tracking-wider">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-[-6%] rounded-full blur-md pointer-events-none"
              style={{ background: "var(--logo-glow)" }}
            />
            <Image src="/logo-large.png" alt="Tazkhiir Logo" width={160} height={40} className="relative z-10 h-10 w-auto" style={{ filter: "var(--logo-filter)" }} priority />
          </div>
          <span>TAZKHIIR</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[var(--text-secondary)] text-sm font-medium">
          <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
          <a href="#approach" className="hover:text-[var(--text-primary)] transition-colors">Approach</a>
          <a href="#results" className="hover:text-[var(--text-primary)] transition-colors">Work</a>
          <a href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            aria-pressed={theme === "dark"}
            className="w-10 h-10 rounded-full border border-[var(--glass-border)] glass flex items-center justify-center text-[var(--text-primary)] hover:scale-105 transition-transform"
          >
            {themeIcon}
          </button>
          <button className="bg-[var(--primary)]/10 text-[var(--accent-neon)] border border-[var(--primary)] px-5 py-2 rounded-full hover:bg-[var(--primary)]/20 transition-all glow-btn">
            Get Started
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            aria-pressed={theme === "dark"}
            className="w-10 h-10 rounded-full border border-[var(--glass-border)] glass flex items-center justify-center text-[var(--text-primary)]"
          >
            {themeIcon}
          </button>
          <button
            className="text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b p-6 flex flex-col gap-6 text-center"
          style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
        >
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)]">Services</a>
          <a href="#approach" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)]">Approach</a>
          <a href="#results" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)]">Work</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)]">Contact</a>
          <button className="bg-[var(--primary)] text-black font-semibold py-3 rounded-full mt-2">
            Get Started
          </button>
        </div>
      )}
    </motion.nav>
  );
}
