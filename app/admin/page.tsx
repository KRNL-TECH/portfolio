"use client";

import { useEffect, useState } from "react";

type Project = { id: string; title: string; desc: string; image?: string; link?: string };
type Member = { id: string; name: string; role: string; photo?: string };
type Status = "checking" | "out" | "in";
type Tab = "projects" | "team";

async function shrink(file: File, square = false): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  if (square) {
    const side = Math.min(bmp.width, bmp.height);
    const out = Math.min(400, side);
    canvas.width = canvas.height = out;
    ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, out, out);
  } else {
    const scale = Math.min(1, 1200 / bmp.width);
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  }
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.82)
  );
}

const input = "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-accent";
const button = "rounded-lg bg-accent px-5 py-3 font-semibold text-dark transition hover:opacity-90 disabled:opacity-50";

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<Member[]>([]);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function loadAll() {
    const [p, t] = await Promise.all([fetch("/api/projects"), fetch("/api/team")]);
    setProjects((await p.json()).projects || []);
    setTeam((await t.json()).team || []);
  }

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (r.ok) {
          setStatus("in");
          return loadAll();
        }
        setStatus("out");
      })
      .catch(() => setStatus("out"));
  }, []);

  function switchTab(t: Tab) {
    setTab(t);
    setMsg("");
    setFile(null);
    setFormKey((k) => k + 1);
  }

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
      loadAll();
    } else {
      const d = await r.json().catch(() => ({}));
      setMsg(d.error || "حصل خطأ");
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setStatus("out");
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.delete("image");
      if (file) fd.set("image", await shrink(file, tab === "team"), "photo.jpg");
      const r = await fetch(`/api/${tab}`, { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "حصل خطأ");
      if (tab === "projects") setProjects(d.projects);
      else setTeam(d.team);
      setFile(null);
      setFormKey((k) => k + 1);
      setMsg("✓ اتضاف");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "حصل خطأ");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`مسح "${label}"؟`)) return;
    const r = await fetch(`/api/${tab}/${id}`, { method: "DELETE" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(d.error || "حصل خطأ");
    if (tab === "projects") setProjects(d.projects);
    else setTeam(d.team);
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

  const isTeam = tab === "team";
  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => switchTab(t)}
      className={
        "rounded-lg px-4 py-2 text-sm font-semibold transition " +
        (tab === t ? "bg-accent text-dark" : "bg-white/5 text-white/70 hover:text-white")
      }
    >
      {label}
    </button>
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent">لوحة الإدارة</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" className="text-white/70 hover:text-accent">الموقع</a>
          <button onClick={logout} className="text-white/70 hover:text-accent">خروج</button>
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        {tabBtn("projects", "الأعمال")}
        {tabBtn("team", "التيم (من نحن)")}
      </div>

      <form key={formKey} onSubmit={add} className="mb-10 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold">{isTeam ? "إضافة عضو" : "إضافة مشروع"}</h2>
        {isTeam ? (
          <>
            <input name="name" className={input} placeholder="الاسم" maxLength={60} required />
            <input name="role" className={input} placeholder="التخصص (مثلاً Frontend / UI)" maxLength={80} required />
          </>
        ) : (
          <>
            <input name="title" className={input} placeholder="اسم المشروع" maxLength={80} required />
            <textarea name="desc" className={input} placeholder="وصف قصير" maxLength={300} rows={3} required />
            <input name="link" className={input} placeholder="لينك المشروع (اختياري) https://..." dir="ltr" />
          </>
        )}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-white/70"
          />
          <p className="mt-1 text-xs text-white/40">
            {isTeam ? "الصورة بتتقص مربعة وتتصغّر تلقائياً (اختيارية)." : "الصورة بتتصغّر تلقائياً قبل الرفع (اختيارية)."}
          </p>
        </div>
        <button className={button} disabled={busy}>{busy ? "جاري الإضافة..." : "إضافة"}</button>
        {msg && <p className={"text-sm " + (msg.startsWith("✓") ? "text-accent" : "text-red-400")}>{msg}</p>}
      </form>

      <h2 className="mb-4 font-semibold">
        {isTeam ? `أعضاء التيم (${team.length})` : `المشاريع الحالية (${projects.length})`}
      </h2>
      {(isTeam ? team : projects).length === 0 && (
        <p className="text-sm text-white/50">
          لسه مفيش حاجة محفوظة. الموقع بيعرض بيانات تجريبية لحد ما تضيف أول عنصر.
        </p>
      )}
      <ul className="space-y-3">
        {isTeam
          ? team.map((m) => (
              <li key={m.id} className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt="" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-bold">
                    {m.name.trim().charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="truncate text-sm text-white/50">{m.role}</p>
                </div>
                <button onClick={() => remove(m.id, m.name)} className="text-sm text-red-400 hover:text-red-300">مسح</button>
              </li>
            ))
          : projects.map((p) => (
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
                <button onClick={() => remove(p.id, p.title)} className="text-sm text-red-400 hover:text-red-300">مسح</button>
              </li>
            ))}
      </ul>
    </main>
  );
}