/**
 * @fileOverview Tipos y esquemas para el flujo de eventos universales.
 */

import { z } from 'genkit';
import { type DescribeCreatureOutput } from './describe-creature-flow';

const CreatureSchema = z.custom<DescribeCreatureOutput>();

export const PlanetStateSchema = z.object({
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
  status: z.enum(['Estable', 'En Pánico', 'Bajo Asedio', 'Crisis Humanitaria', 'Ley Marcial Global', 'Colapso Climático', 'Colapsado', 'Aniquilado']),
});
export type PlanetState = z.infer<typeof PlanetStateSchema>;


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


export const GenerateUniversalEventOutputSchema = z.object({
  newLogEntry: z.string().describe("La narración del nuevo suceso que acaba de ocurrir. Debe ser un párrafo detallado que continúe la historia."),
  storySummary: z.string().describe("Un resumen actualizado de la situación global en el planeta. Máximo dos frases."),
  updatedPlanetState: PlanetStateSchema.describe("El estado actualizado del planeta después del suceso (población, demografía, devastación, etc.)."),
  updatedCreatureStatus: z.enum(['Saludable', 'Herido', 'Muriendo', 'Muerto', 'Activa']).describe("El nuevo estado de salud de la criatura."),
  isEventOver: z.boolean().describe("Indica si el evento ha concluido (la criatura muere, la humanidad es aniquilada o se alcanza un final definitivo)."),
});
export type GenerateUniversalEventOutput = z.infer<typeof GenerateUniversalEventOutputSchema>;
