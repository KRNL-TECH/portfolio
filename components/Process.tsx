const steps = [
  { title: "نفهم نشاطك", desc: "جلسة قصيرة نعرف فيها منتجاتك وعملاءك وهدفك." },
  { title: "نبني الخطة", desc: "قنوات وميزانية وجدول محتوى واضح قبل أي صرف." },
  { title: "ننفّذ", desc: "تصميم ونشر وإطلاق للحملات من فريق واحد." },
  { title: "نقيس ونحسّن", desc: "نتابع الأرقام ونعدّل الحملات على حسب النتائج." },
];

export default function Process() {
  return (
    <section id="process" className="bg-mist">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold text-ink">طريقة شغلنا</h2>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-4">
          <div aria-hidden className="absolute inset-x-3 top-3 hidden h-0.5 bg-accent/50 md:block" />
          {steps.map((s) => (
            <li key={s.title} className="relative">
              <span className="relative z-10 block h-6 w-6 rounded-full border-4 border-ink bg-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 leading-7 text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
