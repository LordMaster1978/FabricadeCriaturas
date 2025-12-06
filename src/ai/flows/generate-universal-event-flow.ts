'use server';
/**
 * @fileOverview Un flujo de IA para generar y continuar eventos universales basados en la interacción de una criatura con un planeta.
 * - generateUniversalEvent - Una función que genera el siguiente capítulo de una saga planetaria.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateUniversalEventInputSchema,
    type GenerateUniversalEventInput,
    GenerateUniversalEventOutputSchema,
    type GenerateUniversalEventOutput,
} from './universal-event-types';


const prompt = ai.definePrompt({
  name: 'generateUniversalEventPrompt',
  input: { schema: GenerateUniversalEventInputSchema },
  output: { schema: GenerateUniversalEventOutputSchema },
  prompt: `
    Eres un cronista de historia alternativa y un estratega militar experto en escenarios apocalípticos. Tu tarea es narrar el siguiente capítulo de la saga de una criatura en el planeta seleccionado, de forma realista, coherente y dramática.

    **REGLA DE ORO: REALISMO ABSOLUTO.**
    - **Ubicaciones Reales:** Si el planeta es la Tierra, utiliza exclusivamente ciudades, países y lugares geográficos reales (Ej: Nueva York, Desierto del Sahara, Río Nilo, Barcelona, La Antártida, El Teide). Si es otro planeta como Marte, describe sus características reales (cañones, volcanes extintos, casquetes polares de CO2).
    - **Tecnología Actual (si aplica):** Si el planeta es la Tierra, la respuesta de la humanidad se basa estrictamente en la tecnología militar y científica de hoy. No hay cañones de plasma ni escudos de energía. Sí hay misiles de crucero, cazas F-35, armas nucleares (como opción desesperada), satélites espía y equipos científicos. En planetas sin vida, no hay reacción tecnológica.
    - **Consecuencias Reales:** Describe el impacto realista y global. Un monstruo marino gigante en la Tierra provocaría tsunamis. Uno con aura de calor en Marte aceleraría la sublimación de sus casquetes polares. Piensa en el impacto geológico, climático y, si hay vida, en la crisis de refugiados, colapso económico, pandemias, etc.

    **Contexto General:**
    - Criatura: {{{creature.nombre}}}, {{{creature.narrativeDescription}}}.
    - Habilidades Clave: {{{creature.habilidadesUnicas}}}.
    - Debilidades: {{{creature.debilidades}}}.
    - Temperamento: {{{creature.temperamento}}}.
    - Planeta: {{{planet.name}}}.
    - Turno actual: {{{turn}}}.

    **Estado Actual del Planeta ({{planet.name}}):**
    - Descripción: {{{planet.description}}}.
    - Población Total: {{{planet.population}}}.
    - Demografía: {{{planet.demographics.adults}}} adultos, {{{planet.demographics.children}}} niños, etc.
    - Nivel de Devastación: {{{planet.devastationLevel}}}%.
    - Estado General: {{{planet.status}}}.
    
    **Historial de Sucesos Previos (Crónica del Evento):**
    {{#each eventLog}}
    - {{{this}}}
    {{/each}}

    **Instrucciones para este Turno (3 días en el juego):**

    1.  **Narra el Nuevo Suceso ('newLogEntry'):** Describe qué ha hecho la criatura en los últimos 3 días de forma cruda y realista, adaptado al planeta.
        *   **Acciones Coherentes:** Si es 'agresiva' en la Tierra, atacará centros de poder. Si es 'curiosa' en Marte, podría investigar el Rover Perseverance. Si es 'protectora' en un mundo sin vida, podría crear un nido o terraformar una pequeña área.
        *   **Impacto Demográfico y Ambiental:** Describe el efecto. Si ataca una ciudad, calcula bajas realistas y su impacto demográfico. Si su habilidad afecta al clima, describe la subida del nivel del mar en la Tierra, o las tormentas de polvo en Marte. Sé específico.
        *   **Reacción (si la hay):** En la Tierra, las naciones del mundo reaccionarían. En otros planetas, no hay reacción a menos que interactúe con algún rover o sonda. La historia debe ser sobre la criatura y su interacción con el entorno.
        *   **La historia debe avanzar.** Evita la repetición. Introduce giros: la criatura revela una nueva faceta de su habilidad, se adapta al nuevo entorno de forma inesperada (ej: una criatura de agua aprende a "nadar" en las arenas de Marte), o sufre los efectos del planeta (la radiación de Europa la hiere, el ácido de Venus corroe su piel).

    2.  **Actualiza el Estado del Planeta ('updatedPlanetState'):**
        *   Reduce la 'población' y la 'demografía' si hay bajas.
        *   Aumenta el 'devastationLevel' reflejando la destrucción de infraestructura o ecosistemas.
        *   Cambia el 'status' del planeta si la situación empeora ('Crisis Humanitaria', 'Ley Marcial Global', 'Colapso Climático', 'Colapsado', 'Aniquilado' para la Tierra, o 'Alterado' para otros planetas).

    3.  **Actualiza el Estado de la Criatura ('updatedCreatureStatus'):**
        *   Si el entorno es hostil o si los humanos consiguen un ataque efectivo, puede quedar 'Herida'. Si sufre un daño masivo, 'Muriendo'. Si el daño es definitivo, 'Muerta'. Si no sufre daño y sigue operando, su estado es 'Activa'.

    4.  **Determina si el Evento Termina ('isEventOver'):**
        *   El evento termina si la criatura es 'Muerta'.
        *   El evento termina si la población del planeta llega a 0.
        *   El evento puede terminar si se alcanza un final narrativo definitivo y creíble (ej: la criatura entra en hibernación, abandona el planeta).

    5.  **Genera un Resumen ('storySummary'):** En una o dos frases, resume el estado actual de la saga. Ejemplo: "Tras arrasar la costa este de EE.UU., Goliathus se dirige hacia Europa, mientras una coalición internacional prepara un ataque con misiles balísticos contra su punto débil recién descubierto."

    Sé brutal, creativo y rigurosamente coherente con el mundo que describes. El destino de mundos está en tu narración.
  `,
});


const generateUniversalEventFlow = ai.defineFlow(
  {
    name: 'generateUniversalEventFlow',
    inputSchema: GenerateUniversalEventInputSchema,
    outputSchema: GenerateUniversalEventOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("La IA no pudo generar una continuación para el evento universal.");
    }
    
    // Asegurarse de que el estado de la criatura sea uno de los valores permitidos
    const validStatuses = ['Saludable', 'Herido', 'Muriendo', 'Muerto', 'Activa'];
    if (!validStatuses.includes(output.updatedCreatureStatus)) {
        // Si la IA devuelve un estado no válido, se asume 'Activa' si el evento no ha terminado.
        output.updatedCreatureStatus = output.isEventOver ? 'Saludable' : 'Activa';
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
