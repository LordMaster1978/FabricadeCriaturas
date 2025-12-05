'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Pencil, 
  Scaling,
  Sparkles,
  HeartPulse,
  ShieldAlert,
  BrainCircuit,
  Swords,
  Wind,
  BookOpen,
  Apple,
  Mountain,
  FileText,
  BatteryCharging,
  Fist,
  Crosshair,
  Star,
  Users,
  HeartHandshake,
  Baby
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function CraftPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [gameTime, setGameTime] = useState({ hour: 0, minute: 0 });

  useEffect(() => {
    // Establecer la fecha actual en el cliente para evitar errores de hidratación
    setCurrentDate(new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    const timer = setInterval(() => {
      setGameTime(prevTime => {
        const newHour = (prevTime.hour + 1) % 24;
        return { hour: newHour, minute: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatGameTime = () => {
    const hour = gameTime.hour.toString().padStart(2, '0');
    const minute = gameTime.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold">Taller de Criaturas</h1>
            <div className="flex items-center gap-6 text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-foreground/70" />
                <span className="text-foreground/90">{currentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-foreground/70" />
                <span className="font-mono text-xl text-primary">{formatGameTime()}</span>
              </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Identidad y Materiales */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Identidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creature-name">Nombre</Label>
                <Input id="creature-name" placeholder="Ej: Dragonus, Golemech..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materials">Composición y Materiales</Label>
                <Textarea 
                  id="materials" 
                  placeholder="Ej: Escamas de obsidiana, núcleo de magma..." 
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Atributos Físicos */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scaling className="h-5 w-5 text-primary" />
                Atributos Físicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Tamaño</Label>
                  <Select>
                    <SelectTrigger id="size"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="gargantuan">Gigante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="build">Complexión</Label>
                   <Select>
                    <SelectTrigger id="build"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slim">Delgado</SelectItem>
                      <SelectItem value="athletic">Atlético</SelectItem>
                      <SelectItem value="robust">Robusto</SelectItem>
                      <SelectItem value="massive">Masivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="body-parts">Partes del Cuerpo</Label>
                <Textarea id="body-parts" placeholder="Ej: Alas de cuero, cuernos retorcidos..." className="min-h-[50px]"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appearance">Apariencia y Textura</Label>
                <Textarea id="appearance" placeholder="Ej: Piel escamosa y brillante, pelaje metálico..." className="min-h-[50px]" />
              </div>
            </CardContent>
          </Card>

          {/* Habilidades y Poderes */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Habilidades y Poderes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="element">Afinidad Elemental</Label>
                <Select>
                  <SelectTrigger id="element"><SelectValue placeholder="Selecciona un elemento..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fuego</SelectItem>
                    <SelectItem value="water">Agua</SelectItem>
                    <SelectItem value="earth">Tierra</SelectItem>
                    <SelectItem value="air">Aire</SelectItem>
                    <SelectItem value="light">Luz</SelectItem>
                    <SelectItem value="darkness">Oscuridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unique-abilities">Habilidades Únicas</Label>
                <Textarea id="unique-abilities" placeholder="Ej: Puede volverse invisible, grito sónico..." className="min-h-[50px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weaknesses">Debilidades</Label>
                <Textarea id="weaknesses" placeholder="Ej: Vulnerable al sonido agudo..." className="min-h-[50px]" />
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Combate */}
          <Card className="bg-card/50 border-border/50 lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Estadísticas de Combate
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 pt-2">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Swords size={16}/> Ataque</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><ShieldAlert size={16}/> Defensa</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Wind size={16}/> Velocidad</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><BrainCircuit size={16}/> Inteligencia</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><BatteryCharging size={16}/> Resistencia</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Fist size={16}/> Fuerza</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Crosshair size={16}/> Precisión</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Star size={16}/> Suerte</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
            </CardContent>
          </Card>

          {/* Comportamiento y Lore */}
          <Card className="bg-card/50 border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Comportamiento y Lore
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperament">Temperamento</Label>
                 <Select>
                  <SelectTrigger id="temperament"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Agresiva</SelectItem>
                    <SelectItem value="peaceful">Pacífica</SelectItem>
                    <SelectItem value="lonely">Solitaria</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="playful">Juguetona</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="diet" className="flex items-center gap-2"><Apple size={16}/>Dieta</Label>
                <Input id="diet" placeholder="Carnívoro, herbívoro..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitat" className="flex items-center gap-2"><Mountain size={16}/>Hábitat Natural</Label>
                <Input id="habitat" placeholder="Bosques, volcanes..." />
              </div>
            </CardContent>
          </Card>
          
          {/* Social y Reproductivo */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Social y Reproductivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-role">Rol Social</Label>
                <Input id="social-role" placeholder="Ej: Líder de manada, explorador..." />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="reproduction" className="flex items-center gap-2"><HeartHandshake size={16}/>Apto para Reproducción</Label>
                <Switch id="reproduction" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parenting-skills" className="flex items-center gap-2"><Baby size={16}/>Habilidades de Crianza</Label>
                <Textarea id="parenting-skills" placeholder="Ej: Construye nidos complejos, protector..." className="min-h-[50px]" />
              </div>
            </CardContent>
          </Card>

          {/* Historia de Origen */}
          <Card className="bg-card/50 border-border/50 lg:col-span-3">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Historia de Origen
              </CardTitle>
            </CardHeader>
            <CardContent>
               <Textarea 
                  id="lore" 
                  placeholder="Escribe una breve historia sobre cómo fue creada o descubierta tu criatura..." 
                  className="min-h-[120px]"
                />
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}
