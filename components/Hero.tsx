export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <span className="mb-4 rounded-full border border-accent/40 px-4 py-1 text-sm text-accent">
        Krnl Tech
      </span>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
        بنحوّل فكرة نشاطك لتطبيق وموقع <span className="text-accent">شغّال</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/70">
        تطبيقات موبايل ومواقع ولوحات تحكم لأصحاب الأنشطة الصغيرة، بسرعة وبسعر مناسب.
      </p>
      <div className="mt-8 flex gap-4">
        <a href="#contact" className="rounded-xl bg-primary px-6 py-3 font-semibold transition hover:opacity-90">
          ابدأ مشروعك
        </a>
        <a href="#work" className="rounded-xl border border-white/20 px-6 py-3 transition hover:bg-white/10">
          شوف أعمالنا
        </a>
      </div>
    </section>
  );
}