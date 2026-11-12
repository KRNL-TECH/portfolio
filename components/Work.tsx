import Image from "next/image";
import projects from "@/data/projects.json";

export default function Work() {
  return (
    <section id="work" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-accent">أعمالنا</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => {
          const card = (
            <div className="h-full rounded-2xl overflow-hidden border border-white/10">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  width={800}
                  height={500}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 bg-gradient-to-br from-primary to-accent" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-white/70 text-sm">{p.desc}</p>
              </div>
            </div>
          );
          return p.link ? (
            <a
              key={p.title}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:-translate-y-1"
            >
              {card}
            </a>
          ) : (
            <div key={p.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}