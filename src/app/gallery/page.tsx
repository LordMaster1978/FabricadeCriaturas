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
import { Star, Swords, Globe, Ticket, CircleDollarSign, Trophy, HeartPulse, Skull, Rocket } from 'lucide-react';
import { type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';
import { simulateCombat, type SimulateCombatInput } from '@/ai/flows/simulate-combat-flow';
import { type UniversalEvent, type PlanetState } from '@/ai/flows/universal-event-types';
import { generatePlanet } from '@/ai/flows/generate-planet-flow';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { WandSparkles } from 'lucide-react';

const battlefields = [
  { name: "Jungla Frondosa", description: "Un entorno denso y húmedo con árboles altos, lianas y poca visibilidad. Favorece la agilidad, el sigilo y a las criaturas adaptadas a la vegetación." },
  { name: "Desierto Volcánico", description: "Un paisaje árido de ceniza y roca afilada, con ríos de lava y aire caliente y sulfuroso. Ideal para criaturas de fuego o resistentes al calor. Perjudicial para las de hielo o agua." },
  { name: "Tundra Congelada", description: "Una vasta llanura de nieve y hielo, con vientos helados constantes. Las criaturas de hielo tienen ventaja. El frío extremo puede ralentizar a las demás." },
  { name: "Pantano Nocivo", description: "Aguas estancadas, terreno fangoso y miasmas tóxicas en el aire. Las criaturas anfibias, de veneno o con alta resistencia se desenvuelven bien. El movimiento es difícil." },
  { name: "Ruinas Arcanas", description: "Los restos de una ciudad mágica flotante. Hay fragmentos de energía mágica inestable en el aire y estructuras rotas que ofrecen cobertura. Favorece a criaturas inteligentes o mágicas." },
  { name: "Planeta sin Atmósfera", description: "Superficie de un planetoide rocoso en el vacío. No hay aire, ni sonido. La gravedad es baja. Solo criaturas que no necesitan respirar o están adaptadas al vacío pueden sobrevivir." },
];

const planets: (PlanetState & { type: 'real' | 'ia' })[] = [
  {
    name: 'Tierra',
    population: 7800000000,
    initialPopulation: 7800000000,
    demographics: { infants: 1000000000, children: 1500000000, adolescents: 1200000000, adults: 3000000000, elderly: 1100000000 },
    devastationLevel: 0,
    description: 'Un planeta de tipo terrestre con una civilización tecnológica de nivel medio-alto, ecosistemas diversos y una población masiva concentrada en megaciudades.',
    status: 'Estable',
    type: 'real'
  },
  {
    name: 'Marte',
    population: 0,
    initialPopulation: 0,
    demographics: { infants: 0, children: 0, adolescents: 0, adults: 0, elderly: 0 },
    devastationLevel: 0,
    description: 'Un planeta desértico y frío con una atmósfera delgada de dióxido de carbono. La superficie está cubierta de óxido de hierro, dándole su característico color rojo. Sin vida conocida.',
    status: 'Estable',
    type: 'real'
  },
  {
    name: 'Venus',
    population: 0,
    initialPopulation: 0,
    demographics: { infants: 0, children: 0, adolescents: 0, adults: 0, elderly: 0 },
    devastationLevel: 0,
    description: 'Un infierno tóxico. Su atmósfera es densa y está compuesta de dióxido de carbono con nubes de ácido sulfúrico. La presión en la superficie es 90 veces la de la Tierra y la temperatura promedio es de 465°C.',
    status: 'Estable',
    type: 'real'
  },
   {
    name: 'Europa (luna de Júpiter)',
    population: 0,
    initialPopulation: 0,
    demographics: { infants: 0, children: 0, adolescents: 0, adults: 0, elderly: 0 },
    devastationLevel: 0,
    description: 'Una luna helada con una superficie de hielo de agua, pero con un vasto océano de agua líquida debajo. Es el lugar más prometedor para encontrar vida extraterrestre. La superficie es bombardeada por la radiación de Júpiter.',
    status: 'Estable',
    type: 'real'
  },
];


export default function GalleryPage() {
  const [bestiary, setBestiary] = useState<DescribeCreatureOutput[]>([]);
  const [selectedCreature, setSelectedCreature] = useState<DescribeCreatureOutput | null>(null);
  const [opponent, setOpponent] = useState<DescribeCreatureOutput | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [capital, setCapital] = useState(1000);
  const [selectedPlanet, setSelectedPlanet] = useState<string>(planets[0].name);
  const [isGeneratingPlanet, setIsGeneratingPlanet] = useState(false);


  const [isSimulating, setIsSimulating] = useState(false);
  const [combatResult, setCombatResult] = useState<any | null>(null);
  const [combatDetails, setCombatDetails] = useState<{
    creature1: DescribeCreatureOutput;
    creature2: DescribeCreatureOutput;
    battlefield: typeof battlefields[0];
  } | null>(null);
  const [activeEvents, setActiveEvents] = useState<UniversalEvent[]>([]);

  const { toast } = useToast();

  const loadData = () => {
    try {
      const savedCreatures = JSON.parse(localStorage.getItem('creature-bestiary') || '[]');
      const savedEvents = JSON.parse(localStorage.getItem('universal-events') || '[]');
      const savedCapital = localStorage.getItem('player-capital');
      
      setBestiary(savedCreatures.sort((a: DescribeCreatureOutput, b: DescribeCreatureOutput) => (b.wins || 0) - (a.wins || 0)));
      setActiveEvents(savedEvents);

      if (savedCapital) {
        setCapital(parseInt(savedCapital, 10));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setBestiary([]);
      setActiveEvents([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isCreatureInActiveEvent = (creatureName: string) => {
    return activeEvents.some(event => event.creature.nombre === creatureName && event.isActive);
  };
  
  const isPlanetOccupied = (planetName: string) => {
    return activeEvents.some(event => event.planet.name === planetName && event.isActive);
  }

  const handleSelectContender = (creature: DescribeCreatureOutput) => {
    if (isCreatureInActiveEvent(creature.nombre)) {
      toast({
        variant: "destructive",
        title: "Criatura ocupada",
        description: `"${creature.nombre}" está actualmente en un evento universal activo y no puede combatir.`,
      });
      return;
    }
     if (creature.status !== 'Saludable') {
      toast({
        variant: "destructive",
        title: "No se puede luchar",
        description: `"${creature.nombre}" está ${creature.status} y no puede combatir.`,
      });
      return;
    }
    setSelectedCreature(creature);
    setOpponent(null);
  }

  const handleSelectOpponent = (opponentCreature: DescribeCreatureOutput) => {
    if (!selectedCreature) return;
    if (isCreatureInActiveEvent(opponentCreature.nombre)) {
      toast({
        variant: "destructive",
        title: "Oponente ocupado",
        description: `"${opponentCreature.nombre}" está actualmente en un evento universal activo.`,
      });
      return;
    }
     if (opponentCreature.status !== 'Saludable') {
      toast({
        variant: "destructive",
        title: "Oponente no disponible",
        description: `"${opponentCreature.nombre}" está ${opponentCreature.status} y no puede combatir.`,
      });
      return;
    }
    const randomBattlefield = battlefields[Math.floor(Math.random() * battlefields.length)];
    setCombatDetails({
      creature1: selectedCreature,
      creature2: opponentCreature,
      battlefield: randomBattlefield,
    });
    setOpponent(opponentCreature);
    setCombatResult(null);
  }

  const handleStartCombat = async () => {
    if (!combatDetails || betAmount <= 0 || betAmount > capital) {
      toast({
        variant: "destructive",
        title: "Apuesta inválida",
        description: "El monto de la apuesta debe ser mayor que cero y no puede exceder tu capital.",
      });
      return;
    }
    
    setIsSimulating(true);

    try {
      const input: SimulateCombatInput = {
        creature1: combatDetails.creature1,
        creature2: combatDetails.creature2,
        battlefield: combatDetails.battlefield,
      };
      const result = await simulateCombat(input);
      setCombatResult(result);
      
      const creature1Name = combatDetails.creature1.nombre;
      const creature2Name = combatDetails.creature2.nombre;

      let newCapital = capital;

      const updatedBestiary = bestiary.map(c => {
        let creature = {...c};
        
        if (creature.nombre === creature1Name) {
            creature.combatHistory = [...(creature.combatHistory || []), { opponentName: creature2Name, result: result.creature1_outcome.outcome, battlefieldName: combatDetails.battlefield.name }];
            if (result.creature1_outcome.outcome === 'victoria') {
                creature.wins = (creature.wins || 0) + 1;
                newCapital += betAmount; 
                toast({ title: "¡Victoria!", description: `Has ganado ${betAmount}€.` });
            } else {
                creature.losses = (creature.losses || 0) + 1;
                newCapital -= betAmount;
                toast({ variant: "destructive", title: "Derrota", description: `Has perdido ${betAmount}€.` });
            }

            if(result.creature1_outcome.outcome === 'muerte') {
                creature.status = 'Muerto';
                creature.deathCause = result.creature1_outcome.description;
            }
             if(result.creature1_outcome.outcome === 'herido') creature.status = 'Herido';

        } else if (creature.nombre === creature2Name) {
            creature.combatHistory = [...(creature.combatHistory || []), { opponentName: creature1Name, result: result.creature2_outcome.outcome, battlefieldName: combatDetails.battlefield.name }];
             if (result.creature2_outcome.outcome === 'victoria') {
                creature.wins = (creature.wins || 0) + 1;
            } else {
                creature.losses = (creature.losses || 0) + 1;
            }

            if(result.creature2_outcome.outcome === 'muerte') {
                creature.status = 'Muerto';
                creature.deathCause = result.creature2_outcome.description;
            }
            if(result.creature2_outcome.outcome === 'herido') creature.status = 'Herido';
        }
        return creature;
      });
      
      const finalCapital = Math.round(newCapital);
      setCapital(finalCapital);
      localStorage.setItem('player-capital', finalCapital.toString());
      localStorage.setItem('creature-bestiary', JSON.stringify(updatedBestiary));
      setBestiary(updatedBestiary);
      loadData();

    } catch (error: any) {
      console.error("Error simulating combat:", error);
      toast({
        variant: "destructive",
        title: "Error de Simulación",
        description: error.message || "No se pudo simular el combate.",
      });
      setOpponent(null);
    } finally {
      setIsSimulating(false);
    }
  }


  const handleReleaseCreature = async (creature: DescribeCreatureOutput) => {
    let planetData: PlanetState | undefined;

    if (selectedPlanet === 'ia-generated') {
      setIsGeneratingPlanet(true);
      try {
        planetData = await generatePlanet();
        toast({
          title: "¡Nuevo Mundo Descubierto!",
          description: `La IA ha generado el planeta: ${planetData.name}. ${planetData.description}`,
        });
      } catch (error: any) {
        console.error('Error generating planet:', error);
        toast({ variant: 'destructive', title: 'Error de la IA', description: 'No se pudo generar un nuevo planeta.' });
        setIsGeneratingPlanet(false);
        return;
      } finally {
        setIsGeneratingPlanet(false);
      }
    } else {
      planetData = planets.find(p => p.name === selectedPlanet);
    }

    if (!planetData) {
      toast({ variant: 'destructive', title: 'Planeta no encontrado' });
      return;
    }
    
    try {
        const existingEvents = JSON.parse(localStorage.getItem('universal-events') || '[]');
        
        const inactiveEventIndex = existingEvents.findIndex((e: UniversalEvent) => e.creature.nombre === creature.nombre && !e.isActive);

        if (inactiveEventIndex !== -1) {
            existingEvents[inactiveEventIndex] = {
                ...existingEvents[inactiveEventIndex],
                planet: planetData,
                isActive: true,
                turn: 1,
                eventLog: [`Tras su saga anterior, "${creature.nombre}" viaja a un nuevo mundo: ${planetData.name}. La odisea continúa.`],
                storySummary: `"${creature.nombre}" ha llegado a ${planetData.name}, un mundo que no sospecha la magnitud de la leyenda que acaba de aterrizar.`,
                startDate: new Date().toISOString(),
            };
            localStorage.setItem('universal-events', JSON.stringify(existingEvents));
            toast({
                title: '¡Saga Continuada!',
                description: `${creature.nombre} ha comenzado un nuevo capítulo en ${planetData.name}.`,
            });
        } else {
            const newEvent: UniversalEvent = {
                id: creature.nombre + new Date().toISOString(),
                creature: { ...creature, status: 'Activa' },
                planet: planetData,
                eventLog: [`La criatura "${creature.nombre}" ha sido liberada en ${planetData.name}. El universo contiene la respiración.`],
                storySummary: `"${creature.nombre}" acaba de llegar a ${planetData.name}, un mundo desprevenido de la nueva presencia en su ecosistema.`,
                turn: 1,
                isActive: true,
                startDate: new Date().toISOString(),
            };
            existingEvents.push(newEvent);
            localStorage.setItem('universal-events', JSON.stringify(existingEvents));
            toast({
                title: '¡Criatura Liberada!',
                description: `${creature.nombre} ha comenzado su saga en ${planetData.name}. ¡Ve a Eventos Universales para seguir su historia!`,
            });
        }
        
        const updatedBestiary = bestiary.map(c => c.nombre === creature.nombre ? { ...c, status: 'Activa' } : c);
        localStorage.setItem('creature-bestiary', JSON.stringify(updatedBestiary));
        
        loadData();

    } catch (error) {
      console.error('Error releasing creature:', error);
      toast({ variant: 'destructive', title: 'Error al liberar la criatura' });
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
  
  const statusIcon = (status?: string) => {
    switch (status) {
      case 'Herido':
        return <HeartPulse className="h-4 w-4 text-destructive" title="Herido"/>;
      case 'Muerto':
        return <Skull className="h-4 w-4 text-muted-foreground" title="Muerto"/>;
      case 'Activa':
        return <Globe className="h-4 w-4 text-blue-400" title="Activa en un Evento Universal"/>;
      default:
        return null;
    }
  }

  const resetSelection = () => {
    setSelectedCreature(null);
    setOpponent(null);
    setCombatResult(null);
    setCombatDetails(null);
    setIsSimulating(false);
    loadData();
  }

  if (selectedCreature && !opponent) {
     return (
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Elige un Oponente</h1>
              <p className="text-muted-foreground">Has seleccionado a <span className="font-bold text-primary">{selectedCreature.nombre}</span>. Ahora, elige a su rival.</p>
            </div>
            <Button onClick={resetSelection} variant="outline">
              &larr; Volver al Ranking
            </Button>
          </div>
           {bestiary.filter(c => c.nombre !== selectedCreature.nombre && c.status === 'Saludable' && !isCreatureInActiveEvent(c.nombre)).length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <h2 className="text-2xl font-semibold">No hay oponentes disponibles</h2>
              <p className="text-muted-foreground mt-2">Necesitas al menos dos criaturas saludables y que no estén en eventos para poder combatir.</p>
              <Link href="/craft" className="mt-4 inline-block">
                <Button>Crear otra criatura</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestiary.filter(c => c.nombre !== selectedCreature.nombre && c.status === 'Saludable' && !isCreatureInActiveEvent(c.nombre)).map((opp, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => handleSelectOpponent(opp)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{opp.nombre}</span>
                      <Badge variant={rarityVariant(opp.rarity)}>{opp.rarity}</Badge>
                    </CardTitle>
                     <CardDescription className="flex items-center gap-2 pt-1">
                       <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < opp.starRating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                            />
                          ))}
                        </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex justify-around text-center mb-4">
                        <div>
                            <p className="font-bold text-lg">{opp.wins || 0}</p>
                            <p className="text-xs text-muted-foreground">Victorias</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{opp.losses || 0}</p>
                            <p className="text-xs text-muted-foreground">Derrotas</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {opp.narrativeDescription.split('\n')[1] || opp.narrativeDescription}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Swords className="mr-2 h-4 w-4" />
                      Luchar contra {opp.nombre}
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
        <div className="w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">Ranking y Arena</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-foreground/70" />
                <span className="text-foreground/90 font-semibold">{capital.toLocaleString('es-ES')} €</span>
              </div>
              <Link href="/craft">
                <Button>Crear Nueva Criatura</Button>
              </Link>
            </div>
          </div>

          {bestiary.filter(c => c.status !== 'Muerto').length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <h2 className="text-2xl font-semibold">Tu Bestiario está vacío</h2>
              <p className="text-muted-foreground mt-2">Aún no has guardado ninguna criatura. ¡Ve al taller y crea tu primera bestia!</p>
            </div>
          ) : (
             <div>
              <p className="text-lg text-center text-muted-foreground mb-6">Selecciona una criatura para ver sus detalles, iniciar un combate o una odisea universal.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bestiary.filter(c => c.status !== 'Muerto').map((creature, index) => {
                  const isInEvent = isCreatureInActiveEvent(creature.nombre);
                  const canContinueSaga = !isInEvent && activeEvents.some(e => e.creature.nombre === creature.nombre);

                  return (
                  <Card 
                    key={index} 
                    className={cn(
                        "flex flex-col hover:shadow-lg transition-all relative",
                         isInEvent || creature.status !== 'Saludable' ? "bg-muted/30 border-dashed" : "hover:border-primary/50"
                    )}
                  >
                    {index === 0 && (
                      <div className="absolute -top-3 -left-3 transform -rotate-12">
                        <Trophy className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className={cn(isInEvent || creature.status !== 'Saludable' && "text-muted-foreground")}>{creature.nombre}</span>
                        <div className="flex items-center gap-2">
                          {statusIcon(isInEvent ? 'Activa' : creature.status)}
                          <Badge variant={rarityVariant(creature.rarity)}>{creature.rarity}</Badge>
                        </div>
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
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div className="flex justify-around text-center">
                        <div>
                            <p className="font-bold text-lg">{creature.wins || 0}</p>
                            <p className="text-xs text-muted-foreground">Victorias</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{creature.losses || 0}</p>
                            <p className="text-xs text-muted-foreground">Derrotas</p>
                        </div>
                      </div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="history">
                          <AccordionTrigger className="text-xs py-2">Historial de Combate</AccordionTrigger>
                          <AccordionContent>
                            {creature.combatHistory && creature.combatHistory.length > 0 ? (
                               <ScrollArea className="h-24">
                                <ul className="space-y-2 text-xs pr-4">
                                  {creature.combatHistory.slice().reverse().map((fight, i) => (
                                    <li key={i} className={cn("p-2 rounded-md", fight.result === 'victoria' ? 'bg-primary/10' : 'bg-destructive/10')}>
                                      <span className={cn("font-bold", fight.result === 'victoria' ? 'text-primary' : 'text-destructive')}>{fight.result.toUpperCase()}</span> vs {fight.opponentName}
                                    </li>
                                  ))}
                                </ul>
                              </ScrollArea>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">Sin combates registrados.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                     <CardFooter className="flex-col gap-2 items-stretch">
                       <Button className="w-full" onClick={() => handleSelectContender(creature)} disabled={creature.status !== 'Saludable' || isInEvent}>
                        <Swords className="mr-2 h-4 w-4" />
                        Seleccionar para Luchar
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="secondary" className="w-full" disabled={isInEvent}>
                             {canContinueSaga ? <Rocket className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
                             {canContinueSaga ? 'Continuar Saga' : 'Liberar en Planeta'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{canContinueSaga ? 'Continuar Odisea Universal' : 'Confirmar Liberación Universal'}</DialogTitle>
                            <DialogDescription>
                              {canContinueSaga 
                                ? `La saga de "${creature.nombre}" ha concluido en su último mundo. Elige un nuevo planeta para continuar su viaje.`
                                : `Vas a liberar a "${creature.nombre}". Esta acción la apartará de la arena y comenzará su propia saga planetaria.`
                              }
                               {isPlanetOccupied(selectedPlanet) && (
                                <span className="mt-2 block text-amber-500 font-semibold">
                                  Este planeta ya está ocupado. La función para que varias criaturas interactúen en el mismo mundo está en desarrollo y llegará en una futura actualización. Por ahora, si liberas a esta criatura aquí, su historia se desarrollará de forma independiente.
                                </span>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Label htmlFor="planet-select">Elige un planeta de destino</Label>
                            <Select value={selectedPlanet} onValueChange={setSelectedPlanet}>
                              <SelectTrigger id="planet-select">
                                <SelectValue placeholder="Selecciona un planeta" />
                              </SelectTrigger>
                              <SelectContent>
                                {planets.map((p) => (
                                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                                ))}
                                <SelectItem value="ia-generated">Viajar a un nuevo mundo desconocido (generado por IA)</SelectItem>
                              </SelectContent>
                            </Select>
                             <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
                                {
                                 selectedPlanet === 'ia-generated' 
                                 ? "La IA generará un planeta único con características, habitantes y desafíos impredecibles." 
                                 : planets.find(p => p.name === selectedPlanet)?.description
                                 }
                            </div>
                          </div>
                          <DialogFooter>
                             <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                             </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleReleaseCreature(creature)}
                                disabled={isGeneratingPlanet}
                              >
                                {isGeneratingPlanet ? <WandSparkles className="mr-2 h-4 w-4 animate-spin"/> : null}
                                {isGeneratingPlanet ? 'Creando Mundo...' : `Confirmar y ${canContinueSaga ? 'Viajar' : 'Liberar'}`}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                )})}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={!!opponent && !combatResult} onOpenChange={(isOpen) => { if (!isOpen) setOpponent(null) }}>
        <DialogContent className="max-w-md">
           <DialogHeader>
            <DialogTitle className="text-2xl text-center">¡Apunto de Luchar!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              <span className="font-bold text-primary">{combatDetails?.creature1.nombre}</span> vs <span className="font-bold text-primary">{combatDetails?.creature2.nombre}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><Globe size={16} /> Campo de Batalla</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold">{combatDetails?.battlefield.name}</h3>
                  <p className="text-xs text-muted-foreground">{combatDetails?.battlefield.description}</p>
                </CardContent>
              </Card>
            <div className="space-y-2">
              <Label htmlFor="betAmount">Tu Apuesta</Label>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="betAmount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                  min="1"
                  max={capital}
                />
              </div>
              <p className="text-xs text-muted-foreground">Tu capital actual es {capital.toLocaleString('es-ES')} €.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpponent(null)}>Cancelar</Button>
            <Button onClick={handleStartCombat} disabled={isSimulating}>
              {isSimulating ? <WandSparkles className="animate-spin mr-2" /> : <Swords className="mr-2" />}
              {isSimulating ? 'Simulando...' : `Apostar y Luchar`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!combatResult} onOpenChange={(isOpen) => { if (!isOpen) resetSelection() }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Resultado del Combate
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center">
              <Trophy className="h-12 w-12 text-yellow-400" />
              <h2 className="text-2xl font-bold mt-4">
                {combatResult?.winnerName ? `El ganador es... ¡${combatResult.winnerName}!` : "¡El combate termina sin un ganador!"}
                </h2>
              
              <Card className="w-full mt-4 bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-base flex justify-between">
                     <span className="flex items-center gap-2"><Trophy size={16}/>Favorito</span>
                     <span className="flex items-center gap-2"><Ticket size={16}/>Probabilidades</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center text-sm">
                   <Badge variant={combatResult?.favoriteCreatureName === combatResult?.winnerName ? "default" : "secondary"}>{combatResult?.favoriteCreatureName}</Badge>
                   <span className="font-mono text-lg">{combatResult?.odds}</span>
                </CardContent>
              </Card>

              <ScrollArea className="h-72 w-full rounded-md border p-4 mt-4 bg-background">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{combatResult?.combatLog}</p>
              </ScrollArea>
            </div>
          </div>
           <DialogFooter>
             <Button onClick={resetSelection}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    
