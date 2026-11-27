"use client";

import { useState, type FormEvent } from "react";
import { EMAIL, WA_LINK } from "@/lib/contact";
import Reveal from "./Reveal";

export default function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = encodeURIComponent("Hi, I'm " + name + "\n" + msg);
    window.open(WA_LINK + "?text=" + text, "_blank");
  };

  const field =
    "w-full rounded-xl border border-line bg-white p-3 text-navy outline-none transition placeholder:text-muted/60 focus:border-cyan focus:ring-4 focus:ring-cyan/15";

  return (
    <>
      <section id="contact" className="mx-auto max-w-2xl px-6 py-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-navy">Contact Us</h2>
          <span className="mt-3 mb-6 block h-1 w-12 rounded bg-cyan" />
          <form onSubmit={send} className="space-y-4">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
            <textarea
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Tell us about your project"
              rows={4}
              className={field}
            />
            <button type="submit" className="w-full rounded-xl bg-navy py-3 font-semibold text-white shadow-lg shadow-navy/20 transition hover:-translate-y-0.5 hover:bg-navy/90">
              Send on WhatsApp
            </button>
          </form>

          <p className="mt-6 text-muted">
            Or email us at{" "}
            <a className="font-semibold text-cyan-dark" href={"mailto:" + EMAIL}>
              {EMAIL}
            </a>
          </p>
        </Reveal>
      </section>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="pulse-ring fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
      >
        WhatsApp
      </a>
    </>
  );
}