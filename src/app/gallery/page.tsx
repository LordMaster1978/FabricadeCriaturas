'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Swords, Shield, Zap, Brain, HeartPulse, Wind, Gem } from 'lucide-react';
import { type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';

export default function GalleryPage() {
  const [bestiary, setBestiary] = useState<DescribeCreatureOutput[]>([]);
  const [selectedCreature, setSelectedCreature] = useState<DescribeCreatureOutput | null>(null);

  useEffect(() => {
    try {
      const savedCreatures = JSON.parse(localStorage.getItem('creature-bestiary') || '[]');
      setBestiary(savedCreatures);
    } catch (error) {
      console.error("Error loading creatures from localStorage:", error);
      setBestiary([]);
    }
  }, []);

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

  if (selectedCreature) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <Button onClick={() => setSelectedCreature(null)} className="mb-4">
            &larr; Volver a la Galería
          </Button>
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-4xl font-bold text-primary">{selectedCreature.nombre}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <Badge variant={rarityVariant(selectedCreature.rarity)}>{selectedCreature.rarity}</Badge>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < selectedCreature.starRating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                        />
                      ))}
                    </div>
                  </CardDescription>
                </div>
                 <div className="text-right">
                  <h3 className="font-semibold">Estadísticas</h3>
                  <ul className="text-sm text-muted-foreground">
                    <li className="flex items-center justify-end gap-2"><Swords size={14} />Ataque: {selectedCreature.combatStats.Ataque}</li>
                    <li className="flex items-center justify-end gap-2"><Shield size={14} />Defensa: {selectedCreature.combatStats.Defensa}</li>
                    <li className="flex items-center justify-end gap-2"><Wind size={14} />Velocidad: {selectedCreature.combatStats.Velocidad}</li>
                     <li className="flex items-center justify-end gap-2"><HeartPulse size={14} />Resistencia: {selectedCreature.combatStats.Resistencia}</li>
                     <li className="flex items-center justify-end gap-2"><Gem size={14} />Fuerza: {selectedCreature.combatStats.Fuerza}</li>
                    <li className="flex items-center justify-end gap-2"><Brain size={14} />Inteligencia: {selectedCreature.combatStats.Inteligencia}</li>
                    <li className="flex items-center justify-end gap-2"><Zap size={14} />Precisión: {selectedCreature.combatStats.Precision}</li>
                  </ul>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{selectedCreature.narrativeDescription}</p>
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">Reseñas</h3>
                <blockquote className="border-l-4 border-primary pl-4 italic">"{selectedCreature.expertValuation}" <footer className="text-xs not-italic">- Valoración Experta</footer></blockquote>
                <blockquote className="border-l-4 border-secondary pl-4 italic">"{selectedCreature.publicValuation}" <footer className="text-xs not-italic">- Valoración del Público</footer></blockquote>
                <blockquote className="border-l-4 border-muted-foreground pl-4 italic">"{selectedCreature.aiValuation}" <footer className="text-xs not-italic">- Reseña de la IA</footer></blockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Galería de Criaturas</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestiary.map((creature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedCreature(creature)}
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
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {creature.narrativeDescription.split('\n')[1] || creature.narrativeDescription}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
