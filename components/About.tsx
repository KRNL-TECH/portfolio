import Image from "next/image";
import team from "@/data/team.json";

export default function About() {
  return (
    <section id="about" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-accent">من نحن</h2>
      <p className="text-white/80 max-w-2xl mb-10 leading-8">
        فريق من {team.length} مطورين بنحوّل أفكار أصحاب الأنشطة الصغيرة لتطبيقات ومواقع شغالة،
        بسرعة وبسعر مناسب.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {team.map((m) => (
          <div key={m.name} className="rounded-2xl bg-white/5 p-6 text-center">
            {m.photo ? (
              <Image
                src={m.photo}
                alt={m.name}
                width={160}
                height={160}
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