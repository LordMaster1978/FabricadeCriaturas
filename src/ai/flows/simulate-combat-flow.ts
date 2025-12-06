'use server';
/**
 * @fileOverview Un flujo de IA para simular un combate entre dos criaturas.
 *
 * - simulateCombat - Una función que genera una narración de combate y determina un ganador.
 * - SimulateCombatInput - El tipo de entrada para la función simulateCombat.
 * - SimulateCombatOutput - El tipo de retorno para la función simulateCombat.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type DescribeCreatureOutput } from './describe-creature-flow';

// El objeto de entrada contendrá las dos criaturas que van a luchar.
const SimulateCombatInputSchema = z.object({
  creature1: z.custom<DescribeCreatureOutput>(),
  creature2: z.custom<DescribeCreatureOutput>(),
});
export type SimulateCombatInput = z.infer<typeof SimulateCombatInputSchema>;

// El objeto de salida contendrá el registro del combate y el nombre del ganador.
const SimulateCombatOutputSchema = z.object({
  combatLog: z.string().describe("Una narración detallada y épica del combate, turno por turno, describiendo las acciones, reacciones y el clímax de la batalla."),
  winnerName: z.string().describe("El nombre de la criatura que ha ganado el combate."),
});
export type SimulateCombatOutput = z.infer<typeof SimulateCombatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'simulateCombatPrompt',
  input: { schema: SimulateCombatInputSchema },
  output: { schema: SimulateCombatOutputSchema },
  prompt: `
    Eres un maestro narrador de batallas épicas, un "Dungeon Master" experto en combates de criaturas fantásticas.
    Tu tarea es simular una batalla a muerte entre las dos criaturas proporcionadas y narrarla de forma emocionante.

    **Criatura 1: {{{creature1.nombre}}}**
    - Descripción: {{{creature1.narrativeDescription}}}
    - Estadísticas: {{{JSON.stringify(creature1.combatStats)}}}
    - Rareza: {{{creature1.rarity}}}

    **Criatura 2: {{{creature2.nombre}}}**
    - Descripción: {{{creature2.narrativeDescription}}}
    - Estadísticas: {{{JSON.stringify(creature2.combatStats)}}}
    - Rareza: {{{creature2.rarity}}}

    **Instrucciones de Simulación:**
    1.  **Analiza a los Contendientes:** Revisa cuidadosamente las estadísticas de combate, las descripciones, habilidades, debilidades, composición y temperamento de ambas criaturas.
    2.  **Determina la Iniciativa:** La criatura con mayor 'Velocidad' generalmente ataca primero. Si es similar, considera su 'Inteligencia' o 'Temperamento' (una criatura 'Agresiva' podría lanzarse al ataque).
    3.  **Narra el Combate por Turnos:** Describe la batalla de forma vívida y detallada.
        *   ¿Cómo utiliza la criatura más rápida su ventaja?
        *   ¿Cómo impactan los ataques? ¿La 'Defensa' del objetivo mitiga el daño? ¿Su 'Resistencia' le permite seguir luchando?
        *   ¿Cómo se usan las 'Habilidades Únicas'? ¿Se explotan las 'Debilidades' del oponente?
        *   Usa las descripciones físicas. Una criatura 'masiva' podría usar su peso, mientras que una 'atlética' usaría la agilidad.
        *   El 'Ataque' y la 'Fuerza' determinan el potencial de daño, mientras que la 'Precisión' determina si el golpe acierta.
    4.  **Crea un Clímax:** La batalla debe tener un punto de inflexión. Quizás una criatura usa una habilidad desesperada, o una de ellas comete un error fatal.
    5.  **Declara un Vencedor:** Basado en la simulación lógica, determina qué criatura gana. El ganador debe tener una ventaja clara según sus estadísticas y habilidades. Justifica el resultado en la narración. Por ejemplo, "A pesar de la fuerza bruta de X, la velocidad y astucia superiores de Y le permitieron esquivar el ataque final y asestar un golpe crítico en su punto débil".
    6.  **Formato de Salida:**
        *   combatLog: Debe ser una historia coherente y emocionante, no solo una lista de acciones.
        *   winnerName: Debe ser exactamente el nombre de la criatura ganadora.

    ¡Que comience la batalla!
  `,
});

const simulateCombatFlow = ai.defineFlow(
  {
    name: 'simulateCombatFlow',
    inputSchema: SimulateCombatInputSchema,
    outputSchema: SimulateCombatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

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
