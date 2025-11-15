"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const nav = ["EL CLUB", "SOCIOS", "TIENDA", "PLANTEL"];
  const [open, setOpen] = useState(false);
  return (
    <div>
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
              className={`cursor-pointer absolute inset-0 w-5 transition-opacity duration-150 ${
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
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-64" : "max-h-0"}`}
      >
        <nav className="flex flex-col py-2 gap-1">
          {nav.map((label) => (
            <Link key={label} href="#" className="py-3 px-2 rounded hover:bg-black/10" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>{" "}
    </div>
  );
}
