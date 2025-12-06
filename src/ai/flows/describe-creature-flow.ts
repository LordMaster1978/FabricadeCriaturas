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
    temperamento: z.string().describe('El temperamento de la criatura.'),
    dieta: z.string().describe('La dieta de la criatura.'),
    habitat: z.string().describe('El hábitat natural de la criatura.'),
    rolSocial: z.string().describe('El rol social de la criatura en su ecosistema.'),
    aptoReproduccion: z.boolean().describe('Si la criatura es apta para la reproducción.'),
    habilidadesCrianza: z.string().describe('Las habilidades de crianza de la criatura.'),
    historiaOrigen: z.string().describe('La historia de origen o lore de la criatura.'),
    // Las estadísticas ya no son entradas directas del usuario, pero las mantenemos para la lógica interna.
    ataque: z.number().optional(),
    defensa: z.number().optional(),
    velocidad: z.number().optional(),
    inteligencia: z.number().optional(),
    resistencia: z.number().optional(),
    fuerza: z.number().optional(),
    precision: z.number().optional(),
  });

export type DescribeCreatureInput = z.infer<typeof DescribeCreatureInputSchema>;

export type DescribeCreatureOutput = string;

const prompt = ai.definePrompt({
  name: 'describeCreaturePrompt',
  input: { schema: DescribeCreatureInputSchema },
  output: { format: 'text' },
  prompt: `
    Eres un maestro narrador y un diseñador de juegos de rol. Tu tarea es escribir una descripción evocadora y una historia de origen (lore) para una nueva criatura. Además, debes **generar y justificar sus estadísticas de combate** basándote en sus atributos físicos y de comportamiento.

    **Instrucciones:**
    1.  **Genera Estadísticas de Combate (0-100):** Basándote en todos los detalles proporcionados (tamaño, complexión, composición, etc.), asigna valores numéricos de 0 a 100 para Ataque, Defensa, Velocidad, Inteligencia, Resistencia, Fuerza y Precisión. **No utilices los valores que se te pasan como {{{ataque}}}, etc., ignóralos y crea los tuyos.** Justifica brevemente por qué has elegido esos valores en la sección de Habilidades y Poderes. Por ejemplo, una criatura 'gigante' y 'robusta' debería tener alta Fuerza y Resistencia, pero probablemente baja Velocidad. Una criatura 'pequeña' y 'delgada' podría tener alta Velocidad pero baja Fuerza.
    2.  **Introducción:** Comienza con una introducción cautivadora que presente a la criatura por su nombre.
    3.  **Descripción Física:** Describe su apariencia basándote en su tamaño, complexión, materiales y partes del cuerpo.
    4.  **Habilidades y Poderes:** Explica cómo su afinidad elemental y habilidades únicas se manifiestan. **Integra aquí la descripción de sus estadísticas de combate**, explicando cómo se reflejan en su comportamiento en una pelea y por qué tienen esos valores. No olvides tejer sus debilidades en la narrativa.
    5.  **Ecología y Comportamiento:** Describe cómo vive en su hábitat, qué come y cómo interactúa con otras criaturas.
    6.  **Reproducción y Crianza:** Si es apta, describe brevemente sus rituales o cómo cuida de sus crías.
    7.  **Historia y Lore:** Expande la historia de origen proporcionada, o si está vacía, inventa una que encaje con todos los demás atributos.

    **Tono:** Épico, descriptivo y narrativo, como si fuera una entrada en un bestiario legendario.

    **Detalles de la Criatura a Describir:**
    - **Nombre:** {{{nombre}}}
    - **Composición y Materiales:** {{{composicion}}}
    - **Atributos Físicos:** Mide {{{tamano}}}, tiene una complexión {{{complexion}}}. Sus partes más notables son {{{partesCuerpo}}}. Su apariencia general y textura es {{{apariencia}}}.
    - **Afinidad Elemental:** {{{afinidadElemental}}}
    - **Habilidades Únicas:** {{{habilidadesUnicas}}}
    - **Debilidades:** {{{debilidades}}}
    - **Comportamiento y Lore:**
      - **Temperamento:** {{{temperamento}}}
      - **Dieta:** {{{dieta}}}
      - **Hábitat Natural:** {{{habitat}}}
      - **Rol Social:** {{{rolSocial}}}
      - **Reproducción:** {{{aptoReproduccion_text}}} (Habilidades de crianza: {{{habilidadesCrianza}}})
    - **Historia de Origen Sugerida por el Creador:** {{{historiaOrigen}}}
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
