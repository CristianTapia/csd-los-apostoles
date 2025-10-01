export default function Home() {
  return (
    <div>
      <header className="bg-green-900">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Botón inicial
            </a>
          </div>
        </nav>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">Main</main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">Footer</footer>
    </div>
  );
}
