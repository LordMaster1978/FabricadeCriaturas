'use server';
/**
 * @fileOverview Un flujo de IA para generar un planeta único con características detalladas.
 * - generatePlanet - Una función que crea un nuevo mundo desde cero.
 */
import { ai } from '@/ai/genkit';
import { PlanetStateSchema, type PlanetState } from './universal-event-types';


const prompt = ai.definePrompt({
  name: 'generatePlanetPrompt',
  output: { schema: PlanetStateSchema },
  prompt: `
    Eres un dios creador de mundos, un experto en astrofísica, biología especulativa y world-building. Tu tarea es generar UN planeta único y detallado con características coherentes.

    **Instrucciones para la Creación del Mundo:**

    1.  **Nombre del Planeta ('name'):** Invéntale un nombre evocador y único. (Ej: Xylos, Aethelgard, Krystallos, Cinderfall).

    2.  **Descripción ('description'):** Describe el planeta en un párrafo. ¿Cómo es su superficie (océanos de metano, selvas cristalinas, desiertos de metal, ciudades flotantes)? ¿Cuál es su característica más definitoria?

    3.  **Población y Demografía ('population', 'demographics'):**
        *   Decide si el planeta está habitado. Puede estar deshabitado (población 0), tener una civilización avanzada de miles de millones, o una población escasa de unos pocos miles.
        *   Si hay población, distribúyela de forma realista entre infantes, niños, adolescentes, adultos y ancianos. La suma total debe coincidir con el campo 'population'.
        *   Establece el mismo valor para 'population' y 'initialPopulation'.

    4.  **Estado Inicial ('devastationLevel', 'status'):**
        *   'devastationLevel' DEBE ser siempre 0 al empezar.
        *   'status' DEBE ser siempre 'Estable'.

    5.  **Coherencia y Creatividad:**
        *   La descripción debe ser coherente. Un planeta con océanos de ácido no debería tener una civilización basada en la agricultura tradicional.
        *   Sé creativo. Piensa en conceptos únicos: ¿Un planeta donde la flora es de silicio y se comunica con luz? ¿Un mundo post-apocalíptico donde los supervivientes viven en el subsuelo? ¿Un gigante gaseoso con formas de vida flotantes?

    No generes planetas del sistema solar real. Crea algo completamente nuevo. El resultado debe ser solo un objeto JSON que se ajuste al esquema, sin texto adicional.
  `,
});


const generatePlanetFlow = ai.defineFlow(
  {
    name: 'generatePlanetFlow',
    outputSchema: PlanetStateSchema,
  },
  async () => {
    const { output } = await prompt();
    if (!output) {
      throw new Error("La IA no pudo generar un nuevo planeta.");
    }
    // Asegurarse de que los valores iniciales son correctos
    output.devastationLevel = 0;
    output.status = 'Estable';
    output.initialPopulation = output.population;

    return output;
  }
);


export async function generatePlanet(): Promise<PlanetState> {
  try {
    return await generatePlanetFlow();
  } catch (error: any) {
    console.error("Error en el flujo generatePlanet:", error);
    throw new Error(error.message || "Ocurrió un error al generar el planeta.");
  }
}
