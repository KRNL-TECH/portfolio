export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-bold text-ink">Kernix</span>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Kernix. كل الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
