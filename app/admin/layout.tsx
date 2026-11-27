import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Kernix",
  robots: { index: false, follow: false },
};

// لوحة الإدارة: عربي RTL وخلفية داكنة
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-dark text-white">
      {children}
    </div>
  );
}