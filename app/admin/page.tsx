"use client";

import { useEffect, useState } from "react";

type Project = { id: string; title: string; desc: string; image?: string; link?: string };
type Status = "checking" | "out" | "in";

async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.82)
  );
}

const input = "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-accent";
const button = "rounded-lg bg-accent px-5 py-3 font-semibold text-dark transition hover:opacity-90 disabled:opacity-50";

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [projects, setProjects] = useState<Project[]>([]);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function loadProjects() {
    const r = await fetch("/api/projects");
    const d = await r.json();
    setProjects(d.projects || []);
  }

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (r.ok) {
          setStatus("in");
          return loadProjects();
        }
        setStatus("out");
      })
      .catch(() => setStatus("out"));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (r.ok) {
      setPassword("");
      setStatus("in");
      loadProjects();
    } else {
      const d = await r.json().catch(() => ({}));
      setMsg(d.error || "حصل خطأ");
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setStatus("out");
  }

  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.delete("image");
      if (file) fd.set("image", await shrink(file), "project.jpg");
      const r = await fetch("/api/projects", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "حصل خطأ");
      setProjects(d.projects);
      setFile(null);
      setFormKey((k) => k + 1);
      setMsg("✓ اتضاف المشروع");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "حصل خطأ");
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: Project) {
    if (!confirm(`مسح "${p.title}"؟`)) return;
    const r = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
    const d = await r.json().catch(() => ({}));
    if (r.ok) setProjects(d.projects);
    else setMsg(d.error || "حصل خطأ");
  }

  if (status === "checking") return <main className="p-10 text-center text-white/60">...</main>;

  if (status === "out") {
    return (
      <main className="mx-auto max-w-sm px-6 py-24">
        <h1 className="mb-6 text-2xl font-bold text-accent">دخول الأدمن</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            className={input}
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button className={button + " w-full"} disabled={busy || !password}>دخول</button>
          {msg && <p className="text-sm text-red-400">{msg}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent">إدارة الأعمال</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" className="text-white/70 hover:text-accent">الموقع</a>
          <button onClick={logout} className="text-white/70 hover:text-accent">خروج</button>
        </div>
      </div>

      <form key={formKey} onSubmit={addProject} className="mb-10 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold">إضافة مشروع</h2>
        <input name="title" className={input} placeholder="اسم المشروع" maxLength={80} required />
        <textarea name="desc" className={input} placeholder="وصف قصير" maxLength={300} rows={3} required />
        <input name="link" className={input} placeholder="لينك المشروع (اختياري) https://..." dir="ltr" />
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-white/70"
          />
          <p className="mt-1 text-xs text-white/40">الصورة بتتصغّر تلقائياً قبل الرفع (اختيارية).</p>
        </div>
        <button className={button} disabled={busy}>{busy ? "جاري الإضافة..." : "إضافة"}</button>
        {msg && <p className={"text-sm " + (msg.startsWith("✓") ? "text-accent" : "text-red-400")}>{msg}</p>}
      </form>

      <h2 className="mb-4 font-semibold">المشاريع الحالية ({projects.length})</h2>
      {projects.length === 0 && (
        <p className="text-sm text-white/50">لسه مفيش مشاريع محفوظة. الموقع بيعرض مشاريع تجريبية لحد ما تضيف أول مشروع.</p>
      )}
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
            ) : (
              <div className="h-14 w-20 rounded-lg bg-gradient-to-br from-primary to-accent" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="truncate text-sm text-white/50">{p.desc}</p>
            </div>
            <button onClick={() => remove(p)} className="text-sm text-red-400 hover:text-red-300">مسح</button>
          </li>
        ))}
      </ul>
    </main>
  );
}