const projects = [
  { title: "نظام حجز للعيادات", desc: "حجز مواعيد أونلاين مع لوحة تحكم." },
  { title: "منيو إلكتروني", desc: "منيو وطلبات لمطعم عن طريق QR." },
  { title: "موقع شركة", desc: "موقع تعريفي سريع ومتجاوب." },
];

export default function Work() {
  return (
    <section id="work" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-accent">أعمالنا</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <div key={p.title} className="rounded-2xl overflow-hidden border border-white/10">
            <div className="h-40 bg-gradient-to-br from-primary to-accent" />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-white/70 text-sm">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}