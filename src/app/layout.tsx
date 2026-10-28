import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quero Renovar",
    template: "%s · Quero Renovar",
  },
  description:
    "Descreva a remodelação que quer fazer, divisão a divisão, e perceba o que fazer, quanto poderá custar e quem o pode executar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
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
          <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
            <Link href="/" className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">
              <Image src="/logo.png" alt="Quero Renovar" width={549} height={65} priority className="h-7 w-auto sm:h-8" />
            </Link>
            <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
              Protótipo
            </span>
          </div>
        </header>
        <main id="conteudo" className="flex flex-1 flex-col">
          {children}
        </main>
        <footer className="border-t border-ink-200 bg-white">
          <div className="mx-auto flex w-full max-w-3xl items-start gap-3 px-4 py-6 text-sm text-ink-500">
            <Image src="/simbolo.svg" alt="" width={20} height={20} className="mt-0.5 size-5 shrink-0" />
            <p>
              Quero Renovar · Protótipo em desenvolvimento. Os dados ficam apenas neste dispositivo e nada é enviado sem a
              sua confirmação.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
