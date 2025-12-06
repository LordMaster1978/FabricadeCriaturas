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
  CardFooter,
} from '@/components/ui/card';
import { Skull, Star, Award } from 'lucide-react';
import { type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const getLegacyTitle = (wins: number): string => {
  if (wins >= 1000) return "Criatura Universal";
  if (wins >= 100) return "El Fin de los Tiempos";
  if (wins >= 80) return "Calamidad Cósmica";
  if (wins >= 70) return "Avatar de la Destrucción";
  if (wins >= 60) return "Leyenda Inmortal";
  if (wins >= 50) return "Singularidad Combativa";
  if (wins >= 40) return "Fuerza de la Naturaleza";
  if (wins >= 35) return "Entidad Primordial";
  if (wins >= 30) return "Icono Cósmico";
  if (wins >= 25) return "Mito Universal";
  if (wins >= 20) return "Demiurgo del Caos";
  if (wins >= 16) return "Señor de las Bestias";
  if (wins >= 13) return "Señor de la Guerra";
  if (wins >= 10) return "Héroe Legendario";
  if (wins >= 8) return "Conquistador Implacable";
  if (wins >= 6) return "Maestro de la Arena";
  if (wins >= 5) return "Campeón de Fosos";
  if (wins >= 4) return "Gladiador de Renombre";
  if (wins >= 3) return "Luchador Veterano";
  if (wins >= 2) return "Superviviente de la Arena";
  if (wins >= 1) return "Contendiente";
  return "Carne de Cañón";
};


export default function CemeteryPage() {
  const [fallen, setFallen] = useState<DescribeCreatureOutput[]>([]);

  useEffect(() => {
    try {
      const allCreatures = JSON.parse(
        localStorage.getItem('creature-bestiary') || '[]'
      );
      setFallen(allCreatures.filter((c: DescribeCreatureOutput) => c.status === 'Muerto'));
    } catch (error) {
      console.error('Error loading fallen creatures from localStorage:', error);
      setFallen([]);
    }
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            <Skull className="h-10 w-10 text-foreground/50" />
            Cementerio de Criaturas
          </h1>
          <Link href="/">
            <Button variant="outline">Volver al Menú</Button>
          </Link>
        </div>

        {fallen.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <h2 className="text-2xl font-semibold">El Cementerio está en calma</h2>
            <p className="text-muted-foreground mt-2">
              Aún no ha caído ninguna criatura en combate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallen.map((creature, index) => (
              <Card
                key={index}
                className="flex flex-col bg-card/50 border-border/50"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-start text-muted-foreground">
                    <span>{creature.nombre}</span>
                    <Skull className="h-5 w-5" />
                  </CardTitle>
                   <CardDescription className="flex items-center gap-2 pt-2">
                     <Award className="h-4 w-4 text-primary"/>
                     <span className="font-semibold text-primary">{getLegacyTitle(creature.wins || 0)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-semibold text-sm mb-1">Causa de la Muerte</h4>
                    <p className="text-xs text-muted-foreground italic">
                      "{creature.deathCause || 'Caído en combate.'}"
                    </p>
                  </div>
                   <div className="flex justify-around text-center text-xs">
                    <div>
                      <p className="font-bold text-lg">{creature.wins}</p>
                      <p className="text-muted-foreground">Victorias</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{creature.losses}</p>
                      <p className="text-muted-foreground">Derrotas</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Ver Historial de Combate</AccordionTrigger>
                        <AccordionContent>
                           {creature.combatHistory && creature.combatHistory.length > 0 ? (
                            <ul className="space-y-2 text-xs">
                              {creature.combatHistory.map((fight, i) => (
                                <li key={i} className={`p-2 rounded-md ${fight.result === 'victoria' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                                  <span className={`font-bold ${fight.result === 'victoria' ? 'text-primary' : 'text-destructive'}`}>{fight.result.toUpperCase()}</span> vs {fight.opponentName} en {fight.battlefieldName}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground">Sin combates registrados.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
