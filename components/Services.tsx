"use client";

import { useServices } from "@/lib/useServices";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

export default function Services() {
  const services = useServices();

  return (
    <section id="services" className="bg-mist">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-navy">Our Services</h2>
          <span className="mt-3 mb-10 block h-1 w-12 rounded bg-cyan" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 100} className="h-full">
              <SpotlightCard className="h-full rounded-2xl border border-line bg-white p-6 shadow-sm">
                <span className="mb-4 block text-sm font-bold text-cyan-dark">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mb-2 text-xl font-bold text-navy">{s.title}</h3>
                <p className="text-muted">{s.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}