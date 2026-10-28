import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quer Renovar",
    template: "%s · Quer Renovar",
  },
  description:
    "Descreva a remodelação que quer fazer, divisão a divisão, e perceba o que fazer, quanto poderá custar e quem o pode executar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Saltar para o conteúdo
        </a>
        <header className="border-b border-ink-200 bg-white">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-ink-900">
              Quer<span className="text-brand-600">Renovar</span>
            </Link>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
              Versão de desenvolvimento
            </span>
          </div>
        </header>
        <main id="conteudo" className="flex flex-1 flex-col">
          {children}
        </main>
        <footer className="border-t border-ink-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-ink-500">
            Quer Renovar · Protótipo em desenvolvimento. Os dados ficam apenas neste dispositivo e nada é enviado sem a sua
            confirmação.
          </div>
        </footer>
      </body>
    </html>
  );
}
