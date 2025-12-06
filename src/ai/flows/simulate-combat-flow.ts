'use server';
/**
 * @fileOverview Un flujo de IA para simular un combate entre dos criaturas, considerando el entorno y generando probabilidades de apuesta.
 *
 * - simulateCombat - Una función que genera una narración de combate, determina un ganador y establece las apuestas.
 * - SimulateCombatInput - El tipo de entrada para la función simulateCombat.
 * - SimulateCombatOutput - El tipo de retorno para la función simulateCombat.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type DescribeCreatureOutput } from './describe-creature-flow';

const CreatureInputSchema = z.custom<DescribeCreatureOutput>();

const SimulateCombatInputSchema = z.object({
  creature1: CreatureInputSchema,
  creature2: CreatureInputSchema,
  battlefield: z.object({
    name: z.string(),
    description: z.string(),
  }),
});
export type SimulateCombatInput = z.infer<typeof SimulateCombatInputSchema>;


const CombatOutcomeSchema = z.object({
  outcome: z.enum(['victoria', 'derrota', 'muerte', 'herido', 'huida']),
  description: z.string().optional().describe("Descripción del resultado, especialmente importante si es 'muerte'."),
});

const SimulateCombatOutputSchema = z.object({
  combatLog: z.string().describe("Una narración detallada y épica del combate, describiendo las acciones, el entorno, las reacciones y el clímax de la batalla."),
  winnerName: z.string().nullable().describe("El nombre de la criatura que ha ganado el combate. Puede ser null si ambos huyen o mueren."),
  favoriteCreatureName: z.string().describe("El nombre de la criatura considerada favorita para ganar ANTES del combate."),
  odds: z.string().describe("Las probabilidades de la apuesta para el favorito, en formato 'X:1'."),
  creature1_outcome: CombatOutcomeSchema,
  creature2_outcome: CombatOutcomeSchema,
});
export type SimulateCombatOutput = z.infer<typeof SimulateCombatOutputSchema>;


const prompt = ai.definePrompt({
  name: 'simulateCombatPrompt',
  input: { schema: z.object({
      creature1: CreatureInputSchema,
      creature2: CreatureInputSchema,
      stats1_text: z.string(),
      stats2_text: z.string(),
      battlefield: z.object({
        name: z.string(),
        description: z.string(),
      }),
  }) },
  output: { schema: SimulateCombatOutputSchema },
  prompt: `
    Eres un estratega de combate de clase mundial, un maestro narrador de batallas y un corredor de apuestas astuto con un toque de psicólogo de criaturas. Tu tarea es simular una batalla épica y potencialmente mortal entre dos criaturas, considerando todos los factores posibles: fuerza, inteligencia, entorno y, sobre todo, su temperamento y astucia.

    **Campo de Batalla: {{{battlefield.name}}}**
    - Descripción del entorno: {{{battlefield.description}}}

    **Criatura 1: {{{creature1.nombre}}}**
    - Descripción, Habilidades y Lore: {{{creature1.narrativeDescription}}}
    - Debilidades: {{{creature1.debilidades}}}
    - Hábitat Natural: {{{creature1.habitat}}}
    - Rol Ecológico y Relaciones Simbióticas: {{{creature1.rolEcologico}}}, {{{creature1.relacionesSimbioticas}}}
    - **Temperamento: {{{creature1.temperamento}}}**
    - Estadísticas: {{{stats1_text}}}

    **Criatura 2: {{{creature2.nombre}}}**
    - Descripción, Habilidades y Lore: {{{creature2.narrativeDescription}}}
    - Debilidades: {{{creature2.debilidades}}}
    - Hábitat Natural: {{{creature2.habitat}}}
    - Rol Ecológico y Relaciones Simbióticas: {{{creature2.rolEcologico}}}, {{{creature2.relacionesSimbioticas}}}
    - **Temperamento: {{{creature2.temperamento}}}**
    - Estadísticas: {{{stats2_text}}}

    **Instrucciones de Simulación:**

    **PARTE 1: ANÁLISIS Y APUESTAS (Tu predicción interna)**
    1.  **Analiza las Ventajas:** Compara las estadísticas, pero dale MUCHA importancia a las habilidades únicas, la inteligencia, las debilidades y el entorno. ¿El hábitat natural de una criatura coincide con el campo de batalla? ¿Una criatura de fuego es débil en un pantano? ¿Una criatura voladora domina en campo abierto pero sufre en una cueva estrecha?
    2.  **Determina el Favorito y las Probabilidades:** Basado en este análisis, elige a la criatura con la mayor probabilidad de ganar ('favoriteCreatureName') y establece las probabilidades ('odds', ej: "2:1", "3:1", "5:1"). El favorito es solo una predicción, no garantiza la victoria.

    **PARTE 2: LA BATALLA Y SUS CONSECUENCIAS (La narración para el público)**
    3.  **Narra el Combate Estratégico ('combatLog'):** Describe la batalla con detalle. El combate no es un simple intercambio de golpes. Las criaturas deben ser astutas.
        *   **Uso del Entorno:** La criatura debe usar el entorno. Puede preparar una emboscada, usar árboles para cobertura, llevar al oponente a un terreno peligroso (un acantilado, un río de lava), causar un derrumbe, etc.
        *   **Uso de Habilidades:** Describe cómo usan sus características físicas (garras, cuernos, veneno) y habilidades especiales.
        *   **Inteligencia y Táctica:** Una criatura inteligente, aunque más débil, puede crear trampas o encontrar un punto débil inesperado. Una criatura con 'rol ecológico' o 'relaciones simbióticas' podría ¡llamar a aliados! (ej: un enjambre de avispas, una manada de lobos).
    4.  **Punto de Inflexión y Decisión del Vencedor (¡LO MÁS IMPORTANTE!):** Narra el momento en que una criatura está claramente derrotada. ¿Suplica clemencia? ¿Intenta huir? La criatura dominante ahora decide, y su **temperamento** es el factor decisivo:
        *   Si el vencedor es **piadoso, sabio o estoico**, y el perdedor muestra sumisión, puede perdonar la vida, dejando al oponente 'herido' o simplemente 'derrotado'.
        *   Si el vencedor es **cruel, agresivo o territorial**, no mostrará piedad. El resultado es 'muerte'. En este caso, la descripción de la muerte ('outcome.description') debe ser explícita y reflejar su naturaleza. Ejemplo: "No contento con la victoria, [Vencedor] torturó a [Perdedor] lentamente, un acto abominable para saborear su poder antes de asestar el golpe final."
        *   Un vencedor **orgulloso pero no necesariamente sádico** puede permitir que el oponente 'huya' para demostrar su superioridad.
        *   **Huida Exitosa:** Una huida solo tiene éxito si el perdedor es significativamente más rápido, usa una habilidad para escapar (invisibilidad, teletransporte) O si el vencedor, por arrogancia o un código de honor, le permite escapar. La narración debe explicar por qué la huida fue posible.
    5.  **Asigna los 'outcomes':** Rellena los campos 'creature1_outcome' y 'creature2_outcome' con uno de los siguientes estados: 'victoria', 'derrota', 'muerte', 'herido', 'huida'.
    6.  **Declara un Vencedor ('winnerName'):** El nombre del ganador. Si una criatura muere o huye, la otra es la ganadora. Si ambas quedan heridas o huyen, 'winnerName' puede ser 'null'.

    ¡Que comience la simulación!
  `,
});

const simulateCombatFlow = ai.defineFlow(
  {
    name: 'simulateCombatFlow',
    inputSchema: SimulateCombatInputSchema,
    outputSchema: SimulateCombatOutputSchema,
  },
  async (input) => {
    const augmentedInput = {
        ...input,
        stats1_text: JSON.stringify(input.creature1.combatStats),
        stats2_text: JSON.stringify(input.creature2.combatStats),
    };

    const { output } = await prompt(augmentedInput);

    if (!output) {
      throw new Error("La IA no pudo generar una simulación de combate.");
    }

    return output;
  }
);

export async function simulateCombat(
  input: SimulateCombatInput
): Promise<SimulateCombatOutput> {
  try {
    return await simulateCombatFlow(input);
  } catch (error: any) {
    console.error("Error en el flujo simulateCombat:", error);
    throw new Error(error.message || "Ocurrió un error al simular el combate.");
  }
}
