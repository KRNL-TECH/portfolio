const team = [
  { name: "الاسم الأول", role: "Frontend / UI" },
  { name: "الاسم التاني", role: "Backend / Content" },
  { name: "الاسم التالت", role: "Deployment / QA" },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-accent">من نحن</h2>
      <p className="text-white/80 max-w-2xl mb-10 leading-8">
        فريق من 3 مطورين بنحوّل أفكار أصحاب الأنشطة الصغيرة لتطبيقات ومواقع شغالة،
        بسرعة وبسعر مناسب.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {team.map((m) => (
          <div key={m.name} className="rounded-2xl bg-white/5 p-6 text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent" />
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-white/60 text-sm">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}