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
    altura: z.string().describe('La altura de la criatura (ej: 3m, 50cm).'),
    peso: z.string().describe('El peso de la criatura (ej: 500kg, 10kg).'),
    anchura: z.string().optional().describe('La anchura de la criatura (ej: 2m).'),
    profundidad: z.string().optional().describe('La profundidad o longitud de la criatura (ej: 5m).'),
    velocidadMaxima: z.string().describe('La velocidad máxima de la criatura (ej: 60km/h).'),
    partesCuerpo: z.string().describe('Las partes distintivas del cuerpo de la criatura.'),
    apariencia: z.string().describe('La apariencia, colores y textura de la criatura.'),
    afinidadElemental: z.string().describe('El elemento al que la criatura es afín.'),
    habilidadesUnicas: z.string().describe('Las habilidades únicas de la criatura.'),
    debilidades: z.string().describe('Las debilidades de la criatura.'),
    temperamento: z.string().describe('El temperamento de la criatura.'),
    vocalizaciones: z.string().optional().describe('Los sonidos o vocalizaciones que hace la criatura.'),
    dieta: z.string().describe('La dieta de la criatura.'),
    habitat: z.string().describe('El hábitat natural de la criatura.'),
    rolSocial: z.string().describe('El rol social de la criatura en su ecosistema.'),
    aptoReproduccion: z.boolean().describe('Si la criatura es apta para la reproducción.'),
    habilidadesCrianza: z.string().describe('Las habilidades de crianza de la criatura.'),
    historiaOrigen: z.string().describe('La historia de origen o lore de la criatura.'),
    envergadura: z.string().optional().describe('La envergadura de la criatura (ej: 15m).'),
    longitud: z.string().optional().describe('La longitud de la criatura (ej: 10m).'),
    circunferencia: z.string().optional().describe('La circunferencia de la criatura (ej: 5m).'),
    velocidadVuelo: z.string().optional().describe('La velocidad de vuelo de la criatura (ej: 120km/h).'),
    velocidadNado: z.string().optional().describe('La velocidad de nado de la criatura (ej: 30km/h).'),
    capacidadSalto: z.string().optional().describe('La capacidad de salto de la criatura (ej: 20m).'),
    fuerzaMordida: z.string().optional().describe('La fuerza de la mordida de la criatura (ej: 1500 PSI).'),
    capacidadCarga: z.string().optional().describe('La capacidad de carga de la criatura (ej: 2000kg).'),
    resistenciaPiel: z.string().optional().describe('La resistencia de la piel o coraza de la criatura (ej: 500 KPa).'),
    longevidad: z.string().optional().describe('La longevidad o esperanza de vida de la criatura.'),
    rolEcologico: z.string().optional().describe('El rol ecológico de la criatura en su hábitat.'),
    relacionesSimbioticas: z.string().optional().describe('Las relaciones simbióticas de la criatura con otras formas de vida.'),
  });

export type DescribeCreatureInput = z.infer<typeof DescribeCreatureInputSchema>;

export const DescribeCreatureOutputSchema = z.object({
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
    Eres un maestro narrador, un diseñador de juegos de rol y un crítico experto. Tu tarea es crear una ficha de valoración completa y detallada para una nueva criatura, extrapolando creativamente a partir de los datos proporcionados.

    **Instrucciones Clave:**
    1.  **Devuelve el Nombre:** El campo 'nombre' en la salida debe ser idéntico al de la entrada.
    2.  **Infiere y Genera Estadísticas de Combate (0-100):** Analiza TODOS los atributos proporcionados. Usa las medidas (altura, peso, envergadura), la composición (roca, carne, energía), y el comportamiento (agresivo, rápido) para asignar valores numéricos de 0 a 100 a Ataque, Defensa, Velocidad, Inteligencia, Resistencia, Fuerza y Precisión.
    3.  **Escribe la Descripción Narrativa (Lore Épico):** Crea una historia y descripción inmersiva. No te limites a listar los datos; intégralos en la narrativa. **Justifica sutilmente las estadísticas dentro del texto**. Por ejemplo, si tiene alta 'capacidadCarga' y 'resistenciaPiel', describe su musculatura masiva y su coraza impenetrable para justificar su alta Fuerza y Defensa. Si tiene alta 'velocidadVuelo', narra su agilidad aérea para justificar una Velocidad elevada.
    4.  **Expande Creativamente:** Si un campo está vacío (ej. 'velocidadNado'), puedes omitirlo o inferir una debilidad (ej. "es torpe en el agua"). Usa los datos como trampolín para una descripción rica, añadiendo detalles sobre sus sentidos, su ciclo de vida o su impacto en el ecosistema. Presta especial atención a la descripción de la apariencia, colores, texturas y sonidos (vocalizaciones) para crear una imagen vívida.
    5.  **Determina la Rareza:** Clasifica la criatura como "Común", "Poco Común", "Raro", "Épico" o "Legendario" basándote en la combinación de su poder, origen, unicidad y debilidades.
    6.  **Redacta las Tres Reseñas:**
        *   **Valoración de Expertos:** Analítica y técnica. Un erudito discutiendo su biología, tácticas de combate y posibles usos o amenazas.
        *   **Valoración del Público:** Coloquial y anecdótica. Un aventurero, un mercader o un aldeano contando un rumor o una experiencia de segunda mano.
        *   **Valoración de la IA:** Una autocrítica objetiva sobre la coherencia y originalidad del diseño de la criatura.
    7.  **Asigna Puntuación de Estrellas:** Otorga de 1 a 5 estrellas, resumiendo el concepto general: poder, originalidad y credibilidad dentro de su mundo.

    **Tono:** Épico para la narrativa; analítico para el experto; conversacional para el público; y objetivo para la IA.

    **Datos Base para la Criatura:**
    - **Identidad:** Nombre: {{{nombre}}}. Composición: {{{composicion}}}.
    - **Físico:** Tamaño {{{tamano}}}, complexión {{{complexion}}}. Partes notables: {{{partesCuerpo}}}. Apariencia, colores y textura: {{{apariencia}}}.
    - **Dimensiones:** Altura: {{{altura}}}, Peso: {{{peso}}}, Anchura: {{{anchura}}}, Profundidad: {{{profundidad}}}, Envergadura: {{{envergadura}}}, Longitud: {{{longitud}}}, Circunferencia: {{{circunferencia}}}.
    - **Movilidad:** Velocidad en tierra: {{{velocidadMaxima}}}, Velocidad de vuelo: {{{velocidadVuelo}}}, Velocidad de nado: {{{velocidadNado}}}, Capacidad de salto: {{{capacidadSalto}}}.
    - **Capacidades Físicas:** Fuerza de mordida: {{{fuerzaMordida}}}, Capacidad de carga: {{{capacidadCarga}}}, Resistencia de piel/coraza: {{{resistenciaPiel}}}.
    - **Poderes y Vulnerabilidades:** Afinidad elemental a {{{afinidadElemental}}}. Habilidades únicas: {{{habilidadesUnicas}}}. Debilidades: {{{debilidades}}}.
    - **Comportamiento y Ecología:** Temperamento: {{{temperamento}}}, dieta: {{{dieta}}}, hábitat: {{{habitat}}}, rol social: {{{rolSocial}}}, Vocalizaciones: {{{vocalizaciones}}}. Rol ecológico: {{{rolEcologico}}}. Relaciones simbióticas: {{{relacionesSimbioticas}}}.
    - **Ciclo de Vida:** Longevidad: {{{longevidad}}}. Apto para reproducción: {{{aptoReproduccion_text}}}. Habilidades de crianza: {{{habilidadesCrianza}}}.
    - **Trasfondo:** Historia de origen sugerida: {{{historiaOrigen}}}.
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
  try {
    return await describeCreatureFlow(input);
  } catch (error: any) {
    console.error("Error en el flujo describeCreature:", error);
    throw new Error(error.message || "Ocurrió un error al generar la valoración de la criatura.");
  }
}
