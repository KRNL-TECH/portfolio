"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "services", label: "Services" },
  { id: "work", label: "Our Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

  // scroll progress bar + navbar style after scrolling
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 20);
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // highlight the section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className={
        "fixed top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 " +
        (scrolled ? "border-line bg-white/95 shadow-md shadow-navy/5" : "border-transparent bg-white/50")
      }
    >
      <div className={"mx-auto flex max-w-5xl items-center justify-between px-6 transition-all duration-300 " + (scrolled ? "py-2" : "py-4")}>
        <a href="#hero" className="flex items-center gap-2 text-xl font-extrabold text-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
          Kernix
        </a>
        <ul className="flex gap-5 text-sm font-medium">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={"#" + l.id}
                className={
                  "border-b-2 pb-1 transition " +
                  (active === l.id ? "border-cyan text-navy" : "border-transparent text-muted hover:text-navy")
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="absolute bottom-0 left-0 h-0.5 bg-cyan transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </nav>
  );
}