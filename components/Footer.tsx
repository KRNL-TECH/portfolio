export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
          </span>
          <span className="font-bold">Kernix</span>
        </div>
        <p className="text-sm text-white/70">© {new Date().getFullYear()} Kernix. All rights reserved.</p>
      </div>
    </footer>
  );
}