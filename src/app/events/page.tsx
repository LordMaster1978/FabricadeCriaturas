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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Hourglass, Zap, Users, Shield, BookOpen, AlertTriangle, WandSparkles } from 'lucide-react';
import { type UniversalEvent, generateUniversalEvent } from '@/ai/flows/generate-universal-event-flow';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EventsPage() {
  const [events, setEvents] = useState<UniversalEvent[]>([]);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadEvents = () => {
    try {
      const savedEvents = JSON.parse(localStorage.getItem('universal-events') || '[]');
      setEvents(savedEvents);
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAdvanceTurn = async (eventId: string) => {
    const eventToAdvance = events.find(e => e.id === eventId);
    if (!eventToAdvance || !eventToAdvance.isActive) return;

    setLoadingEventId(eventId);
    try {
      const result = await generateUniversalEvent({
        creature: eventToAdvance.creature,
        planet: eventToAdvance.planet,
        eventLog: eventToAdvance.eventLog,
        turn: eventToAdvance.turn,
      });

      const updatedEvent = {
        ...eventToAdvance,
        planet: result.updatedPlanetState,
        creature: { ...eventToAdvance.creature, status: result.updatedCreatureStatus },
        eventLog: [...eventToAdvance.eventLog, `Día ${eventToAdvance.turn * 3}: ${result.newLogEntry}`],
        storySummary: result.storySummary,
        turn: eventToAdvance.turn + 1,
        isActive: !result.isEventOver,
      };

      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      localStorage.setItem('universal-events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);

      toast({
        title: `Turno ${updatedEvent.turn} avanzado para ${updatedEvent.creature.nombre}`,
        description: result.newLogEntry,
      });

      if (result.isEventOver) {
         toast({
            variant: "destructive",
            title: "¡El Evento ha Concluido!",
            description: `${eventToAdvance.creature.nombre}'s saga en ${eventToAdvance.planet.name} ha llegado a su fin.`,
         });
      }

    } catch (error: any) {
      console.error('Error advancing turn:', error);
      toast({
        variant: 'destructive',
        title: 'Error de la IA',
        description: 'No se pudo generar el siguiente evento. Inténtalo de nuevo.',
      });
    } finally {
      setLoadingEventId(null);
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Bajo Asedio':
        case 'Colapsado':
            return 'destructive';
        case 'En Pánico':
            return 'default';
        default:
            return 'secondary';
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            <Globe className="h-10 w-10 text-foreground/50" />
            Sucesos Universales
          </h1>
          <Link href="/">
            <Button variant="outline">Volver al Menú</Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <h2 className="text-2xl font-semibold">El Universo está en calma</h2>
            <p className="text-muted-foreground mt-2">
              Aún no has liberado ninguna criatura en un planeta.
            </p>
             <Link href="/gallery" className="mt-4 inline-block">
                <Button>Ir a la Arena</Button>
              </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <Card key={event.id} className="bg-card/50 border-border/50 overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl text-primary">{event.creature.nombre}</CardTitle>
                        <CardDescription>Saga en {event.planet.name} - Desde: {new Date(event.startDate).toLocaleDateString()}</CardDescription>
                    </div>
                     <Badge variant={event.isActive ? 'default': 'destructive'}>{event.isActive ? `Día ${event.turn * 3}` : 'Finalizado'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Resumen de la Situación</AlertTitle>
                        <AlertDescription>{event.storySummary}</AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Planet Stats */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Globe size={18}/> Estado Planetario</h3>
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Población</span>
                                    <span>{event.planet.population.toLocaleString()} / {event.planet.initialPopulation.toLocaleString()}</span>
                                </div>
                                <Progress value={(event.planet.population / event.planet.initialPopulation) * 100} />
                            </div>
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Nivel de Devastación</span>
                                     <span>{event.planet.devastationLevel}%</span>
                                </div>
                                <Progress value={event.planet.devastationLevel} variant="destructive" />
                            </div>
                             <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Estado General:</span>
                                <Badge variant={getStatusVariant(event.planet.status)}>{event.planet.status}</Badge>
                            </div>
                        </div>
                        {/* Creature Stats */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Shield size={18}/> Estado de la Criatura</h3>
                             <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Salud:</span>
                                <Badge variant={event.creature.status === 'Herida' || event.creature.status === 'Muriendo' ? 'destructive' : 'secondary'}>{event.creature.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Temperamento:</span>
                                <span className="font-semibold">{event.creature.temperamento}</span>
                            </div>
                             <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Rareza:</span>
                                <span className="font-semibold">{event.creature.rarity}</span>
                            </div>
                        </div>
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="log">
                        <AccordionTrigger className="text-base">
                            <div className="flex items-center gap-2">
                                <BookOpen size={18}/> Ver Crónica de Sucesos
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/20">
                             <ul className="space-y-4">
                                {event.eventLog.map((log, i) => (
                                    <li key={i} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">{log}</li>
                                ))}
                            </ul>
                           </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAdvanceTurn(event.id)}
                    disabled={!event.isActive || loadingEventId === event.id}
                    className="w-full"
                  >
                     {loadingEventId === event.id ? (
                        <><WandSparkles className="h-4 w-4 mr-2 animate-spin"/> Generando Suceso...</>
                     ) : (
                        <><Hourglass className="h-4 w-4 mr-2"/> Avanzar 3 Días</>
                     )}
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
