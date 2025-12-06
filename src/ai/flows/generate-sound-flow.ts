'use server';
/**
 * @fileOverview A flow to generate audio from a text description of a creature's vocalization.
 *
 * - generateSound - A function that takes a text description and returns audio data.
 * - GenerateSoundInput - The input type for the generateSound function.
 * - GenerateSoundOutput - The return type for the generateSound function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateSoundInputSchema = z.string();
export type GenerateSoundInput = z.infer<typeof GenerateSoundInputSchema>;

const GenerateSoundOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a base64-encoded data URI."),
});
export type GenerateSoundOutput = z.infer<typeof GenerateSoundOutputSchema>;


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateSoundFlow = ai.defineFlow(
  {
    name: 'generateSoundFlow',
    inputSchema: GenerateSoundInputSchema,
    outputSchema: GenerateSoundOutputSchema,
  },
  async (promptText) => {
    
    const prompt = `Generate a sound that matches the following description. Do not include any spoken words, only the sound itself. The description is: "${promptText}"`
    
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
            },
        },
        prompt: prompt,
    });

    if (!media) {
      throw new Error('No media was returned from the text-to-speech model.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);


export async function generateSound(
  input: GenerateSoundInput
): Promise<GenerateSoundOutput> {
  return generateSoundFlow(input);
}
