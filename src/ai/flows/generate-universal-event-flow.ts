'use server';
/**
 * @fileOverview Un flujo de IA para generar y continuar eventos universales basados en la interacción de una criatura con un planeta.
 * - generateUniversalEvent - Una función que genera el siguiente capítulo de una saga planetaria.
 * - GenerateUniversalEventInput - El tipo de entrada para la función.
 * - GenerateUniversalEventOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type DescribeCreatureOutput } from './describe-creature-flow';

const CreatureSchema = z.custom<DescribeCreatureOutput>();

const PlanetStateSchema = z.object({
  name: z.string(),
  population: z.number(),
  initialPopulation: z.number(),
  demographics: z.object({
    infants: z.number(),
    children: z.number(),
    adolescents: z.number(),
    adults: z.number(),
    elderly: z.number(),
  }),
  devastationLevel: z.number().min(0).max(100),
  description: z.string(),
  status: z.enum(['Estable', 'En Pánico', 'Bajo Asedio', 'Colapsado', 'Aniquilado']),
});

export const UniversalEventSchema = z.object({
  id: z.string(),
  creature: CreatureSchema,
  planet: PlanetStateSchema,
  eventLog: z.array(z.string()),
  storySummary: z.string(),
  turn: z.number(),
  isActive: z.boolean(),
  startDate: z.string(),
});
export type UniversalEvent = z.infer<typeof UniversalEventSchema>;


export const GenerateUniversalEventInputSchema = z.object({
  creature: CreatureSchema,
  planet: PlanetStateSchema,
  eventLog: z.array(z.string()),
  turn: z.number(),
});
export type GenerateUniversalEventInput = z.infer<typeof GenerateUniversalEventInputSchema>;


const GenerateUniversalEventOutputSchema = z.object({
  newLogEntry: z.string().describe("La narración del nuevo suceso que acaba de ocurrir. Debe ser un párrafo detallado que continúe la historia."),
  storySummary: z.string().describe("Un resumen actualizado de la situación global en el planeta. Máximo dos frases."),
  updatedPlanetState: PlanetStateSchema.describe("El estado actualizado del planeta después del suceso (población, demografía, devastación, etc.)."),
  updatedCreatureStatus: z.enum(['Activa', 'Herida', 'Muriendo', 'Muerta']).describe("El nuevo estado de salud de la criatura."),
  isEventOver: z.boolean().describe("Indica si el evento ha concluido (la criatura muere, la humanidad es aniquilada o se alcanza un final definitivo)."),
});
export type GenerateUniversalEventOutput = z.infer<typeof GenerateUniversalEventOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateUniversalEventPrompt',
  input: { schema: GenerateUniversalEventInputSchema },
  output: { schema: GenerateUniversalEventOutputSchema },
  prompt: `
    Eres un cronista cósmico y un maestro narrador de ciencia ficción. Tu tarea es narrar el siguiente capítulo de la saga de una criatura en un planeta. La historia debe ser coherente, dramática y evolucionar con el tiempo.

    **Contexto General:**
    - Criatura: {{{creature.nombre}}}, {{{creature.narrativeDescription}}}.
    - Habilidades Clave: {{{creature.habilidadesUnicas}}}.
    - Debilidades: {{{creature.debilidades}}}.
    - Temperamento: {{{creature.temperamento}}}.
    - Planeta: {{{planet.name}}}.
    - Turno actual: {{{turn}}}.

    **Estado Actual del Planeta:**
    - Descripción: {{{planet.description}}}.
    - Población Total: {{{planet.population}}}.
    - Demografía: {{{planet.demographics.adults}}} adultos, {{{planet.demographics.children}}} niños, etc.
    - Nivel de Devastación: {{{planet.devastationLevel}}}%.
    - Estado General: {{{planet.status}}}.
    
    **Historial de Sucesos Previos:**
    {{#each eventLog}}
    - {{{this}}}
    {{/each}}

    **Instrucciones para este Turno (3 días en el juego):**

    1.  **Narra el Nuevo Suceso ('newLogEntry'):** Describe qué ha hecho la criatura en los últimos 3 días.
        *   **Acciones basadas en el Temperamento:** Si es 'agresiva' o 'territorial', probablemente ataque ciudades o ejércitos. Si es 'curiosa', podría investigar infraestructuras sin destruirlas necesariamente. Si es 'protectora' o 'sabia', podría intentar comunicarse o incluso defender a una parte de la población de un peligro (incluso uno que ella misma creó sin querer).
        *   **Impacto en la Población:** Describe el efecto de sus acciones. Si ataca una ciudad, calcula de forma CREATIVA pero COHERENTE cuánta gente muere. Afecta a la demografía. Por ejemplo, un ataque a un distrito de negocios mata más 'adultos', un ataque a una zona residencial puede afectar a todas las edades. No seas genérico.
        *   **Reacción Humana:** Describe la reacción de los habitantes del planeta. ¿Los ejércitos atacan a la criatura? ¿Los científicos intentan estudiarla? ¿Surge un culto que la adora? La reacción debe ser una consecuencia lógica de las acciones de la criatura.
        *   **La historia debe avanzar.** Evita repetir siempre "la criatura destruyó otra ciudad". Introduce giros: la criatura revela una nueva habilidad, los humanos desarrollan una nueva arma, un científico logra un avance en la comunicación, etc.

    2.  **Actualiza el Estado del Planeta ('updatedPlanetState'):**
        *   Reduce la 'población' y la 'demografía' según las bajas que has narrado.
        *   Aumenta el 'devastationLevel' si ha habido destrucción.
        *   Cambia el 'status' del planeta si la situación ha empeorado ('En Pánico', 'Colapsado', etc.).

    3.  **Actualiza el Estado de la Criatura ('updatedCreatureStatus'):**
        *   Si los humanos contraatacan con fuerza, la criatura puede resultar 'Herida'. Si sufre un daño masivo, puede quedar 'Muriendo'. Si el daño es definitivo, 'Muerta'.

    4.  **Determina si el Evento Termina ('isEventOver'):**
        *   El evento termina si la criatura es 'Muerta'.
        *   El evento termina si la población del planeta llega a 0 ('Aniquilado').
        *   El evento puede terminar si se alcanza un final narrativo definitivo (ej: la criatura abandona el planeta, se establece una paz duradera, etc.).

    5.  **Genera un Resumen ('storySummary'):** En una o dos frases, resume el estado actual de la saga. Ejemplo: "La criatura, ahora conocida como 'El Devorador de Acero', ha destruido la capital del este, mientras los ejércitos preparan una ofensiva nuclear desesperada."

    Sé creativo, dramático y coherente. ¡El destino de un mundo está en tu narración!
  `,
});


const generateUniversalEventFlow = ai.defineFlow(
  {
    name: 'generateUniversalEventFlow',
    inputSchema: GenerateUniversalEventInputSchema,
    outputSchema: GenerateUniversalert-EventOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("La IA no pudo generar una continuación para el evento universal.");
    }
    return output;
  }
);


export async function generateUniversalEvent(
  input: GenerateUniversalEventInput
): Promise<GenerateUniversalEventOutput> {
  try {
    return await generateUniversalEventFlow(input);
  } catch (error: any) {
    console.error("Error en el flujo generateUniversalEvent:", error);
    throw new Error(error.message || "Ocurrió un error al generar el evento universal.");
  }
}
