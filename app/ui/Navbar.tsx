"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const nav = [
  { label: "EL CLUB", href: "#" },
  { label: "SOCIOS", href: "#" },
  { label: "TIENDA", href: "#" },
  { label: "PLANTEL", href: "#" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="h-16 flex items-center justify-between">
        <div className="font-bold">LOGO</div>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-black/90">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex text-center md:hidden gap-4 font-bold">CSD Los Apostoles</div>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded hover:bg-black/10"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{open ? "Cerrar menu" : "Abrir menu"}</span>

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

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-64" : "max-h-0"}`}
      >
        <nav className="flex flex-col py-2 gap-1">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="py-3 px-2 rounded hover:bg-black/10"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
