"use client";
import { useState } from "react";
import { siInstagram, siTiktok, siWhatsapp, siYoutube } from "simple-icons";
import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const nav = ["EL CLUB", "SOCIOS", "TIENDA", "PLANTEL"];
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* HEADER */}
      <header className="w-full bg-background text-font-main">
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

            {/* Nombre desktop */}
            <div className="flex text-center md:hidden gap-4 font-bold">CSD Los Apóstoles</div>

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
        <div className="px-4 md:px-0">
          <div className="relative w-full h-[320px] md:h-[480px] lg:h-[560px] overflow-hidden rounded-xl">
            <Image src="/images/inicio.jpg" alt="Portada del club" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center px-4">
              <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] min-[480px]:text-5xl">
                ¡Bienvenidos a Nuestro Club!
              </h2>
              <p className="text-sm min-[480px]:text-base mb-4">Pasión, esfuerzo y comunidad.</p>
              <button className="flex px-4 p-2 min-w-[84px] max-w-[480px] items-center justify-center rounded-lg bg-button-main text-font-main text-sm font-bold min-[480px]:h-12 min-[480px]:px-5 min-[480px]:text-base">
                <span className="truncate">Hazte Socio</span>
              </button>
            </div>
          </div>
        </div>
        <h3 className="text-[#111813] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Resultados Recientes
        </h3>
        <div className="px-4 pb-3">
          <div className="flex flex-col gap-4 rounded-xl bg-foreground text-font-main dark:bg-background-dark/50 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 w-1/3 font-medium">
                <Shield />
                <span className="text-sm text-center truncate">Nuestro Club</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">2</span>
                <span className="text-xl font-light">-</span>
                <span className="text-3xl font-bold">1</span>
              </div>
              <div className="flex flex-col text-font-secondary items-center gap-2 w-1/3">
                <Shield />
                <span className="text-sm font-medium text-center truncate text-gray-500 dark:text-gray-400">
                  CF Rivales
                </span>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>25 de Mayo, 2024</p>
              <p className="font-bold text-primary">VICTORIA</p>
            </div>
          </div>
        </div>
        <h3 className="text-[#111813] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Próximo Partido
        </h3>
        <div className="px-4 pb-3">
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-background-dark/50 shadow-[0_0_4px_rgba(0,0,0,0.1)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <span className="material-symbols-outlined text-4xl text-[#111813] dark:text-white">shield</span>
                <span className="text-sm font-medium text-center truncate">Nuestro Club</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">VS</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                <span className="material-symbols-outlined text-4xl text-gray-400">shield</span>
                <span className="text-sm font-medium text-center truncate text-gray-500 dark:text-gray-400">
                  Atético Vecino
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div className="text-center text-sm text-[#111813] dark:text-white">
              <p>
                <span className="font-bold">Fecha:</span> 1 de Junio, 2024
              </p>
              <p>
                <span className="font-bold">Hora:</span> 17:00
              </p>
              <p>
                <span className="font-bold">Lugar:</span> Estadio Municipal
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-background-light dark:bg-background-dark mt-8 px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-6 mb-4">
          <a className="text-[#111813] dark:text-white" data-alt="Facebook icon" href="#">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                // clip-rule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                // fill-rule="evenodd"
              ></path>
            </svg>
          </a>
          <a className="text-[#111813] dark:text-white" data-alt="Instagram icon" href="#">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                // clip-rule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.792 2.792c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808a6.78 6.78 0 01-.465 2.427 4.902 4.902 0 01-2.792 2.792 6.78 6.78 0 01-2.427.465c-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06a6.78 6.78 0 01-2.427-.465 4.902 4.902 0 01-2.792-2.792 6.78 6.78 0 01-.465-2.427c-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808a6.78 6.78 0 01.465-2.427 4.902 4.902 0 012.792-2.792A6.78 6.78 0 018.507 2.06C9.531 2.013 9.885 2 12.315 2zm0 1.623c-2.403 0-2.72.01-3.667.058a5.14 5.14 0 00-2.2.465 3.275 3.275 0 00-1.845 1.845 5.14 5.14 0 00-.465 2.2c-.048.947-.058 1.264-.058 3.667s.01 2.72.058 3.667a5.14 5.14 0 00.465 2.2 3.275 3.275 0 001.845 1.845 5.14 5.14 0 002.2.465c.947.048 1.264.058 3.667.058s2.72-.01 3.667-.058a5.14 5.14 0 002.2-.465 3.275 3.275 0 001.845-1.845 5.14 5.14 0 00.465-2.2c.048-.947.058-1.264.058-3.667s-.01-2.72-.058-3.667a5.14 5.14 0 00-.465-2.2 3.275 3.275 0 00-1.845-1.845 5.14 5.14 0 00-2.2-.465C15.035 3.633 14.715 3.623 12.315 3.623zM12 8.118a4.22 4.22 0 100 8.44 4.22 4.22 0 000-8.44zm0 6.812a2.592 2.592 0 110-5.184 2.592 2.592 0 010 5.184zM16.95 6.402a1.238 1.238 0 100 2.475 1.238 1.238 0 000-2.475z"
                // fill-rule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>info@clubdefutbol.com</p>
          <p>© 2024 Club de Fútbol Amateur. Todos los derechos reservados.</p>
        </div>
      </footer>
      {/* FOOTER
      <footer className="w-full border-t border-white/10 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm">Footer</div>
      </footer> */}
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
