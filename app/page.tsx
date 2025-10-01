export default function Home() {
  return (
    <div>
      <header className="bg-green-900 flex items-center justify-between">
        <div>LOGO</div>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 gap-8">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a className="cursor-pointer flex hover:text-[#000000]" target="_blank" rel="noopener noreferrer">
              EL CLUB
            </a>
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a className="cursor-pointer flex hover:text-[#000000]" target="_blank" rel="noopener noreferrer">
              SOCIOS
            </a>
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a className="cursor-pointer flex hover:text-[#000000]" target="_blank" rel="noopener noreferrer">
              TIENDA
            </a>
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a className="cursor-pointer flex hover:text-[#000000]" target="_blank" rel="noopener noreferrer">
              PLANTEL
            </a>
          </div>
        </nav>
        <div>REDES</div>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">Main</main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">Footer</footer>
    </div>
  );
}
