"use client";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const NAV = ["EL CLUB", "SOCIOS", "TIENDA", "PLANTEL"];
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col bg-neutral-950 text-white">
      {/* HEADER full-bleed */}
      <header className="w-full bg-amber-700 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          {/* Barra superior */}
          <div className="h-16 flex items-center justify-between">
            <div className="font-bold">LOGO</div>

            {/* NAV desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((label) => (
                <Link key={label} href="#" className="hover:text-black/90">
                  {label}
                </Link>
              ))}
            </nav>

            {/* REDES desktop */}
            <div className="hidden md:flex">REDES</div>

            {/* Hamburguesa mobile */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded hover:bg-black/10"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {/* ícono simple */}
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
                {open ? (
                  <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
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
              {NAV.map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="py-3 px-2 rounded hover:bg-black/10"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 px-2 text-sm/none opacity-90">REDES</div>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN empuja footer */}
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
