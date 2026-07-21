import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Loom — прозрачное управление отходами",
  description:
    "Loom делает путь мусора видимым: ИИ-сортировка и живой трекинг вывоза для Уральска",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-ivory text-codium antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
