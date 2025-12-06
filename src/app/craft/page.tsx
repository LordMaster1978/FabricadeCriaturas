'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Pencil, 
  Scaling,
  Sparkles,
  BookOpen,
  Apple,
  Mountain,
  FileText,
  Users,
  HeartHandshake,
  Baby,
  WandSparkles,
  Star,
  AreaChart
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
  narrativeDescription: `Ah, aventurero y estudioso de lo arcaico, permíteme descorrer el velo sobre una criatura cuyo nombre apenas musitan los vientos volcánicos: el Dragonus. No es un dragón de linaje conocido, ni una bestia de la estirpe común, sino una singularidad ígnea, un enigma envuelto en el lamento de la soledad y la furia de las forjas primigenias. Prepara tu pluma y tu corazón, pues la historia de esta criatura no es solo de poder, sino de una melancolía que arde más allá de su propia llama.\n\nEl Dragonus: El Eco Solitario de la Forja Ardiente\n\nDescripción Física:\nEl Dragonus se alza a una altura "mediana" para una bestia de su naturaleza, comparable a un semental de guerra imponente, pero su presencia desborda cualquier medida. Su complexión es indiscutiblemente atlética, una silueta cincelada por la fuerza y la agilidad, más esbelta que robusta, diseñada para el movimiento explosivo y la gracia ardiente. Sus partes más notables son las láminas de obsidiana viviente que forman su piel, no lisas, sino angulares y fracturadas, con vetas de un magma brillante que palpita bajo la superficie. Estas escamas obsidianas irradian un calor constante, distorsionando el aire a su alrededor como un espejismo danzante. En su lomo, alas membranosas no de piel, sino de pura energía térmica condensada, ondean y se disipan en oleadas de calor abrasador, más una manifestación de su voluntad que una estructura biológica sólida. Su cabeza está coronada por una diadema natural de cuernos espinosos de obsidiana cristalizada, y sus ojos son brasas fundidas que brillan con una inteligencia antigua y una tristeza abismal. La textura general de su cuerpo es una paradoja: fría y dura como la roca volcánica al tacto, pero abrasadora e inasible por el aura de fuego que la envuelve.\n\nHabilidades y Poderes:\nLa afinidad elemental del Dragonus es, sin lugar a dudas, el fuego primordial. No es un simple aliento flameante, sino una extensión de su propia existencia. Su principal habilidad, la "Emanación Ígnea Perpetua", convierte su mero caminar en una sentencia de calor: cada paso que da abrasa la tierra, y su aura constante consume el oxígeno a su alrededor, asfixiando a los no preparados y carbonizando la vegetación. Su ataque más devastador es el "Aliento de Fuego Espectral", una corriente de llamas tan puras y calientes que parecen etéreas, capaces de fundir metales y perforar la piedra con una facilidad espantosa.\n\nEn combate, su Ataque (75) es potente, canalizando la furia del volcán. Su Defensa (65) proviene de sus duras escamas de obsidiana. Su Velocidad (60) es sorprendente para su tamaño, permitiéndole emboscadas ígneas. Su Inteligencia (70) le permite discernir tácticas, aunque no es un estratega maestro. La Resistencia (80) es monumental, nutrida por el calor geotérmico. Su Fuerza (70) es considerable, y su Precisión (50) es su punto más débil, ya que su poder es más abrumador que sutil. Sin embargo, incluso una criatura de fuego tiene sus talones de Aquiles. La "Debilidad Gélida Profunda" es su perdición.\n\nEcología y Comportamiento:\nEl Dragonus es el epítome del temperamento "solitario". Su dieta no es carnal; se nutre de la energía geotérmica y mágica. Su hábitat natural son los picos volcánicos activos. Su rol social es nulo; es un anacoreta elemental.\n\nReproducción y Crianza:\nAquí radica la verdadera tragedia del Dragonus: no tiene capacidad de reproducción. Es una criatura singular, nacida de un evento único e irrepetible.\n\nHistoria y Lore:\nLas leyendas más antiguas hablan del Dragonus como "La Llama Que Anda Sola". No es una criatura que evolucionó, sino que fue creada. Se dice que un cónclave de poderosos piromantes buscó encarnar el caos elemental en una forma viviente, pero solo una criatura logró manifestarse plenamente: el Dragonus.`,
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

export default function CraftPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [gameTime, setGameTime] = useState({ hour: 0, minute: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [creature, setCreature] = useState<DescribeCreatureInput>({
    nombre: '',
    composicion: '',
    tamano: 'medium',
    complexion: 'athletic',
    partesCuerpo: '',
    apariencia: '',
    afinidadElemental: 'fire',
    habilidadesUnicas: '',
    debilidades: '',
    temperamento: 'lonely',
    dieta: '',
    habitat: '',
    rolSocial: '',
    aptoReproduccion: false,
    habilidadesCrianza: '',
    historiaOrigen: '',
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
    } catch (error) {
      console.error("Error generating valuation:", error);
      toast({
        variant: "destructive",
        title: "Error de la IA",
        description: "No se pudo generar la valoración. Inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
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
    }, 60000); 

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
               <div className="space-y-2">
                <Label htmlFor="partesCuerpo">Partes del Cuerpo</Label>
                <Textarea id="partesCuerpo" placeholder="Ej: Alas de cuero, cuernos retorcidos..." className="min-h-[50px]" value={creature.partesCuerpo} onChange={handleInputChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apariencia">Apariencia y Textura</Label>
                <Textarea id="apariencia" placeholder="Ej: Piel escamosa y brillante, pelaje metálico..." className="min-h-[50px]" value={creature.apariencia} onChange={handleInputChange} />
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

          {/* Temperamento, Dieta y Hábitat Natural */}
          <Card className="bg-card/50 border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Temperamento, Dieta y Hábitat Natural
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="dieta">Dieta</Label>
                <Input id="dieta" placeholder="Carnívoro, herbívoro..." value={creature.dieta} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitat">Hábitat Natural</Label>
                <Input id="habitat" placeholder="Bosques, volcanes..." value={creature.habitat} onChange={handleInputChange}/>
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
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="aptoReproduccion" className="flex items-center gap-2"><HeartHandshake size={16}/>Apto para Reproducción</Label>
                <Switch id="aptoReproduccion" checked={creature.aptoReproduccion} onCheckedChange={handleSwitchChange('aptoReproduccion')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habilidadesCrianza" className="flex items-center gap-2"><Baby size={16}/>Habilidades de Crianza</Label>
                <Textarea id="habilidadesCrianza" placeholder="Ej: Construye nidos complejos, protector..." className="min-h-[50px]" value={creature.habilidadesCrianza} onChange={handleInputChange}/>
              </div>
            </CardContent>
          </Card>

          {/* Historia de Origen */}
          <Card className="bg-card/50 border-border/50 lg:col-span-3">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Historia de Origen (Tu Aporte)
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
                  Ficha de Valoración (IA)
                </CardTitle>
                <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                  {isGenerating ? 'Generando...' : 'Generar Valoración'}
                </Button>
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
                        <CardTitle>Descripción y Lore</CardTitle>
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
