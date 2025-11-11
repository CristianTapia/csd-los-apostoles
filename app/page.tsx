"use client";
import { useState } from "react";
import { siInstagram, siTiktok, siWhatsapp, siYoutube } from "simple-icons";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const nav = ["EL CLUB", "SOCIOS", "TIENDA", "PLANTEL"];
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--background)] text-white">
      {/* HEADER */}
      <header className="w-full bg-[var(--background)] text-[var(--font-main)]">
        <div className="mx-auto max-w-7xl px-4">
          {/* Barra superior */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="font-bold">LOGO</div>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {nav.map((label) => (
                <Link key={label} href="#" className="hover:text-black/90">
                  {label}
                </Link>
              ))}
            </nav>

            {/* Redes sociales desktop */}
            <div className="flex md:flex gap-4 font-bold">CSD Los Apóstoles akfjhas askd</div>

            {/* Hamburguesa mobile */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded hover:bg-black/10"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>

              <span className="relative h-6 w-6">
                <Menu
                  className={`absolute inset-0 w-5 transition-opacity duration-150 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-opacity duration-150 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Panel mobile (colapsable) */}
          <div
            id="mobile-menu"
            className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
              open ? "max-h-64" : "max-h-0"
            }`}
          >
            <nav className="flex flex-col py-2 gap-1">
              {nav.map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="py-3 px-2 rounded hover:bg-black/10"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
          Main
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm">Footer</div>
      </footer>
    </div>
  );
}

// RRSS
{
  /* <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siWhatsapp.path} />
              </svg>
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siInstagram.path} />
              </svg>
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siTiktok.path} />
              </svg>
              <svg className="h-5 w-5 hover:text-black/90" viewBox="0 0 24 24" fill="currentColor">
                <path d={siYoutube.path} />
              </svg> */
}
