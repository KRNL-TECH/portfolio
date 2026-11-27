"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// بيظهر المحتوى بحركة لما يدخل الشاشة بالسكرول
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      className={`reveal ${shown ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}