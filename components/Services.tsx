const services = [
  { title: "تطبيقات موبايل", desc: "تطبيقات Android وiOS بـ Flutter بسرعة وجودة عالية." },
  { title: "مواقع ويب", desc: "مواقع وصفحات هبوط سريعة ومتجاوبة مع كل الشاشات." },
  { title: "لوحات تحكم", desc: "أنظمة إدارة وحجوزات تريّح صاحب النشاط." },
];

export default function Services() {
  return (
    <section id="services" className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-accent">خدماتنا</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-white/70">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}