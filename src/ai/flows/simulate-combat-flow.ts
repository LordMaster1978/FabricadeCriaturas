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

const SimulateCombatInputSchema = z.object({
  creature1: z.custom<DescribeCreatureOutput>(),
  creature2: z.custom<DescribeCreatureOutput>(),
  battlefield: z.object({
    name: z.string(),
    description: z.string(),
  }),
});
export type SimulateCombatInput = z.infer<typeof SimulateCombatInputSchema>;

const SimulateCombatOutputSchema = z.object({
  combatLog: z.string().describe("Una narración detallada y épica del combate, describiendo las acciones, el entorno, las reacciones y el clímax de la batalla."),
  winnerName: z.string().describe("El nombre de la criatura que ha ganado el combate."),
  favoriteCreatureName: z.string().describe("El nombre de la criatura considerada favorita para ganar ANTES del combate."),
  odds: z.string().describe("Las probabilidades de la apuesta para el favorito, en formato 'X:1'."),
});

const prompt = ai.definePrompt({
  name: 'simulateCombatPrompt',
  input: { schema: z.object({
      creature1: z.custom<DescribeCreatureOutput>(),
      creature2: z.custom<DescribeCreatureOutput>(),
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
    Tu tarea es doble:
    1.  Analizar a los contendientes y el entorno para predecir un ganador y establecer las probabilidades.
    2.  Simular una batalla a muerte entre las dos criaturas y narrarla de forma emocionante, donde el favorito NO siempre gana.

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
    1.  **Analiza las Ventajas:** Compara las estadísticas, pero dale MUCHA importancia al entorno. ¿El hábitat natural de una criatura coincide con el campo de batalla? ¿Su composición (ej: fuego) es una desventaja en un pantano? ¿La toxicidad del aire afecta a una criatura más que a otra?
    2.  **Determina el Favorito:** Basado en este análisis completo, elige a la criatura con la mayor probabilidad de ganar. Este será tu 'favoriteCreatureName'.
    3.  **Establece las Probabilidades:** Define las probabilidades ('odds') para tu favorito. Si la ventaja es clara, las probabilidades pueden ser altas (ej. "3:1"). Si es un combate reñido, pueden ser bajas (ej. "1.5:1"). Sé creativo, puedes usar "2:1", "5:2", etc.

    **PARTE 2: LA BATALLA (La narración para el público)**
    4.  **Simula el Combate:** ¡Aquí es donde la magia ocurre! El favorito que elegiste NO tiene la victoria garantizada. La astucia (Inteligencia), un golpe de suerte, o el uso inesperado de una habilidad o del entorno pueden cambiar el curso de la batalla.
    5.  **Narra con Detalle Épico:**
        *   Describe cómo el entorno influye en el combate. ¿Una criatura usa los árboles para una emboscada? ¿El suelo inestable perjudica a la criatura más pesada?
        *   Usa explícitamente las características físicas: "Clavó su gran cuerno...", "Sus garras afiladas rasgaron la coraza...", "Se protegió con su escudo de quitina".
        *   La 'Inteligencia' y 'Astucia' son clave. Una criatura más inteligente puede usar el entorno a su favor o explotar una debilidad que una criatura más fuerte pero bruta no vería.
    6.  **Declara un Vencedor Real:** Basado en tu simulación narrativa, determina quién gana realmente la pelea. Este será el 'winnerName'.
    7.  **Formato de Salida:** Rellena todos los campos: 'combatLog', 'winnerName', 'favoriteCreatureName', y 'odds'.

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
