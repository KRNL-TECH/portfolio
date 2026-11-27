"use client";

import { useEffect, useState } from "react";
import fallback from "@/data/team.json";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

type Member = { id?: string; name: string; role: string; photo?: string };

export default function About() {
  const [team, setTeam] = useState<Member[]>(fallback);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.team)) setTeam(d.team);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="bg-mist">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-navy">About Us</h2>
          <span className="mt-3 mb-6 block h-1 w-12 rounded bg-cyan" />
          <p className="mb-10 max-w-2xl leading-8 text-muted">
            Kernix is a digital marketing agency. Our team of designers, developers and social media managers builds your brand identity, launches your website and app, and runs your social media presence.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.id || m.name} delay={i * 100} className="h-full">
              <SpotlightCard className="group h-full rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-2 ring-cyan/40 transition duration-300 group-hover:scale-105 group-hover:ring-cyan"
                  />
                ) : (
                  <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-3xl font-bold text-white transition duration-300 group-hover:scale-105">
                    {m.name.trim().charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-navy">{m.name}</h3>
                <p className="text-sm text-muted">{m.role}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}