"use client";

import { useEffect, useState, type CSSProperties } from "react";
import fallback from "@/data/projects.json";
import { useServices } from "@/lib/useServices";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

type Project = { id?: string; title: string; desc: string; category?: string; image?: string; link?: string };

export default function Work() {
  const [projects, setProjects] = useState<Project[]>(fallback);
  const [active, setActive] = useState<string>("all");
  const services = useServices();
  const labelOf = (id?: string) => services.find((s) => s.id === id)?.title ?? "";

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.projects)) setProjects(d.projects);
      })
      .catch(() => {});
  }, []);

  const shown = active === "all" ? projects : projects.filter((p) => p.category === active);
  const tabs = [
    { id: "all", label: "All", count: projects.length },
    ...services.map((s) => ({ id: s.id, label: s.title, count: projects.filter((p) => p.category === s.id).length })),
  ];

  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <h2 className="text-3xl font-extrabold text-navy">Our Work</h2>
        <span className="mt-3 mb-6 block h-1 w-12 rounded bg-cyan" />
        <div className="mb-10 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={
                "rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 " +
                (active === t.id
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-muted hover:border-cyan hover:text-navy")
              }
            >
              {t.label} <span className="opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
      </Reveal>

      {shown.length === 0 && <p className="fade-up text-muted">New work in this category is coming soon.</p>}
      {/* key re-triggers the animation whenever the filter changes */}
      <div key={active} className="grid gap-6 md:grid-cols-3">
        {shown.map((p, i) => {
          const card = (
            <SpotlightCard className="group h-full rounded-2xl border border-line bg-white shadow-sm">
              <div className="h-40 overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary to-accent transition duration-500 group-hover:scale-110" />
                )}
              </div>
              <div className="p-5">
                {labelOf(p.category) && (
                  <span className="mb-2 inline-block rounded-full border border-cyan/50 bg-cyan/10 px-3 py-0.5 text-xs font-medium text-cyan-dark">
                    {labelOf(p.category)}
                  </span>
                )}
                <h3 className="mb-1 text-lg font-bold text-navy">{p.title}</h3>
                <p className="text-sm text-muted">{p.desc}</p>
                {p.link && <span className="mt-3 inline-block text-sm font-semibold text-cyan-dark">View project →</span>}
              </div>
            </SpotlightCard>
          );
          const key = p.id || p.title;
          const style = { "--d": `${i * 70}ms` } as CSSProperties;
          return p.link ? (
            <a key={key} href={p.link} target="_blank" rel="noopener noreferrer" className="fade-up block" style={style}>
              {card}
            </a>
          ) : (
            <div key={key} className="fade-up" style={style}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}