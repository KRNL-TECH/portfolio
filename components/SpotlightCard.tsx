"use client";

import type { ReactNode } from "react";

// كارت بيلمع مكان الماوس ويرتفع شوية عند الهوفر
export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`spot ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}