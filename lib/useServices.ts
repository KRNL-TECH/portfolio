"use client";

import { useEffect, useState } from "react";
import fallback from "@/data/services.json";

export type Service = { id: string; title: string; desc: string };

// الخدمات بتيجي من الأدمن (/api/services)، والـ json ده احتياطي لحد ما الـ API يرد
export function useServices(): Service[] {
  const [services, setServices] = useState<Service[]>(fallback);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.services)) setServices(d.services);
      })
      .catch(() => {});
  }, []);

  return services;
}