"use client"; import { useState, type FormEvent } from "react";
const PHONE = "201000000000"; const EMAIL = "hello@example.com";
export default function Contact() { const [name, setName] = useState(""); const [msg, setMsg] = useState("");
const send = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const text = encodeURIComponent("أنا " + name + "\n" + msg); window.open("https://wa.me/" + PHONE + "?text=" + text, "_blank"); };
return ( <section id="contact" className="px-6 py-20 max-w-2xl mx-auto"> <h2 className="text-3xl font-bold mb-6 text-accent">تواصل معانا</h2>
  <form onSubmit={send} className="space-y-4">
    <input
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="اسمك"
      className="w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none"
    />
    <textarea
      required
      value={msg}
      onChange={(e) => setMsg(e.target.value)}
      placeholder="احكيلنا عن مشروعك"
      rows={4}
      className="w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none"
    />
    <button
      type="submit"
      className="w-full rounded-xl bg-primary py-3 font-semibold"
    >
      ابعت على واتساب
    </button>
  </form>

  <p className="mt-6 text-white/70">
    أو راسلنا على{" "}
    <a className="text-accent" href={"mailto:krnl.tech@outlook.com" + EMAIL}>
      {EMAIL}
    </a>
  </p>

  <a
    href={"https://wa.me/01284755700" + PHONE}
    target="_blank"
    className="fixed bottom-5 left-5 z-50 rounded-full bg-green-500 px-5 py-3 font-semibold shadow-lg"
  >
    واتساب
  </a>
</section>
); }