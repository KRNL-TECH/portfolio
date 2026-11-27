// Worker: API للمشاريع + تسجيل دخول الأدمن. باقي الموقع (static) بيتقدم من مجلد out.
const COOKIE = "krnl_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7; // أسبوع
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const enc = new TextEncoder();

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function passwordOk(env, given) {
  const a = await hmac("pw-check", String(given ?? ""));
  const b = await hmac("pw-check", env.ADMIN_PASSWORD);
  return safeEqual(a, b);
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return "";
}

async function isAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = getCookie(request, COOKIE);
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(env.ADMIN_PASSWORD, "session:" + exp));
}

async function loadList(env, name) {
  const raw = await env.DATA.get(name);
  return raw ? JSON.parse(raw) : null;
}

const cleanText = (v, max) => String(v ?? "").trim().slice(0, max);

function cleanLink(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}
const DEFAULT_SERVICES = [
  { id: "branding", title: "Visual Identity", desc: "Logos, color systems, typography and graphic design that make your brand distinctive and instantly recognizable." },
  { id: "web", title: "Websites", desc: "Fast, responsive websites and landing pages that look great on every screen." },
  { id: "app", title: "Mobile Apps", desc: "Android and iOS apps built for speed and quality." },
  { id: "social", title: "Social Media Management", desc: "Content planning, design, publishing, ad campaigns and performance reports." },
];
async function loadServices(env) {
  let list = await loadList(env, "services");
  if (!list) {
    list = DEFAULT_SERVICES;
    await env.DATA.put("services", JSON.stringify(list));
  }
  return list;
}
// المجموعات اللي الأدمن بيديرها: projects (الأعمال) و team (من نحن)
const COLLECTIONS = {
  projects: {
    imageField: "image",
    addToStart: true,
    build(form) {
      const title = cleanText(form.get("title"), 80);
      const desc = cleanText(form.get("desc"), 300);
      if (!title || !desc) return { error: "الاسم والوصف مطلوبين" };
      return { item: { title, desc, link: cleanLink(form.get("link")) } };
    },
  },
  services: {
  imageField: null,
  addToStart: false,
  build(form) {
    const title = cleanText(form.get("title"), 60);
    const desc = cleanText(form.get("desc"), 200);
    if (!title || !desc) return { error: "اسم الخدمة والوصف مطلوبين" };
    return { item: { title, desc } };
  },
},
  team: {
    imageField: "photo",
    addToStart: false,
    build(form) {
     const category = cleanText(form.get("category"), 40);
if (!title || !desc) return { error: "الاسم والوصف مطلوبين" };
if (!category) return { error: "اختار القسم" };
    },
  },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (!pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    // حماية من الطلبات القادمة من مواقع تانية
    if (method !== "GET" && method !== "HEAD") {
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) return json({ error: "forbidden" }, 403);
    }

    // ---------- عام ----------
    const listMatch = pathname.match(/^\/api\/(projects|team|services)$/);
    if (listMatch && method === "GET") {
     if (listMatch[1] === "services") return json({ services: await loadServices(env) });
    }

    const imgMatch = pathname.match(/^\/api\/img\/([a-f0-9-]{36})$/);
    if (imgMatch && method === "GET") {
      const { value, metadata } = await env.DATA.getWithMetadata("img:" + imgMatch[1], "arrayBuffer");
      if (!value) return new Response("Not found", { status: 404 });
      return new Response(value, {
        headers: {
          "Content-Type": metadata?.type || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // ---------- تسجيل الدخول ----------
    if (pathname === "/api/login" && method === "POST") {
      if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD غير مضبوط في Cloudflare" }, 500);
      let body = {};
      try { body = await request.json(); } catch {}
      if (!(await passwordOk(env, body.password))) {
        await new Promise((r) => setTimeout(r, 800));
        return json({ error: "كلمة السر غلط" }, 401);
      }
      const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
      const token = `${exp}.${await hmac(env.ADMIN_PASSWORD, "session:" + exp)}`;
      return json({ ok: true }, 200, {
        "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`,
      });
    }

    if (pathname === "/api/logout" && method === "POST") {
      return json({ ok: true }, 200, {
        "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
      });
    }

    // ---------- من هنا وتحت: أدمن بس ----------
    if (!(await isAdmin(request, env))) return json({ error: "unauthorized" }, 401);

    if (pathname === "/api/me" && method === "GET") return json({ ok: true });
// تعديل اسم/وصف خدمة
const putMatch = pathname.match(/^\/api\/services\/([A-Za-z0-9-]{1,40})$/);
if (putMatch && method === "PUT") {
  let body = {};
  try { body = await request.json(); } catch {}
  const title = cleanText(body.title, 60);
  const desc = cleanText(body.desc, 200);
  if (!title || !desc) return json({ error: "اسم الخدمة والوصف مطلوبين" }, 400);
  const list = await loadServices(env);
  const item = list.find((x) => x.id === putMatch[1]);
  if (!item) return json({ error: "not found" }, 404);
  item.title = title;
  item.desc = desc;
  await env.DATA.put("services", JSON.stringify(list));
  return json({ ok: true, services: list });
}
    if (listMatch && method === "POST") {
      const name = listMatch[1];
      const col = COLLECTIONS[name];
      let form;
      try { form = await request.formData(); } catch { return json({ error: "بيانات غير صالحة" }, 400); }
      const built = col.build(form);
      if (built.error) return json({ error: built.error }, 400);
      if (name === "projects") {
  const services = await loadServices(env);
  if (!services.some((x) => x.id === built.item.category)) return json({ error: "القسم غير موجود" }, 400);
}

      const id = crypto.randomUUID();
      let image = "";
      const file = col.imageField ? form.get("image") : null;
      if (file && typeof file !== "string" && file.size > 0) {
        if (!IMAGE_TYPES.includes(file.type)) return json({ error: "نوع الصورة غير مدعوم (JPG/PNG/WebP/GIF)" }, 400);
        if (file.size > MAX_IMAGE_BYTES) return json({ error: "الصورة أكبر من 2MB" }, 400);
        await env.DATA.put("img:" + id, await file.arrayBuffer(), { metadata: { type: file.type } });
        image = `/api/img/${id}`;
      }

     const list = name === "services" ? await loadServices(env) : (await loadList(env, name)) || [];
     const item = { id, ...built.item, ...(col.imageField ? { [col.imageField]: image } : {}) };
      if (col.addToStart) list.unshift(item);
      else list.push(item);
      await env.DATA.put(name, JSON.stringify(list));
      return json({ ok: true, [name]: list });
    }

    const delMatch = pathname.match(/^\/api\/(projects|team|services)\/([A-Za-z0-9-]{1,40})$/);
    if (delMatch && method === "DELETE") {
      const current = name === "services" ? await loadServices(env) : (await loadList(env, name)) || [];
const list = current.filter((x) => x.id !== id);
      await env.DATA.put(name, JSON.stringify(list));
      await env.DATA.delete("img:" + id);
      return json({ ok: true, [name]: list });
    }

    return json({ error: "not found" }, 404);
  },
};