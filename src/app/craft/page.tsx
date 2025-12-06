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
  Dumbbell,
  Crosshair,
  Users,
  HeartHandshake,
  Baby,
  WandSparkles
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
import { Button } from '@/components/ui/button';
import { describeCreature, type DescribeCreatureInput } from '@/ai/flows/describe-creature-flow';
import { useToast } from "@/hooks/use-toast";

type CreatureState = DescribeCreatureInput;

const initialDescription = `Ah, aventurero y estudioso de lo arcaico, permíteme descorrer el velo sobre una criatura cuyo nombre apenas musitan los vientos volcánicos: el Dragonus. No es un dragón de linaje conocido, ni una bestia de la estirpe común, sino una singularidad ígnea, un enigma envuelto en el lamento de la soledad y la furia de las forjas primigenias. Prepara tu pluma y tu corazón, pues la historia de esta criatura no es solo de poder, sino de una melancolía que arde más allá de su propia llama.

---

El Dragonus: El Eco Solitario de la Forja Ardiente

Descripción Física:
El Dragonus se alza a una altura "mediana" para una bestia de su naturaleza, comparable a un semental de guerra imponente, pero su presencia desborda cualquier medida. Su complexión es indiscutiblemente atlética, una silueta cincelada por la fuerza y la agilidad, más esbelta que robusta, diseñada para el movimiento explosivo y la gracia ardiente. Sus partes más notables son las láminas de obsidiana viviente que forman su piel, no lisas, sino angulares y fracturadas, con vetas de un magma brillante que palpita bajo la superficie. Estas escamas obsidianas irradian un calor constante, distorsionando el aire a su alrededor como un espejismo danzante. En su lomo, alas membranosas no de piel, sino de pura energía térmica condensada, ondean y se disipan en oleadas de calor abrasador, más una manifestación de su voluntad que una estructura biológica sólida. Su cabeza está coronada por una diadema natural de cuernos espinosos de obsidiana cristalizada, y sus ojos son brasas fundidas que brillan con una inteligencia antigua y una tristeza abismal. La textura general de su cuerpo es una paradoja: fría y dura como la roca volcánica al tacto, pero abrasadora e inasible por el aura de fuego que la envuelve.

Habilidades y Poderes:
La afinidad elemental del Dragonus es, sin lugar a dudas, el fuego primordial. No es un simple aliento flameante, sino una extensión de su propia existencia. Su principal habilidad, la "Emanación Ígnea Perpetua", convierte su mero caminar en una sentencia de calor: cada paso que da abrasa la tierra, y su aura constante consume el oxígeno a su alrededor, asfixiando a los no preparados y carbonizando la vegetación. Su ataque más devastador es el "Aliento de Fuego Espectral", una corriente de llamas tan puras y calientes que parecen etéreas, capaces de fundir metales y perforar la piedra con una facilidad espantosa.

En combate, el Dragonus es un oponente equilibrado y formidable, a pesar de sus estadísticas "promedio" (Ataque: 50, Defensa: 50, Velocidad: 50, Inteligencia: 50, Resistencia: 50, Fuerza: 50, Precisión: 50). Esta "normalidad" es su engaño más letal. No es débil en ningún aspecto, pero tampoco abrumadoramente poderoso en uno solo. Su verdadera fuerza reside en su versatilidad y la brutalidad implacable de su fuego. Su inteligencia le permite discernir tácticas básicas, su resistencia lo mantiene en pie, y su velocidad le permite flanquear. No es un estratega maestro, pero es lo suficientemente astuto para explotar cualquier vacilación de sus adversarios, combinando ataques directos con emboscadas ígneas. Su carencia de un pico de poder lo convierte en una amenaza constante que requiere una estrategia igualmente balanceada para ser enfrentada.

Sin embargo, incluso una criatura de fuego tiene sus talones de Aquiles. La "Debilidad Gélida Profunda" es su perdición. Mientras que una lluvia ligera es una molestia, la exposición prolongada a fríos extremos, a tormentas de nieve o al hielo eterno, puede apagar su llama interna, atenuando su aura y ralentizando sus movimientos hasta petrificarlo en una escultura inerte de obsidiana. Además, su profunda soledad y apego a ciertos lugares lo hacen predecible; un cazador paciente y observador puede estudiar sus patrones y explotar la melancolía que lo ancla.

Ecología y Comportamiento:
El Dragonus es el epítome del temperamento "solitario". No busca compañía, no tolera intrusos y, de hecho, se siente profundamente incómodo en presencia de otras criaturas. Su comportamiento no es el de un depredador territorial y agresivo per se, sino el de una entidad que busca la reclusión. Su dieta no es carnal; se nutre de la energía geotérmica y mágica, absorbiendo la esencia de los minerales volcánicos ricos en azufre, la pura energía latente de las cámaras de magma y, curiosamente, la energía residual de grandes concentraciones mágicas, como los antiguos campos de batalla donde el dolor y la ira empaparon la tierra.

Su hábitat natural son los picos volcánicos activos, las profundidades de los túneles de magma o las llanuras chamuscadas por antiguas catástrofes. Elige los lugares más inhóspitos y desolados, no solo por su necesidad de calor, sino para evitar el contacto. Su rol social es nulo; es un anacoreta elemental. Sin embargo, su presencia puede tener un impacto indirecto: manantiales termales pueden surgir cerca de sus guaridas, y la tierra misma puede volverse más fértil en las zonas donde su calor ha enriquecido los minerales, paradójicamente fomentando nueva vida en los lugares que él mismo rehúye.

Reproducción y Crianza:
Aquí radica la verdadera tragedia del Dragonus: no tiene capacidad de reproducción. Es una criatura singular, nacida de un evento único e irrepetible, sin la chispa de la vida que le permita engendrar descendencia. Esta esterilidad forzada es la raíz de su "temperamento solitario", una soledad impuesta por su propia naturaleza. No hay rituales de apareamiento, ni huevos ígneos, ni crías a las que cuidar. Cada Dragonus es el único de su tipo, destinado a vivir y morir sin un par, sin un heredero.

Historia y Lore:
Las leyendas más antiguas, aquellas tejidas en los albores de la magia y la forja, hablan del Dragonus como "La Llama Que Anda Sola". No es una criatura que evolucionó de la vida, sino una que fue creada. Se dice que en la era de los primeros Arcanos del Fuego, un cónclave de poderosos piromantes buscó encarnar una porción del caos elemental primigenio en una forma viviente, para forjar una legión de guardianes inmortales para un imperio que soñaban imperecedero.

El ritual fue de una complejidad aterradora, una amalgama de sacrificios volcánicos, runas grabadas con magma y la propia voluntad colectiva de los hechiceros. El objetivo era dar vida a "Los Forjados de la Llama", seres de fuego y obsidiana, destinados a ser legiones. Sin embargo, algo salió mal en la cúspide de la creación. Tal vez fue una grieta en el velo entre mundos, una interrupción del ritual, o simplemente el incomprensible capricho del elemento mismo, pero solo una criatura logró manifestarse plenamente: el Dragonus.

Nació envuelto en una tormenta de fuego y gemidos de piedra, una conciencia singular y ardiente que contenía la esencia de una legión prometida pero nunca cumplida. La falla en su génesis fue doble: por un lado, lo dotó de una fuerza y resistencia que lo harían un guardián temible; por otro, lo condenó a la esterilidad. La chispa que debía propagarse entre una multitud de iguales se concentró en uno solo, dejándolo como el único y último de su especie, un eco solitario de una sinfonía de llamas que jamás fue cantada.

Desde entonces, el Dragonus vaga por los rincones más desolados del mundo, un centinela de ruinas olvidadas y volcanes durmientes que nadie le ha encargado custodiar, salvo su propia naturaleza. Su existencia es una penitencia silenciosa, una llama que arde sin propósito más allá de su propia supervivencia. Se rumorea que en sus momentos de mayor melancolía, su aliento no es de fuego, sino un suspiro gélido que condensa el aire, transformando la obsidiana de su piel en gemas que lloran lágrimas de magma solidificado, recordatorio de la legión de hermanos que nunca tuvo. Aquellos lo suficientemente valientes para aventurarse en sus dominios no lo encuentran atacando con malicia, sino con la furia desesperada de quien desea ser dejado en paz, para arder solo en su eterna vigilia.`;

export default function CraftPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [gameTime, setGameTime] = useState({ hour: 0, minute: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [creature, setCreature] = useState<CreatureState>({
    nombre: '',
    composicion: '',
    tamano: 'medium',
    complexion: 'athletic',
    partesCuerpo: '',
    apariencia: '',
    afinidadElemental: 'fire',
    habilidadesUnicas: '',
    debilidades: '',
    ataque: 50,
    defensa: 50,
    velocidad: 50,
    inteligencia: 50,
    resistencia: 50,
    fuerza: 50,
    precision: 50,
    temperamento: 'lonely',
    dieta: '',
    habitat: '',
    rolSocial: '',
    aptoReproduccion: false,
    habilidadesCrianza: '',
    historiaOrigen: '',
  });

  const [generatedDescription, setGeneratedDescription] = useState(initialDescription);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCreature(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof CreatureState) => (value: string) => {
    setCreature(prev => ({ ...prev, [id]: value }));
  };

  const handleSliderChange = (id: keyof CreatureState) => (value: number[]) => {
    setCreature(prev => ({ ...prev, [id]: value[0] }));
  };

  const handleSwitchChange = (id: keyof CreatureState) => (checked: boolean) => {
    setCreature(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setGeneratedDescription('');
    try {
      const description = await describeCreature(creature);
      setGeneratedDescription(description);
      toast({
        title: "¡Descripción generada!",
        description: "La IA ha tejido una historia para tu criatura.",
      });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        variant: "destructive",
        title: "Error de la IA",
        description: "No se pudo generar la descripción. Inténtalo de nuevo.",
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
    }, 60000); // Update every minute for realism

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
                    <Label className="flex items-center gap-2"><Swords size={16}/> Ataque ({creature.ataque})</Label>
                    <Slider value={[creature.ataque]} onValueChange={handleSliderChange('ataque')} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><ShieldAlert size={16}/> Defensa ({creature.defensa})</Label>
                    <Slider value={[creature.defensa]} onValueChange={handleSliderChange('defensa')} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Wind size={16}/> Velocidad ({creature.velocidad})</Label>
                    <Slider value={[creature.velocidad]} onValueChange={handleSliderChange('velocidad')} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><BrainCircuit size={16}/> Inteligencia ({creature.inteligencia})</Label>
                    <Slider value={[creature.inteligencia]} onValueChange={handleSliderChange('inteligencia')} max={100} step={1} />
                </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><BatteryCharging size={16}/> Resistencia ({creature.resistencia})</Label>
                    <Slider value={[creature.resistencia]} onValueChange={handleSliderChange('resistencia')} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Dumbbell size={16}/> Fuerza ({creature.fuerza})</Label>
                    <Slider value={[creature.fuerza]} onValueChange={handleSliderChange('fuerza')} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Crosshair size={16}/> Precisión ({creature.precision})</Label>
                    <Slider value={[creature.precision]} onValueChange={handleSliderChange('precision')} max={100} step={1} />
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
                  Descripción Generada por IA
                </CardTitle>
                <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                  {isGenerating ? 'Generando...' : 'Generar Descripción'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               <Textarea 
                  id="generated-description" 
                  placeholder="La historia y lore de tu criatura aparecerá aquí..." 
                  className="min-h-[200px] bg-background/50"
                  value={generatedDescription}
                  readOnly
                />
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}
