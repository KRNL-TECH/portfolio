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

async function loadProjects(env) {
  const raw = await env.DATA.get("projects");
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
    if (pathname === "/api/projects" && method === "GET") {
      return json({ projects: await loadProjects(env) });
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

    if (pathname === "/api/projects" && method === "POST") {
      let form;
      try { form = await request.formData(); } catch { return json({ error: "بيانات غير صالحة" }, 400); }
      const title = cleanText(form.get("title"), 80);
      const desc = cleanText(form.get("desc"), 300);
      const link = cleanLink(form.get("link"));
      if (!title || !desc) return json({ error: "الاسم والوصف مطلوبين" }, 400);

      const id = crypto.randomUUID();
      let image = "";
      const file = form.get("image");
      if (file && typeof file !== "string" && file.size > 0) {
        if (!IMAGE_TYPES.includes(file.type)) return json({ error: "نوع الصورة غير مدعوم (JPG/PNG/WebP/GIF)" }, 400);
        if (file.size > MAX_IMAGE_BYTES) return json({ error: "الصورة أكبر من 2MB" }, 400);
        await env.DATA.put("img:" + id, await file.arrayBuffer(), { metadata: { type: file.type } });
        image = `/api/img/${id}`;
      }

      const projects = (await loadProjects(env)) || [];
      projects.unshift({ id, title, desc, link, image });
      await env.DATA.put("projects", JSON.stringify(projects));
      return json({ ok: true, projects });
    }

    const delMatch = pathname.match(/^\/api\/projects\/([a-f0-9-]{36})$/);
    if (delMatch && method === "DELETE") {
      const id = delMatch[1];
      const projects = ((await loadProjects(env)) || []).filter((p) => p.id !== id);
      await env.DATA.put("projects", JSON.stringify(projects));
      await env.DATA.delete("img:" + id);
      return json({ ok: true, projects });
    }

    return json({ error: "not found" }, 404);
  },
};