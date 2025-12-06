'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Swords, Shield, Zap, Brain, HeartPulse, Wind, Gem, Crown, WandSparkles } from 'lucide-react';
import { type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';
import { simulateCombat, type SimulateCombatInput, type SimulateCombatOutput } from '@/ai/flows/simulate-combat-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function GalleryPage() {
  const [bestiary, setBestiary] = useState<DescribeCreatureOutput[]>([]);
  const [selectedCreature, setSelectedCreature] = useState<DescribeCreatureOutput | null>(null);
  const [combatTarget, setCombatTarget] = useState<DescribeCreatureOutput | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [combatResult, setCombatResult] = useState<SimulateCombatOutput | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedCreatures = JSON.parse(localStorage.getItem('creature-bestiary') || '[]');
      setBestiary(savedCreatures);
    } catch (error) {
      console.error("Error loading creatures from localStorage:", error);
      setBestiary([]);
    }
  }, []);

  const handleSelectContender = (creature: DescribeCreatureOutput) => {
    setSelectedCreature(creature);
    setCombatTarget(null); // Reset target when a new contender is chosen
  }

  const handleSelectOpponent = async (opponent: DescribeCreatureOutput) => {
    if (!selectedCreature) return;

    setIsSimulating(true);
    setCombatTarget(opponent);
    setCombatResult(null);

    try {
      const input: SimulateCombatInput = {
        creature1: selectedCreature,
        creature2: opponent,
      };
      const result = await simulateCombat(input);
      setCombatResult(result);
    } catch (error: any) {
      console.error("Error simulating combat:", error);
      toast({
        variant: "destructive",
        title: "Error de Simulación",
        description: error.message || "No se pudo simular el combate.",
      });
      // Close the dialog on error
      setCombatTarget(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const rarityVariant = (rarity: string) => {
    switch (rarity) {
      case 'Legendario':
      case 'Épico':
        return 'destructive';
      case 'Raro':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (selectedCreature && !combatTarget) {
     return (
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Elige un Oponente</h1>
              <p className="text-muted-foreground">Has seleccionado a <span className="font-bold text-primary">{selectedCreature.nombre}</span>. Ahora, elige a su rival.</p>
            </div>
            <Button onClick={() => setSelectedCreature(null)} variant="outline">
              &larr; Cambiar de Contendiente
            </Button>
          </div>
           {bestiary.filter(c => c.nombre !== selectedCreature.nombre).length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <h2 className="text-2xl font-semibold">No hay oponentes disponibles</h2>
              <p className="text-muted-foreground mt-2">Necesitas al menos dos criaturas en tu bestiario para poder combatir.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestiary.filter(c => c.nombre !== selectedCreature.nombre).map((opponent, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg hover:border-primary/50 transition-all"
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{opponent.nombre}</span>
                      <Badge variant={rarityVariant(opponent.rarity)}>{opponent.rarity}</Badge>
                    </CardTitle>
                     <CardDescription className="flex items-center gap-2 pt-1">
                       <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < opponent.starRating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                            />
                          ))}
                        </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {opponent.narrativeDescription.split('\n')[1] || opponent.narrativeDescription}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleSelectOpponent(opponent)}>
                      <Swords className="mr-2 h-4 w-4" />
                      Luchar contra {opponent.nombre}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Galería y Arena</h1>
            <Link href="/craft">
              <Button>Crear Nueva Criatura</Button>
            </Link>
          </div>

          {bestiary.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <h2 className="text-2xl font-semibold">Tu Bestiario está vacío</h2>
              <p className="text-muted-foreground mt-2">Aún no has guardado ninguna criatura. ¡Ve al taller y crea tu primera bestia!</p>
            </div>
          ) : (
             <div>
              <p className="text-lg text-center text-muted-foreground mb-6">Selecciona una criatura de tu bestiario para ver sus detalles o para iniciar un combate.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestiary.map((creature, index) => (
                  <Card 
                    key={index} 
                    className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{creature.nombre}</span>
                        <Badge variant={rarityVariant(creature.rarity)}>{creature.rarity}</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 pt-1">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < creature.starRating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({creature.starRating} estrellas)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {creature.narrativeDescription.split('\n')[1] || creature.narrativeDescription}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSelectContender(creature)}>
                        <Swords className="mr-2 h-4 w-4" />
                        Seleccionar para Luchar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!combatTarget} onOpenChange={(isOpen) => { if (!isOpen) setCombatTarget(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {selectedCreature?.nombre} vs {combatTarget?.nombre}
            </DialogTitle>
             <DialogDescription className="text-center">La simulación de combate está en curso.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isSimulating && (
              <div className="flex flex-col items-center justify-center gap-4">
                <WandSparkles className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground">La IA está narrando una batalla épica...</p>
              </div>
            )}
            {combatResult && (
               <div className="flex flex-col items-center">
                <Crown className="h-12 w-12 text-yellow-400" />
                <h2 className="text-2xl font-bold mt-4">El ganador es... ¡{combatResult.winnerName}!</h2>
                <ScrollArea className="h-72 w-full rounded-md border p-4 mt-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{combatResult.combatLog}</p>
                </ScrollArea>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
