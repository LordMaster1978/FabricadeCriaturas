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
import { Star, Swords, Shield, Zap, Brain, HeartPulse, Wind, Gem, Crown, WandSparkles, LandPlot, Users, Ticket, Scale, CircleDollarSign } from 'lucide-react';
import { type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';
import { simulateCombat, type SimulateCombatInput, type SimulateCombatOutput } from '@/ai/flows/simulate-combat-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const battlefields = [
  { name: "Jungla Frondosa", description: "Un entorno denso y húmedo con árboles altos, lianas y poca visibilidad. Favorece la agilidad, el sigilo y a las criaturas adaptadas a la vegetación." },
  { name: "Desierto Volcánico", description: "Un paisaje árido de ceniza y roca afilada, con ríos de lava y aire caliente y sulfuroso. Ideal para criaturas de fuego o resistentes al calor. Perjudicial para las de hielo o agua." },
  { name: "Tundra Congelada", description: "Una vasta llanura de nieve y hielo, con vientos helados constantes. Las criaturas de hielo tienen ventaja. El frío extremo puede ralentizar a las demás." },
  { name: "Pantano Nocivo", description: "Aguas estancadas, terreno fangoso y miasmas tóxicas en el aire. Las criaturas anfibias, de veneno o con alta resistencia se desenvuelven bien. El movimiento es difícil." },
  { name: "Ruinas Arcanas", description: "Los restos de una ciudad mágica flotante. Hay fragmentos de energía mágica inestable en el aire y estructuras rotas que ofrecen cobertura. Favorece a criaturas inteligentes o mágicas." },
  { name: "Planeta sin Atmósfera", description: "Superficie de un planetoide rocoso en el vacío. No hay aire, ni sonido. La gravedad es baja. Solo criaturas que no necesitan respirar o están adaptadas al vacío pueden sobrevivir." },
];


export default function GalleryPage() {
  const [bestiary, setBestiary] = useState<DescribeCreatureOutput[]>([]);
  const [selectedCreature, setSelectedCreature] = useState<DescribeCreatureOutput | null>(null);
  const [opponent, setOpponent] = useState<DescribeCreatureOutput | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [capital, setCapital] = useState(1000); // Starting capital

  // Combat simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [combatResult, setCombatResult] = useState<SimulateCombatOutput | null>(null);
  const [combatDetails, setCombatDetails] = useState<{
    creature1: DescribeCreatureOutput;
    creature2: DescribeCreatureOutput;
    battlefield: typeof battlefields[0];
  } | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedCreatures = JSON.parse(localStorage.getItem('creature-bestiary') || '[]');
      const savedCapital = localStorage.getItem('player-capital');
      setBestiary(savedCreatures);
      if (savedCapital) {
        setCapital(parseInt(savedCapital, 10));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setBestiary([]);
    }
  }, []);

  const handleSelectContender = (creature: DescribeCreatureOutput) => {
    setSelectedCreature(creature);
    setOpponent(null); // Reset target when a new contender is chosen
  }

  const handleSelectOpponent = (opponent: DescribeCreatureOutput) => {
    if (!selectedCreature) return;
    const randomBattlefield = battlefields[Math.floor(Math.random() * battlefields.length)];
    setCombatDetails({
      creature1: selectedCreature,
      creature2: opponent,
      battlefield: randomBattlefield,
    });
    setOpponent(opponent);
    setCombatResult(null); // Clear previous results
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

      // Betting logic
      const oddsValue = parseFloat(result.odds.split(':')[0]);
      let newCapital = capital;

      if (result.winnerName === combatDetails.creature1.nombre) { // If player's creature won
        toast({ title: "¡Victoria!", description: "Has ganado la apuesta." });
        if (result.favoriteCreatureName === combatDetails.creature1.nombre) {
          newCapital += betAmount / oddsValue;
        } else {
          newCapital += betAmount * oddsValue;
        }
      } else { // Player's creature lost
        toast({ variant: "destructive", title: "Derrota", description: "Has perdido la apuesta." });
        newCapital -= betAmount;
      }
      
      const finalCapital = Math.round(newCapital);
      setCapital(finalCapital);
      localStorage.setItem('player-capital', finalCapital.toString());

    } catch (error: any) {
      console.error("Error simulating combat:", error);
      toast({
        variant: "destructive",
        title: "Error de Simulación",
        description: error.message || "No se pudo simular el combate.",
      });
      setOpponent(null); // Close the dialog on error
    } finally {
      setIsSimulating(false);
    }
  }


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

  const resetSelection = () => {
    setSelectedCreature(null);
    setOpponent(null);
    setCombatResult(null);
    setCombatDetails(null);
    setIsSimulating(false);
  }

  if (selectedCreature && !opponent) {
     return (
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Elige un Oponente</h1>
              <p className="text-muted-foreground">Has seleccionado a <span className="font-bold text-primary">{selectedCreature.nombre}</span>. Ahora, elige a su rival.</p>
            </div>
            <Button onClick={resetSelection} variant="outline">
              &larr; Cambiar de Contendiente
            </Button>
          </div>
           {bestiary.filter(c => c.nombre !== selectedCreature.nombre).length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <h2 className="text-2xl font-semibold">No hay oponentes disponibles</h2>
              <p className="text-muted-foreground mt-2">Necesitas al menos dos criaturas en tu bestiario para poder combatir.</p>
              <Link href="/craft" className="mt-4 inline-block">
                <Button>Crear otra criatura</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestiary.filter(c => c.nombre !== selectedCreature.nombre).map((opp, index) => (
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
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Galería y Arena</h1>
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
      
      {/* Pre-combat and betting dialog */}
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
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><LandPlot size={16} /> Campo de Batalla</CardTitle>
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
                  onChange={(e) => setBetAmount(parseInt(e.target.value, 10) || 0)}
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
      
      {/* Combat result dialog */}
      <Dialog open={!!combatResult} onOpenChange={(isOpen) => { if (!isOpen) setOpponent(null); setCombatResult(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Resultado del Combate
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center">
              <Crown className="h-12 w-12 text-yellow-400" />
              <h2 className="text-2xl font-bold mt-4">El ganador es... ¡{combatResult?.winnerName}!</h2>
              
              <Card className="w-full mt-4 bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-base flex justify-between">
                     <span className="flex items-center gap-2"><Users size={16}/>Favorito</span>
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
             <Button onClick={() => { setOpponent(null); setCombatResult(null); }}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
