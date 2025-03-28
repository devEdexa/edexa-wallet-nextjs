// src/app/dashboard/layout.tsx
'use client';

import { AppLayout } from "@/components/layout/AppLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}