'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera,
  Trash2,
  Save,
  Calendar, 
  Clock, 
  Pencil, 
  Scaling,
  Sparkles,
  BookOpen,
  Mountain,
  FileText,
  Users,
  HeartHandshake,
  Baby,
  WandSparkles,
  Star,
  AreaChart,
  Weight,
  MoveHorizontal,
  Circle,
  Bird,
  Fish,
  Footprints,
  Shield,
  Hand,
  Maximize,
  MoveVertical,
  Palette,
  AudioLines,
  Hourglass,
  Leaf,
  Recycle,
  CircleDollarSign,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { describeCreature, type DescribeCreatureInput, type DescribeCreatureOutput } from '@/ai/flows/describe-creature-flow';
import { generateSound, type GenerateSoundOutput } from '@/ai/flows/generate-sound-flow';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";


const initialValuation: DescribeCreatureOutput = {
  nombre: "Dragonus",
  narrativeDescription: `Ah, aventurero y estudioso de lo arcaico, permíteme descorrer el velo sobre una criatura cuyo nombre apenas musitan los vientos volcánicos: el Dragonus. No es un dragón de linaje conocido, ni una bestia de la estirpe común, sino una singularidad ígnea, un enigma envuelto en el lamento de la soledad y la furia de las forjas primigenias. Prepara tu pluma y tu corazón, pues la historia de esta criatura no es solo de poder, sino de una melancolía que arde más allá de su propia llama.

El Dragonus: El Eco Solitario de la Forja Ardiente

Descripción Física:
El Dragonus se alza a una altura "mediana" para una bestia de su naturaleza, comparable a un semental de guerra imponente, pero su presencia desborda cualquier medida. Su complexión es indiscutiblemente atlética, una silueta cincelada por la fuerza y la agilidad, más esbelta que robusta, diseñada para el movimiento explosivo y la gracia ardiente. Sus partes más notables son las láminas de obsidiana viviente que forman su piel, no lisas, sino angulares y fracturadas, con vetas de un magma brillante que palpita bajo la superficie. Estas escamas obsidianas irradian un calor constante, distorsionando el aire a su alrededor como un espejismo danzante. En su lomo, alas membranosas no de piel, sino de pura energía térmica condensada, ondean y se disipan en oleadas de calor abrasador, más una manifestación de su voluntad que una estructura biológica sólida. Su cabeza está coronada por una diadema natural de cuernos espinosos de obsidiana cristalizada, y sus ojos son brasas fundidas que brillan con una inteligencia antigua y una tristeza abismal. La textura general de su cuerpo es una paradoja: fría y dura como la roca volcánica al tacto, pero abrasadora e inasible por el aura de fuego que la envuelve.

Habilidades y Poderes:
La afinidad elemental del Dragonus es, sin lugar a dudas, el fuego primordial. No es un simple aliento flameante, sino una extensión de su propia existencia. Su principal habilidad, la "Emanación Ígnea Perpetua", convierte su mero caminar en una sentencia de calor: cada paso que da abrasa la tierra, y su aura constante consume el oxígeno a su alrededor, asfixiando a los no preparados y carbonizando la vegetación. Su ataque más devastador es el "Aliento de Fuego Espectral", una corriente de llamas tan puras y calientes que parecen etéreas, capaces de fundir metales y perforar la piedra con una facilidad espantosa.

En combate, su Ataque (75) es potente, canalizando la furia del volcán. Su Defensa (65) proviene de sus duras escamas de obsidiana. Su Velocidad (60) es sorprendente para su tamaño, permitiéndole emboscadas ígneas. Su Inteligencia (70) le permite discernir tácticas, aunque no es un estratega maestro. La Resistencia (80) es monumental, nutrida por el calor geotérmico. Su Fuerza (70) es considerable, y su Precisión (50) es su punto más débil, ya que su poder es más abrumador que sutil. Sin embargo, incluso una criatura de fuego tiene sus talones de Aquiles. La "Debilidad Gélida Profunda" es su perdición.

Ecología y Comportamiento:
El Dragonus es el epítome del temperamento "solitario". Su dieta no es carnal; se nutre de la energía geotérmmica y mágica. Su hábitat natural son los picos volcánicos activos. Su rol social es nulo; es un anacoreta elemental.

Reproducción y Crianza:
Aquí radica la verdadera tragedia del Dragonus: no tiene capacidad de reproducción. Es una criatura singular, nacida de un evento único e irrepetible.

Historia y Lore:
Las leyendas más antiguas hablan del Dragonus como "La Llama Que Anda Sola". No es una criatura que evolucionó, sino que fue creada. Se dice que un cónclave de poderosos piromantes buscó encarnar el caos elemental en una forma viviente, pero solo una criatura logró manifestarse plenamente: el Dragonus.`,
  combatStats: {
    Ataque: 75,
    Defensa: 65,
    Velocidad: 60,
    Inteligencia: 70,
    Resistencia: 80,
    Fuerza: 70,
    Precision: 50,
  },
  rarity: "Legendario",
  expertValuation: "El Dragonus representa un fascinante caso de singularidad elemental. Sus estadísticas de combate, aunque no alcanzan los picos de otras criaturas legendarias en áreas específicas, muestran una formidable base en Resistencia y Ataque, lo que lo convierte en un adversario desgastante. Su dependencia de fuentes de calor geotérmico es una debilidad logística explotable.",
  publicValuation: "¡Ni se te ocurra acercarte a un Dragonus! Dicen que la tierra tiembla y el aire se convierte en ceniza a su paso. Un amigo de un primo mío vio uno y dice que casi se derrite la armadura solo por estar cerca. Si ves un volcán que parece más enfadado de lo normal, da media vuelta y corre.",
  aiValuation: "El concepto del Dragonus es una interesante fusión de poder elemental y tragedia. La coherencia entre su origen, su naturaleza solitaria y su esterilidad crea un personaje convincente. Las estadísticas generadas reflejan adecuadamente sus atributos físicos y de comportamiento, resultando en un diseño equilibrado y creíble dentro de su propio lore.",
  starRating: 5,
};

const chartConfig = {
  value: {
    label: "Valor",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const colorPalette = [
  { name: 'Rojo', value: 'hsl(0, 70%, 50%)' },
  { name: 'Naranja', value: 'hsl(30, 70%, 50%)' },
  { name: 'Amarillo', value: 'hsl(60, 70%, 50%)' },
  { name: 'Verde', value: 'hsl(120, 70%, 40%)' },
  { name: 'Cian', value: 'hsl(180, 70%, 40%)' },
  { name: 'Azul', value: 'hsl(210, 70%, 50%)' },
  { name: 'Púrpura', value: 'hsl(270, 70%, 50%)' },
  { name: 'Magenta', value: 'hsl(300, 70%, 50%)' },
  { name: 'Negro', value: 'hsl(0, 0%, 10%)' },
  { name: 'Gris', value: 'hsl(0, 0%, 50%)' },
  { name: 'Blanco', value: 'hsl(0, 0%, 95%)' },
  { name: 'Marrón', value: 'hsl(30, 40%, 30%)' },
  { name: 'Dorado', value: 'hsl(50, 80%, 60%)' },
  { name: 'Plateado', value: 'hsl(210, 15%, 80%)' },
  { name: 'Obsidiana', value: 'hsl(240, 10%, 8%)' },
  { name: 'Carmesi', value: 'hsl(348, 83%, 47%)' },
  { name: 'Hueso', value: 'hsl(45, 20%, 90%)' },
  { name: 'Esmeralda', value: 'hsl(145, 63%, 49%)' },
];


export default function CraftPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [gameTime, setGameTime] = useState({ hour: 0, minute: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSound, setIsGeneratingSound] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [capital, setCapital] = useState(1000);

  const { toast } = useToast();

  const [creature, setCreature] = useState<DescribeCreatureInput>({
    nombre: '',
    composicion: '',
    tamano: 'medium',
    complexion: 'athletic',
    partesCuerpo: '',
    apariencia: '',
    altura: '',
    peso: '',
    anchura: '',
    profundidad: '',
    velocidadMaxima: '',
    afinidadElemental: 'fire',
    habilidadesUnicas: '',
    debilidades: '',
    temperamento: 'lonely',
    vocalizaciones: '',
    dieta: '',
    habitat: '',
    rolSocial: '',
    aptoReproduccion: false,
    habilidadesCrianza: '',
    historiaOrigen: '',
    envergadura: '',
    longitud: '',
    circunferencia: '',
    velocidadVuelo: '',
    velocidadNado: '',
    capacidadSalto: '',
    fuerzaMordida: '',
    capacidadCarga: '',
    resistenciaPiel: '',
    longevidad: '',
    rolEcologico: '',
    relacionesSimbioticas: '',
  });

  const [generatedValuation, setGeneratedValuation] = useState<DescribeCreatureOutput | null>(initialValuation);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCreature(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof DescribeCreatureInput) => (value: string) => {
    setCreature(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: keyof DescribeCreatureInput) => (checked: boolean) => {
    setCreature(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleColorClick = (colorName: string) => {
    setCreature(prev => ({
      ...prev,
      apariencia: prev.apariencia ? `${prev.apariencia}, ${colorName.toLowerCase()}` : colorName,
    }));
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setGeneratedValuation(null);
    try {
      const valuation = await describeCreature(creature);
      setGeneratedValuation(valuation);
      toast({
        title: "¡Valoración generada!",
        description: "La IA ha analizado y valorado a tu criatura.",
      });
    } catch (error: any) {
      console.error("Error generating valuation:", error);
      toast({
        variant: "destructive",
        title: "Error de la IA",
        description: error.message || "No se pudo generar la valoración. Inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateSound = async () => {
    if (!creature.vocalizaciones) {
      toast({
        variant: "destructive",
        title: "Sin descripción",
        description: "Por favor, describe el sonido de la criatura en el campo de Vocalizaciones.",
      });
      return;
    }
    setIsGeneratingSound(true);
    setAudioSrc(null);
    try {
      const result = await generateSound(creature.vocalizaciones);
      setAudioSrc(result.audioDataUri);
      toast({
        title: "¡Sonido generado!",
        description: "La IA ha creado el sonido de tu criatura.",
      });
    } catch (error: any) {
      console.error("Error generating sound:", error);
      toast({
        variant: "destructive",
        title: "Error de IA de Sonido",
        description: "No se pudo generar el sonido. Inténtalo de nuevo.",
      });
    } finally {
      setIsGeneratingSound(false);
    }
  };

  const handleSaveCreature = () => {
    if (!generatedValuation || !generatedValuation.nombre) {
      toast({
        variant: "destructive",
        title: "No hay criatura generada",
        description: "Primero debes generar una valoración con un nombre para poder guardar la criatura.",
      });
      return;
    }

    try {
      const bestiary = JSON.parse(localStorage.getItem('creature-bestiary') || '[]');
      // Evitar duplicados por nombre
      const isDuplicate = bestiary.some((c: DescribeCreatureOutput) => c.nombre === generatedValuation.nombre);
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Criatura duplicada",
          description: `Ya existe una criatura llamada "${generatedValuation.nombre}" en tu bestiario.`,
        });
        return;
      }

      bestiary.push(generatedValuation);
      localStorage.setItem('creature-bestiary', JSON.stringify(bestiary));
      toast({
        title: "¡Criatura guardada!",
        description: `"${generatedValuation.nombre}" ha sido añadida a tu bestiario.`,
      });
    } catch (error) {
      console.error("Error saving creature to localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo guardar la criatura en el almacenamiento local.",
      });
    }
  };
  
    useEffect(() => {
    const savedCapital = localStorage.getItem('player-capital');
    if (savedCapital) {
      setCapital(parseInt(savedCapital, 10));
    }

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
    }, 10000); 

    return () => clearInterval(timer);
  }, []);


  const formatGameTime = () => {
    const hour = gameTime.hour.toString().padStart(2, '0');
    const minute = gameTime.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };
  
  const chartData = generatedValuation ? Object.entries(generatedValuation.combatStats).map(([name, value]) => ({ name, value })) : [];

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Taller de Criaturas</h1>
              <Link href="/" passHref>
                <Button variant="outline" size="icon">
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Volver al Menú</span>
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-foreground/70" />
                <span className="text-foreground/90 font-semibold">{capital.toLocaleString('es-ES')} €</span>
              </div>
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
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Ej: Dragonus, Golemech..." value={creature.nombre} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="composicion">Composición y Materiales</Label>
                <Textarea 
                  id="composicion" 
                  placeholder="Ej: Escamas de obsidiana, núcleo de magma..." 
                  className="min-h-[80px]"
                  value={creature.composicion}
                  onChange={handleInputChange}
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
                  <Label htmlFor="tamano">Tamaño</Label>
                  <Select value={creature.tamano} onValueChange={handleSelectChange('tamano')}>
                    <SelectTrigger id="tamano"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="gargantuan">Gigante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complexion">Complexión</Label>
                   <Select value={creature.complexion} onValueChange={handleSelectChange('complexion')}>
                    <SelectTrigger id="complexion"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slim">Delgado</SelectItem>
                      <SelectItem value="athletic">Atlético</SelectItem>
                      <SelectItem value="robust">Robusto</SelectItem>
                      <SelectItem value="massive">Masivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura</Label>
                  <Input id="altura" placeholder="Ej: 3m" value={creature.altura} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso</Label>
                  <Input id="peso" placeholder="Ej: 500kg" value={creature.peso} onChange={handleInputChange} />
                </div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-2">
                  <Label htmlFor="anchura">Anchura</Label>
                  <Input id="anchura" placeholder="Ej: 2m" value={creature.anchura} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profundidad">Profundidad</Label>
                  <Input id="profundidad" placeholder="Ej: 5m" value={creature.profundidad} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="velocidadMaxima">Velocidad</Label>
                  <Input id="velocidadMaxima" placeholder="Ej: 60km/h" value={creature.velocidadMaxima} onChange={handleInputChange} />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="partesCuerpo">Partes del Cuerpo Notables</Label>
                <Textarea id="partesCuerpo" placeholder="Ej: Alas de cuero, cuernos retorcidos..." className="min-h-[50px]" value={creature.partesCuerpo} onChange={handleInputChange}/>
              </div>
            </CardContent>
          </Card>
          
          {/* Apariencia y Colores */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Apariencia y Colores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apariencia">Apariencia y Textura</Label>
                <Textarea id="apariencia" placeholder="Ej: Piel escamosa y brillante, pelaje metálico..." className="min-h-[80px]" value={creature.apariencia} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Paleta de Colores Sugeridos</Label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() => handleColorClick(color.name)}
                      className="h-6 w-6 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      style={{ backgroundColor: color.value }}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medidas Detalladas */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-primary" />
                Medidas Detalladas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="envergadura" className="flex items-center gap-1 text-xs"><MoveHorizontal size={12}/>Envergadura</Label>
                  <Input id="envergadura" placeholder="Ej: 15m" value={creature.envergadura} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitud" className="flex items-center gap-1 text-xs"><MoveVertical size={12}/>Longitud</Label>
                  <Input id="longitud" placeholder="Ej: 10m" value={creature.longitud} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circunferencia" className="flex items-center gap-1 text-xs"><Circle size={12}/>Circunferencia</Label>
                  <Input id="circunferencia" placeholder="Ej: 5m" value={creature.circunferencia} onChange={handleInputChange} />
                </div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="velocidadVuelo" className="flex items-center gap-1 text-xs"><Bird size={12}/>Vel. Vuelo</Label>
                  <Input id="velocidadVuelo" placeholder="Ej: 120km/h" value={creature.velocidadVuelo} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="velocidadNado" className="flex items-center gap-1 text-xs"><Fish size={12}/>Vel. Nado</Label>
                  <Input id="velocidadNado" placeholder="Ej: 30km/h" value={creature.velocidadNado} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidadSalto" className="flex items-center gap-1 text-xs"><Footprints size={12}/>Salto</Label>
                  <Input id="capacidadSalto" placeholder="Ej: 20m" value={creature.capacidadSalto} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fuerzaMordida" className="flex items-center gap-1 text-xs"><Hand size={12}/>Fuerza Mordida</Label>
                  <Input id="fuerzaMordida" placeholder="Ej: 1500 PSI" value={creature.fuerzaMordida} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidadCarga" className="flex items-center gap-1 text-xs"><Weight size={12}/>Cap. Carga</Label>
                  <Input id="capacidadCarga" placeholder="Ej: 2000kg" value={creature.capacidadCarga} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resistenciaPiel" className="flex items-center gap-1 text-xs"><Shield size={12}/>Resist. Piel</Label>
                  <Input id="resistenciaPiel" placeholder="Ej: 500 KPa" value={creature.resistenciaPiel} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Habilidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="afinidadElemental">Afinidad Elemental</Label>
                <Select value={creature.afinidadElemental} onValueChange={handleSelectChange('afinidadElemental')}>
                  <SelectTrigger id="afinidadElemental"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fuego</SelectItem>
                    <SelectItem value="water">Agua</SelectItem>
                    <SelectItem value="earth">Tierra</SelectItem>
                    <SelectItem value="air">Aire</SelectItem>
                    <SelectItem value="light">Luz</SelectItem>
                    <SelectItem value="darkness">Oscuridad</SelectItem>
                    <SelectItem value="nature">Naturaleza</SelectItem>
                    <SelectItem value="ice">Hielo</SelectItem>
                    <SelectItem value="lightning">Rayo</SelectItem>
                    <SelectItem value="poison">Veneno</SelectItem>
                    <SelectItem value="psychic">Psíquico</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="sound">Sonido</SelectItem>
                    <SelectItem value="celestial">Celestial</SelectItem>
                    <SelectItem value="abyssal">Abisal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="habilidadesUnicas">Habilidades Únicas</Label>
                <Textarea id="habilidadesUnicas" placeholder="Ej: Puede volverse invisible, grito sónico..." className="min-h-[50px]" value={creature.habilidadesUnicas} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debilidades">Debilidades</Label>
                <Textarea id="debilidades" placeholder="Ej: Vulnerable al sonido agudo..." className="min-h-[50px]" value={creature.debilidades} onChange={handleInputChange}/>
              </div>
            </CardContent>
          </Card>

          {/* Sonido y Comportamiento */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AudioLines className="h-5 w-5 text-primary" />
                Sonido y Comportamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperamento">Temperamento</Label>
                 <Select value={creature.temperamento} onValueChange={handleSelectChange('temperamento')}>
                  <SelectTrigger id="temperamento"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Agresiva</SelectItem>
                    <SelectItem value="peaceful">Pacífica</SelectItem>
                    <SelectItem value="lonely">Solitaria</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="playful">Juguetona</SelectItem>
                    <SelectItem value="territorial">Territorial</SelectItem>
                    <SelectItem value="curious">Curiosa</SelectItem>
                    <SelectItem value="shy">Tímida</SelectItem>
                    <SelectItem value="proud">Orgullosa</SelectItem>
                    <SelectItem value="mischievous">Traviesa</SelectItem>
                    <SelectItem value="protective">Protectora</SelectItem>
                    <SelectItem value="wise">Sabia</SelectItem>
                    <SelectItem value="wild">Salvaje</SelectItem>
                    <SelectItem value="cunning">Astuta</SelectItem>
                    <SelectItem value="lazy">Perezosa</SelectItem>
                    <SelectItem value="stoic">Estoica</SelectItem>
                    <SelectItem value="erratic">Errática</SelectItem>
                    <SelectItem value="timid">Miedosa</SelectItem>
                    <SelectItem value="majestic">Majestuosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="vocalizaciones">Vocalizaciones</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleGenerateSound}
                    disabled={isGeneratingSound}
                    title="Generar Sonido con IA"
                  >
                    <WandSparkles className={`h-4 w-4 ${isGeneratingSound ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <Textarea id="vocalizaciones" placeholder="Ej: Rugido grave, canto melódico..." className="min-h-[50px]" value={creature.vocalizaciones} onChange={handleInputChange} />
                 {audioSrc && (
                  <audio controls src={audioSrc} className="w-full mt-2">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Dieta y Hábitat */}
          <Card className="bg-card/50 border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-primary" />
                Dieta y Hábitat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="dieta">Dieta</Label>
                <Input id="dieta" placeholder="Carnívoro, herbívoro..." value={creature.dieta} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitat">Hábitat Natural</Label>
                <Input id="habitat" placeholder="Bosques, volcanes..." value={creature.habitat} onChange={handleInputChange}/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="rolEcologico" className="flex items-center gap-2"><Leaf size={14}/>Rol Ecológico</Label>
                <Textarea id="rolEcologico" placeholder="Ej: Poliniza flores lunares, es un superdepredador..." className="min-h-[50px]" value={creature.rolEcologico} onChange={handleInputChange}/>
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
                <Label htmlFor="rolSocial">Rol Social</Label>
                <Input id="rolSocial" placeholder="Ej: Líder de manada, explorador..." value={creature.rolSocial} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="longevidad" className="flex items-center gap-2"><Hourglass size={14}/>Longevidad</Label>
                <Input id="longevidad" placeholder="Ej: 100 años, inmortal..." value={creature.longevidad} onChange={handleInputChange} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="aptoReproduccion" className="flex items-center gap-2"><HeartHandshake size={16}/>Apto para Reproducción</Label>
                <Switch id="aptoReproduccion" checked={creature.aptoReproduccion} onCheckedChange={handleSwitchChange('aptoReproduccion')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habilidadesCrianza" className="flex items-center gap-2"><Baby size={16}/>Habilidades de Crianza</Label>
                <Textarea id="habilidadesCrianza" placeholder="Ej: Construye nidos complejos, protector..." className="min-h-[50px]" value={creature.habilidadesCrianza} onChange={handleInputChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relacionesSimbioticas" className="flex items-center gap-2"><Recycle size={14}/>Relaciones Simbióticas</Label>
                <Textarea id="relacionesSimbioticas" placeholder="Ej: Protege a los gnomos del bosque a cambio de gemas..." className="min-h-[50px]" value={creature.relacionesSimbioticas} onChange={handleInputChange}/>
              </div>
            </CardContent>
          </Card>

          {/* Historia de Origen */}
          <Card className="bg-card/50 border-border/50 lg:col-span-2">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Historia de Origen
              </CardTitle>
            </CardHeader>
            <CardContent>
               <Textarea 
                  id="historiaOrigen" 
                  placeholder="Escribe una breve historia sobre cómo fue creada o descubierta tu criatura..." 
                  className="min-h-[120px]"
                  value={creature.historiaOrigen}
                  onChange={handleInputChange}
                />
            </CardContent>
          </Card>

          {/* Generador de Lore */}
          <Card className="bg-card/50 border-border/50 lg:col-span-3">
             <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <WandSparkles className="h-5 w-5 text-primary" />
                  <span>Ficha de Valoración: {generatedValuation ? <span className="font-bold text-primary">{generatedValuation.nombre}</span> : 'IA'}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                    <WandSparkles className="h-4 w-4" />
                    {isGenerating ? 'Generando...' : 'Generar Valoración'}
                  </Button>
                   <Button onClick={handleSaveCreature} disabled={!generatedValuation}>
                    <Save className="h-4 w-4" />
                    Guardar Criatura
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
               {isGenerating && (
                <div className="flex items-center justify-center p-8">
                  <WandSparkles className="h-8 w-8 text-primary animate-spin" />
                  <p className="ml-4 text-lg">La IA está forjando la leyenda de tu criatura...</p>
                </div>
               )}
               {generatedValuation && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Columna Izquierda: Lore y Reseñas */}
                  <div className="lg:col-span-3 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Descripción Narrativa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{generatedValuation.narrativeDescription}</p>
                      </CardContent>
                    </Card>
                    <Tabs defaultValue="expert">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="expert">Valoración Experta</TabsTrigger>
                        <TabsTrigger value="public">Valoración del Público</TabsTrigger>
                        <TabsTrigger value="ai">Reseña de la IA</TabsTrigger>
                      </TabsList>
                      <TabsContent value="expert">
                        <Card>
                          <CardContent className="pt-6">
                            <p className="italic text-muted-foreground">"{generatedValuation.expertValuation}"</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="public">
                        <Card>
                           <CardContent className="pt-6">
                            <p className="italic text-muted-foreground">"{generatedValuation.publicValuation}"</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="ai">
                        <Card>
                           <CardContent className="pt-6">
                            <p className="italic text-muted-foreground">"{generatedValuation.aiValuation}"</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Columna Derecha: Valoración y Estadísticas */}
                  <div className="lg:col-span-2 space-y-6">
                     <Card>
                      <CardHeader>
                        <CardTitle>Valoración General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Rareza</Label>
                          <Badge variant={generatedValuation.rarity === 'Legendario' || generatedValuation.rarity === 'Épico' ? 'default' : 'secondary'}>
                            {generatedValuation.rarity}
                          </Badge>
                        </div>
                         <div className="flex justify-between items-center">
                          <Label>Puntuación Final</Label>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 ${i < generatedValuation.starRating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AreaChart className="h-5 w-5" />
                            Estadísticas de Combate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10 }}>
                              <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                                width={80}
                              />
                              <XAxis dataKey="value" type="number" hide />
                              <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                              />
                              <Bar dataKey="value" layout="vertical" radius={5}>
                              </Bar>
                            </BarChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                  </div>
                </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
