"use client";

import { useEffect, useState } from "react";
import fallback from "@/data/projects.json";

type Project = { id?: string; title: string; desc: string; image?: string; link?: string };

export default function Work() {
  const [projects, setProjects] = useState<Project[]>(fallback);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.projects)) setProjects(d.projects);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="work" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-accent">أعمالنا</h2>
      {projects.length === 0 && <p className="text-white/60">أعمالنا الجديدة قريباً.</p>}
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => {
          const card = (
            <div className="h-full rounded-2xl overflow-hidden border border-white/10">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 bg-linear-to-br from-primary to-accent" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-white/70 text-sm">{p.desc}</p>
              </div>
            </div>
          );
          const key = p.id || p.title;
          return p.link ? (
            <a key={key} href={p.link} target="_blank" rel="noopener noreferrer" className="block transition hover:-translate-y-1">
              {card}
            </a>
          ) : (
            <div key={key}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}