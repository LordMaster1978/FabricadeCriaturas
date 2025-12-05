import Link from 'next/link';
import { Cog, Hammer, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MainMenu() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-5">
        <Cog className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 animate-spin-slow text-foreground/10" />
        <Cog className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-spin-medium text-foreground/10" />
        <Cog className="absolute top-1/4 -right-1/4 h-1/3 w-1/3 animate-spin-slow text-foreground/10" />
        <Cog className="absolute bottom-1/4 -left-1/4 h-1/3 w-1/3 animate-spin-medium text-foreground/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Central Fabrication Unit */}
        <div className="relative mb-8 flex items-center justify-center">
          <Cog className="h-48 w-48 animate-spin-slow text-accent/30" />
          <Cog className="absolute h-32 w-32 animate-spin-medium text-accent/50" />
          <Cog className="absolute h-16 w-16 animate-spin-fast text-accent" />
        </div>

        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-primary drop-shadow-[0_0_1rem_hsl(var(--primary)/0.6)]">
          Fábrica de Criaturas
        </h1>
        <p className="mt-2 text-lg text-foreground/70 max-w-md">
          Forja tu leyenda. Pieza por pieza.
        </p>

        <nav className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link href="/craft" passHref>
            <Button size="lg" className="w-64 justify-center bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
              <Hammer className="mr-2 h-5 w-5" />
              Empezar a Crear
            </Button>
          </Link>
          <Link href="/gallery" passHref>
            <Button size="lg" variant="outline" className="w-64 justify-center border-accent/50 text-accent/80 hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Galería
            </Button>
          </Link>
          <Link href="/settings" passHref>
            <Button size="lg" variant="outline" className="w-64 justify-center border-accent/50 text-accent/80 hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105">
              <Cog className="mr-2 h-5 w-5" />
              Ajustes
            </Button>
          </Link>
        </nav>
      </div>
    </main>
  );
}
