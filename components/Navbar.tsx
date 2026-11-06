const links = [
  { href: "#services", label: "الخدمات" },
  { href: "#work", label: "أعمالنا" },
  { href: "#about", label: "من نحن" },
  { href: "#contact", label: "تواصل" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#hero" className="text-xl font-bold text-accent">Krnl Tech</a>
        <ul className="flex gap-5 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-white/80 transition hover:text-accent">{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}