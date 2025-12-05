'use server';
/**
 * @fileOverview Un flujo de IA para generar descripciones narrativas de criaturas.
 *
 * - describeCreature - Una función que genera una descripción basada en los atributos de una criatura.
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
    ataque: z.number().describe('El nivel de ataque de la criatura (0-100).'),
    defensa: z.number().describe('El nivel de defensa de la criatura (0-100).'),
    velocidad: z.number().describe('El nivel de velocidad de la criatura (0-100).'),
    inteligencia: z.number().describe('El nivel de inteligencia de la criatura (0-100).'),
    resistencia: z.number().describe('El nivel de resistencia de la criatura (0-100).'),
    fuerza: z.number().describe('El nivel de fuerza de la criatura (0-100).'),
    precision: z.number().describe('El nivel de precisión de la criatura (0-100).'),
    temperamento: z.string().describe('El temperamento de la criatura.'),
    dieta: z.string().describe('La dieta de la criatura.'),
    habitat: z.string().describe('El hábitat natural de la criatura.'),
    rolSocial: z.string().describe('El rol social de la criatura en su ecosistema.'),
    aptoReproduccion: z.boolean().describe('Si la criatura es apta para la reproducción.'),
    habilidadesCrianza: z.string().describe('Las habilidades de crianza de la criatura.'),
    historiaOrigen: z.string().describe('La historia de origen o lore de la criatura.'),
  });

export type DescribeCreatureInput = z.infer<typeof DescribeCreatureInputSchema>;

export type DescribeCreatureOutput = string;

const prompt = ai.definePrompt({
  name: 'describeCreaturePrompt',
  input: { schema: DescribeCreatureInputSchema },
  output: { format: 'text' },
  prompt: `
    Eres un maestro narrador y cronista de bestias fantásticas. Tu tarea es escribir una descripción evocadora y una historia de origen (lore) para una nueva criatura. Utiliza todos los detalles proporcionados para crear un retrato vívido y coherente. La descripción debe ser atractiva, imaginativa y sentirse como parte de un universo fantástico más grande.

    **Detalles de la Criatura:**
    - **Nombre:** {{{nombre}}}
    - **Composición y Materiales:** {{{composicion}}}
    - **Atributos Físicos:** Mide {{{tamano}}}, tiene una complexión {{{complexion}}}. Sus partes más notables son {{{partesCuerpo}}}. Su apariencia general y textura es {{{apariencia}}}.
    - **Afinidad Elemental:** {{{afinidadElemental}}}
    - **Habilidades Únicas:** {{{habilidadesUnicas}}}
    - **Debilidades:** {{{debilidades}}}
    - **Estadísticas de Combate:**
      - Ataque: {{{ataque}}}/100
      - Defensa: {{{defensa}}}/100
      - Velocidad: {{{velocidad}}}/100
      - Inteligencia: {{{inteligencia}}}/100
      - Resistencia: {{{resistencia}}}/100
      - Fuerza: {{{fuerza}}}/100
      - Precisión: {{{precision}}}/100
    - **Comportamiento y Lore:**
      - **Temperamento:** {{{temperamento}}}
      - **Dieta:** {{{dieta}}}
      - **Hábitat Natural:** {{{habitat}}}
      - **Rol Social:** {{{rolSocial}}}
      - **Reproducción:** {{{aptoReproduccion_text}}} (Habilidades de crianza: {{{habilidadesCrianza}}})
    - **Historia de Origen Sugerida por el Creador:** {{{historiaOrigen}}}

    **Instrucciones:**
    1.  **Introducción:** Comienza con una introducción cautivadora que presente a la criatura por su nombre.
    2.  **Descripción Física:** Describe su apariencia basándote en su tamaño, complexión, materiales y partes del cuerpo. Haz que suene majestuosa, aterradora o misteriosa según corresponda.
    3.  **Habilidades y Poderes:** Explica cómo su afinidad elemental y habilidades únicas se manifiestan. Menciona cómo sus estadísticas de combate se reflejan en su comportamiento en una pelea. No olvides tejer sus debilidades en la narrativa.
    4.  **Ecología y Comportamiento:** Describe cómo vive en su hábitat, qué come, cómo interactúa con otras criaturas (su rol social y temperamento).
    5.  **Reproducción y Crianza:** Si es apta, describe brevemente sus rituales o cómo cuida de sus crías.
    6.  **Historia y Lore:** Expande la historia de origen proporcionada, o si está vacía, inventa una que encaje con todos los demás atributos. ¿Es una creación mágica, una especie ancestral, una mutación? ¿Qué leyendas se cuentan sobre ella?

    **Tono:** Épico, descriptivo y narrativo, como si fuera una entrada en un bestiario legendario.
  `,
});

const describeCreatureFlow = ai.defineFlow(
  {
    name: 'describeCreatureFlow',
    inputSchema: DescribeCreatureInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Augment input with a textual representation of the boolean for the prompt
    const augmentedInput = {
      ...input,
      aptoReproduccion_text: input.aptoReproduccion ? 'Sí' : 'No',
    };

    const response = await prompt(augmentedInput);
    return response.output || 'No se pudo generar una descripción.';
  }
);

export async function describeCreature(
  input: DescribeCreatureInput
): Promise<DescribeCreatureOutput> {
  return describeCreatureFlow(input);
}
