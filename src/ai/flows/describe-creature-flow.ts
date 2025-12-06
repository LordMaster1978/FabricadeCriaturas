'use server';
/**
 * @fileOverview Un flujo de IA para generar descripciones narrativas y valoraciones de criaturas.
 *
 * - describeCreature - Una función que genera una descripción y valoración basada en los atributos de una criatura.
 * - DescribeCreatureInput - El tipo de entrada para la función describeCreature.
 * - DescribeCreatureOutput - El tipo de retorno para la función describeCreature.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DescribeCreatureInputSchema = z.object({
    nombre: z.string().describe('El nombre de la criatura.'),
    composicion: z.string().describe('La composición y materiales de la criatura.'),
    tamano: z.string().describe('El tamaño de la criatura.'),
    complexion: z.string().describe('La complexión física de la criatura.'),
    partesCuerpo: z.string().describe('Las partes distintivas del cuerpo de la criatura.'),
    apariencia: z.string().describe('La apariencia y textura de la criatura.'),
    afinidadElemental: z.string().describe('El elemento al que la criatura es afín.'),
    habilidadesUnicas: z.string().describe('Las habilidades únicas de la criatura.'),
    debilidades: z.string().describe('Las debilidades de la criatura.'),
    temperamento: z.string().describe('El temperamento de la criatura.'),
    dieta: z.string().describe('La dieta de la criatura.'),
    habitat: z.string().describe('El hábitat natural de la criatura.'),
    rolSocial: z.string().describe('El rol social de la criatura en su ecosistema.'),
    aptoReproduccion: z.boolean().describe('Si la criatura es apta para la reproducción.'),
    habilidadesCrianza: z.string().describe('Las habilidades de crianza de la criatura.'),
    historiaOrigen: z.string().describe('La historia de origen o lore de la criatura.'),
  });

export type DescribeCreatureInput = z.infer<typeof DescribeCreatureInputSchema>;

const DescribeCreatureOutputSchema = z.object({
  nombre: z.string().describe("El nombre de la criatura."),
  narrativeDescription: z.string().describe("La descripción narrativa completa y el lore de la criatura, escrita en un tono épico de bestiario. Debe tener al menos 5 párrafos."),
  combatStats: z.object({
    Ataque: z.number().min(0).max(100),
    Defensa: z.number().min(0).max(100),
    Velocidad: z.number().min(0).max(100),
    Inteligencia: z.number().min(0).max(100),
    Resistencia: z.number().min(0).max(100),
    Fuerza: z.number().min(0).max(100),
    Precision: z.number().min(0).max(100),
  }).describe("Las estadísticas de combate generadas para la criatura, con una justificación dentro de la descripción narrativa."),
  rarity: z.enum(["Común", "Poco Común", "Raro", "Épico", "Legendario"]).describe("La clasificación de rareza de la criatura."),
  expertValuation: z.string().describe("Una reseña desde la perspectiva de un experto o estudioso de criaturas, analizando sus fortalezas y debilidades de forma técnica."),
  publicValuation: z.string().describe("Una reseña desde la perspectiva del público general o aventureros, con un tono más coloquial y basado en experiencias o rumores."),
  aiValuation: z.string().describe("Una meta-reseña de la propia IA, comentando sobre el diseño y la coherencia de la criatura que ha ayudado a crear."),
  starRating: z.number().min(1).max(5).describe("Una valoración final en formato de estrellas (1 a 5) basada en el poder, originalidad y coherencia general de la criatura."),
});


export type DescribeCreatureOutput = z.infer<typeof DescribeCreatureOutputSchema>;

const prompt = ai.definePrompt({
  name: 'describeCreaturePrompt',
  input: { schema: DescribeCreatureInputSchema },
  output: { schema: DescribeCreatureOutputSchema },
  prompt: `
    Eres un maestro narrador, un diseñador de juegos de rol y un crítico experto. Tu tarea es crear una ficha de valoración completa para una nueva criatura.

    **Instrucciones:**
    1.  **Devuelve el Nombre:** Asegúrate de que el campo 'nombre' en la salida sea el mismo que el proporcionado en la entrada.
    2.  **Genera Estadísticas de Combate (0-100):** Basándote en todos los detalles proporcionados (tamaño, complexión, composición, etc.), asigna valores numéricos de 0 a 100 para Ataque, Defensa, Velocidad, Inteligencia, Resistencia, Fuerza y Precisión.
    3.  **Escribe la Descripción Narrativa:** Redacta una descripción evocadora y una historia de origen (lore) para la criatura. **Dentro de esta narrativa, justifica brevemente por qué has elegido los valores de las estadísticas**. Por ejemplo, una criatura 'gigante' y 'robusta' debería tener alta Fuerza y Resistencia.
    4.  **Determina la Rareza:** Clasifica la criatura como "Común", "Poco Común", "Raro", "Épico" o "Legendario" basándote en su origen, poder y unicidad.
    5.  **Escribe las Reseñas:**
        *   **Valoración de Expertos:** Escribe una reseña desde la perspectiva de un erudito, analizando sus capacidades de forma técnica.
        *   **Valoración del Público:** Escribe una reseña como si fueras un aventurero o un ciudadano común, basándote en rumores o encuentros.
        *   **Valoración de la IA:** Escribe una breve autocrítica sobre el concepto de la criatura, comentando su originalidad y coherencia.
    6.  **Asigna Puntuación de Estrellas:** Otorga una puntuación final de 1 a 5 estrellas, resumiendo su poder, originalidad y diseño general.

    **Tono:** Épico, descriptivo y como si fuera una entrada en un bestiario legendario para la descripción; analítico para los expertos; coloquial para el público; y objetivo para la IA.

    **Detalles de la Criatura:**
    - **Nombre:** {{{nombre}}}
    - **Composición:** {{{composicion}}}
    - **Físico:** Tamaño {{{tamano}}}, complexión {{{complexion}}}, partes notables {{{partesCuerpo}}}, apariencia {{{apariencia}}}.
    - **Poderes:** Afinidad elemental a {{{afinidadElemental}}}, habilidades únicas {{{habilidadesUnicas}}}, debilidades {{{debilidades}}}.
    - **Comportamiento:** Temperamento {{{temperamento}}}, dieta {{{dieta}}}, hábitat {{{habitat}}}, rol social {{{rolSocial}}}.
    - **Reproducción:** Apto: {{{aptoReproduccion_text}}} (Habilidades de crianza: {{{habilidadesCrianza}}}).
    - **Historia Sugerida:** {{{historiaOrigen}}}
  `,
});

const describeCreatureFlow = ai.defineFlow(
  {
    name: 'describeCreatureFlow',
    inputSchema: DescribeCreatureInputSchema,
    outputSchema: DescribeCreatureOutputSchema,
  },
  async (input) => {
    // Augment input with a textual representation of the boolean for the prompt
    const augmentedInput = {
      ...input,
      aptoReproduccion_text: input.aptoReproduccion ? 'Sí' : 'No',
    };

    const response = await prompt(augmentedInput);
    
    if (!response.output) {
      throw new Error("La IA no pudo generar una respuesta estructurada.");
    }
    
    return {
      ...response.output,
      nombre: input.nombre, // Ensure the name is passed through
    };
  }
);

export async function describeCreature(
  input: DescribeCreatureInput
): Promise<DescribeCreatureOutput> {
  return describeCreatureFlow(input);
}
