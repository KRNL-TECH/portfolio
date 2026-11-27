"use client";

import { useEffect, useState } from "react";
import { useServices } from "@/lib/useServices";

export default function Hero() {
  const services = useServices();
  const [i, setI] = useState(0);

  // the highlighted word rotates through your services
  useEffect(() => {
    const t = setInterval(() => setI((n) => n + 1), 2500);
    return () => clearInterval(t);
  }, []);

  const word = services.length ? services[i % services.length].title : "";

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-white to-mist px-6 text-center"
    >
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="blob pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-cyan/25 blur-3xl" />
      <div aria-hidden className="blob pointer-events-none absolute bottom-0 left-[8%] h-80 w-80 rounded-full bg-navy/15 blur-3xl [animation-delay:-6s]" />

      {/* big logo behind the text */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        className="logo-float pointer-events-none absolute left-1/2 top-1/2 w-[min(95vw,820px)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.13]"
      />

      <div className="relative">
        <span className="fade-up mb-4 inline-block rounded-full border border-cyan/60 bg-white/70 px-4 py-1 text-sm font-medium text-cyan-dark">
          Kernix | Digital Marketing Agency
        </span>
        <h1 className="fade-up mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-navy [--d:100ms] md:text-6xl">
          We build your brand&apos;s{" "}
          <span className="bg-linear-to-r from-navy to-cyan bg-clip-text text-transparent">digital presence</span>
        </h1>
        <p className="fade-up mt-6 text-2xl text-navy/80 [--d:200ms] md:text-3xl">
          Through{" "}
          <span key={word} className="word-in font-semibold text-cyan-dark">
            {word}
          </span>
        </p>
        <p className="fade-up mx-auto mt-6 max-w-xl text-lg text-muted [--d:300ms]">
          Visual identity, websites, mobile apps and social media management, all from one team.
        </p>
        <div className="fade-up mt-8 flex flex-wrap justify-center gap-4 [--d:400ms]">
          <a href="#contact" className="rounded-xl bg-navy px-6 py-3 font-semibold text-white shadow-lg shadow-navy/20 transition hover:-translate-y-0.5 hover:bg-navy/90">
            Start your project
          </a>
          <a href="#work" className="rounded-xl border border-navy/20 bg-white/60 px-6 py-3 font-semibold text-navy transition hover:-translate-y-0.5 hover:border-cyan hover:bg-white">
            See our work
          </a>
        </div>
      </div>

      <a href="#services" aria-label="Scroll down" className="bounce-y absolute bottom-8 text-2xl text-navy/40 hover:text-cyan-dark">
        ↓
      </a>
    </section>
  );
}