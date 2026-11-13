"use client";

import { useEffect, useState } from "react";
import fallback from "@/data/team.json";

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

  const n = team.length;
  const count = n >= 3 && n <= 10 ? `${n} مطورين` : "المطورين";

  return (
    <section id="about" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-accent">من نحن</h2>
      <p className="text-white/80 max-w-2xl mb-10 leading-8">
        فريق من {count} بنحوّل أفكار أصحاب الأنشطة الصغيرة لتطبيقات ومواقع شغالة، بسرعة وبسعر مناسب.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {team.map((m) => (
          <div key={m.id || m.name} className="rounded-2xl bg-white/5 p-6 text-center">
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.photo}
                alt={m.name}
                className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-2 ring-accent/40"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold">
                {m.name.trim().charAt(0)}
              </div>
            )}
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-white/60 text-sm">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}