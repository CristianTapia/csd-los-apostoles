"use client";

import { Shield } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* MAIN */}
      <div className="flex-1 w-full">
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
        <h3 className="text-font-main dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Resultados Recientes
        </h3>
        <div className="px-4 pb-3">
          <div className="flex flex-col gap-4 rounded-xl bg-foreground text-font-main dark:bg-background-dark/50 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 w-1/3 font-medium">
                <Shield size={34} />
                <span className="text-sm text-center truncate">Nuestro Club</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">2</span>
                <span className="text-xl font-light">-</span>
                <span className="text-3xl font-bold">1</span>
              </div>
              <div className="flex flex-col text-font-secondary items-center gap-2 w-1/3">
                <Shield size={34} />
                <span className="text-sm font-medium text-center truncate dark:text-gray-400">Rivales</span>
              </div>
            </div>
            <div className="text-center text-xs dark:text-gray-400">
              <p>25 de Mayo, 2024</p>
              <p className="font-bold text-button-main">VICTORIA</p>
            </div>
          </div>
        </div>
        <h3 className="text-font-main dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Próximo Partido
        </h3>
        <div className="px-4 pb-3">
          <div className="flex flex-col gap-4 rounded-xl bg-foreground text-font-main dark:bg-background-dark/50 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <Shield size={34} />
                <span className="text-sm font-medium text-center truncate">Nuestro Club</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">VS</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/3 text-font-secondary">
                <Shield size={34} />
                <span className="text-sm font-medium text-center truncate dark:text-gray-400">Rivales</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div className="flex flex-col text-center text-sm text-[#111813] dark:text-white">
              <p>
                <span className="font-bold">Fecha:</span> 1 de Junio, 2024
              </p>
              <p>
                <span className="font-bold">Hora:</span> 17:00
              </p>
              <p>
                <span className="font-bold">Lugar:</span> Mati14
              </p>
              <p>
                <span className="font-bold">Cancha:</span> 1
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
