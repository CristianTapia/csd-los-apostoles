import type { ReactNode } from "react";
import { siInstagram, siTiktok, siWhatsapp, siYoutube } from "simple-icons/icons";
import Navbar from "@/app/ui/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh flex-col">
        <header className="w-full bg-background text-font-main">
          <div className="mx-auto max-w-7xl px-4">
            <Navbar />
          </div>
        </header>

        <main className="flex-1">
          <div className="px-4 md:px-0">{children}</div>
        </main>

        <footer className="mt-8 border-t border-gray-200 bg-background px-4 py-8 dark:border-gray-700">
          <div className="mb-4 flex justify-center gap-6 text-font-main">
            <a className="dark:text-white" aria-label="WhatsApp" href="#">
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siWhatsapp.path} />
              </svg>
            </a>
            <a className="dark:text-white" aria-label="Instagram" href="#">
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siInstagram.path} />
              </svg>
            </a>
            <a className="dark:text-white" aria-label="TikTok" href="#">
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siTiktok.path} />
              </svg>
            </a>
            <a className="dark:text-white" aria-label="YouTube" href="#">
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siYoutube.path} />
              </svg>
            </a>
          </div>
          <div className="text-center text-sm text-font-secondary dark:text-gray-400">
            <p>csdlosapostoles@gmail.com</p>
            <p>2025 Club de Futbol Amateur. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
