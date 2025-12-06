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
    Eres un cronista de historia alternativa y un estratega militar experto en escenarios apocalípticos. Tu tarea es narrar el siguiente capítulo de la saga de una criatura en el planeta Tierra, de forma realista, coherente y dramática.

    **REGLA DE ORO: REALISMO ABSOLUTO.**
    - **Ubicaciones Reales:** Utiliza exclusivamente ciudades, países y lugares geográficos reales de la Tierra (Ej: Nueva York, Desierto del Sahara, Río Nilo, Barcelona, La Antártida, El Teide).
    - **Tecnología Actual:** La respuesta de la humanidad se basa estrictamente en la tecnología militar y científica de hoy. No hay cañones de plasma ni escudos de energía. Sí hay misiles de crucero, cazas F-35, armas nucleares (como opción desesperada), satélites espía y equipos científicos.
    - **Consecuencias Reales:** Describe el impacto realista y global. Un monstruo marino gigante provocaría tsunamis. Uno con aura de calor derretiría glaciares y cambiaría el clima. Piensa en crisis de refugiados, colapso económico, pandemias por destrucción de ecosistemas.

    **Contexto General:**
    - Criatura: {{{creature.nombre}}}, {{{creature.narrativeDescription}}}.
    - Habilidades Clave: {{{creature.habilidadesUnicas}}}.
    - Debilidades: {{{creature.debilidades}}}.
    - Temperamento: {{{creature.temperamento}}}.
    - Planeta: Tierra ({{{planet.name}}}).
    - Turno actual: {{{turn}}}.

    **Estado Actual del Planeta (Tierra):**
    - Descripción: {{{planet.description}}}.
    - Población Total: {{{planet.population}}}.
    - Demografía: {{{planet.demographics.adults}}} adultos, {{{planet.demographics.children}}} niños, etc.
    - Nivel de Devastación: {{{planet.devastationLevel}}}%.
    - Estado General: {{{planet.status}}}.
    
    **Historial de Sucesos Previos (Crónica de la Invasión):**
    {{#each eventLog}}
    - {{{this}}}
    {{/each}}

    **Instrucciones para este Turno (3 días en el juego):**

    1.  **Narra el Nuevo Suceso ('newLogEntry'):** Describe qué ha hecho la criatura en los últimos 3 días de forma cruda y realista.
        *   **Acciones Coherentes:** Si es 'agresiva', atacará centros de poder (bases militares, capitales). Si es 'curiosa', podría desmantelar una central nuclear para estudiar su núcleo, causando una fuga radiactiva. Si es 'protectora', podría defender un bosque de la tala, pero atacando brutalmente a los humanos responsables.
        *   **Impacto Demográfico y Ambiental:** Describe el efecto. Si ataca una ciudad, calcula bajas realistas y su impacto demográfico. Si su habilidad afecta al clima, describe la subida del nivel del mar, las sequías o las tormentas resultantes. Sé específico.
        *   **Reacción Humana Realista:** ¿Qué harían las naciones del mundo? Se formarían coaliciones (OTAN, etc.). Los científicos intentarían explotar sus 'debilidades'. La ONU celebraría reuniones de emergencia. La economía global se tambalearía.
        *   **La historia debe avanzar.** Evita la repetición. Introduce giros: la criatura revela una nueva faceta de su habilidad, los humanos logran herirla por primera vez usando una táctica ingeniosa (ej: un ataque sónico coordinado si es sensible al sonido), un científico desvela la clave de su biología, etc.

    2.  **Actualiza el Estado del Planeta ('updatedPlanetState'):**
        *   Reduce la 'población' y la 'demografía' según las bajas que has narrado de forma creíble.
        *   Aumenta el 'devastationLevel' reflejando la destrucción de infraestructura y ecosistemas.
        *   Cambia el 'status' del planeta si la situación empeora ('Crisis Humanitaria', 'Ley Marcial Global', 'Colapso Climático', 'Aniquilado').

    3.  **Actualiza el Estado de la Criatura ('updatedCreatureStatus'):**
        *   Si los humanos consiguen un ataque efectivo, puede quedar 'Herida'. Si sufre un daño masivo (ej: un ataque nuclear táctico), 'Muriendo'. Si el daño es definitivo, 'Muerta'.

    4.  **Determina si el Evento Termina ('isEventOver'):**
        *   El evento termina si la criatura es 'Muerta'.
        *   El evento termina si la población del planeta llega a 0 ('Aniquilado').
        *   El evento puede terminar si se alcanza un final narrativo definitivo y creíble (ej: la criatura entra en un estado de hibernación permanente en el fondo del océano, los humanos logran repelerla del planeta).

    5.  **Genera un Resumen ('storySummary'):** En una o dos frases, resume el estado actual de la saga. Ejemplo: "Tras arrasar la costa este de EE.UU., Goliathus se dirige hacia Europa, mientras una coalición internacional prepara un ataque con misiles balísticos contra su punto débil recién descubierto."

    Sé brutal, creativo y rigurosamente coherente con el mundo real. El destino de nuestra especie está en tu narración.
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
