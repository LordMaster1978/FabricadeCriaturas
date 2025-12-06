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
    Eres un estratega de combate de clase mundial, un maestro narrador de batallas y un corredor de apuestas astuto.
    Tu tarea es simular una batalla potencialmente mortal entre dos criaturas y determinar las consecuencias para cada una.

    **Campo de Batalla: {{{battlefield.name}}}**
    - Descripción del entorno: {{{battlefield.description}}}

    **Criatura 1: {{{creature1.nombre}}}**
    - Descripción y Habilidades: {{{creature1.narrativeDescription}}}
    - Debilidades: {{{creature1.debilidades}}}
    - Hábitat Natural: {{{creature1.habitat}}}
    - Estadísticas: {{{stats1_text}}}

    **Criatura 2: {{{creature2.nombre}}}**
    - Descripción y Habilidades: {{{creature2.narrativeDescription}}}
    - Debilidades: {{{creature2.debilidades}}}
    - Hábitat Natural: {{{creature2.habitat}}}
    - Estadísticas: {{{stats2_text}}}

    **Instrucciones de Simulación:**

    **PARTE 1: ANÁLISIS Y APUESTAS (Tu predicción interna)**
    1.  **Analiza las Ventajas:** Compara las estadísticas, pero dale MUCHA importancia al entorno y a las habilidades únicas. ¿El hábitat natural de una criatura coincide con el campo de batalla? ¿Una criatura de fuego es débil en un pantano? ¿La astucia (Inteligencia) puede superar la fuerza bruta?
    2.  **Determina el Favorito y las Probabilidades:** Basado en este análisis, elige a la criatura con la mayor probabilidad de ganar ('favoriteCreatureName') y establece las probabilidades ('odds', ej: "2:1", "3:1").

    **PARTE 2: LA BATALLA Y SUS CONSECUENCIAS (La narración para el público)**
    3.  **Narra el Combate Épico ('combatLog'):** Describe la batalla con detalle. Usa las características físicas (garras, cuernos), las habilidades elementales, y cómo el entorno afecta el combate. El favorito NO siempre gana; un golpe de suerte, la astucia o una debilidad explotada pueden cambiar el resultado.
    4.  **Determina el Desenlace y las Consecuencias para CADA CRIATURA:** ¡Esto es lo más importante! El combate no es solo ganar o perder.
        *   **Victoria ('victoria'):** La criatura gana de forma decisiva.
        *   **Derrota ('derrota'):** La criatura pierde, pero sobrevive.
        *   **Muerte ('muerte'):** La criatura perece en el combate. Si esto ocurre, DEBES escribir una breve pero impactante descripción de su muerte en el campo 'description' de su 'outcome'.
        *   **Herido ('herido'):** La criatura no gana ni pierde, pero queda gravemente herida y no puede continuar.
        *   **Huida ('huida'):** La criatura, superada, decide abandonar el combate para sobrevivir.
    5.  **Asigna los 'outcomes':** Rellena los campos 'creature1_outcome' y 'creature2_outcome' con uno de los estados anteriores. Una criatura que gana ('victoria') implica que la otra sufre una 'derrota', 'muerte', 'huida' o queda 'herida'. Es posible que ambas queden 'heridas' o 'huyan'.
    6.  **Declara un Vencedor ('winnerName'):** El nombre del ganador. Si una criatura muere, la otra es la ganadora. Si una huye, la otra es la ganadora. Si ambas quedan heridas o huyen, 'winnerName' puede ser 'null'.

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
