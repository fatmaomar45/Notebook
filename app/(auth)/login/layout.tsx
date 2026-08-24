import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Becoming Her",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
