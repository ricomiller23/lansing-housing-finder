import Anthropic from '@anthropic-ai/sdk';
import { extractFromText, ExtractionResult } from './regex';
import crypto from 'crypto';

const extractionCache = new Map<string, ExtractionResult>();

export async function extractWithLLM(text: string | undefined): Promise<ExtractionResult> {
  if (!text) return extractFromText(text);

  const hash = crypto.createHash('md5').update(text).digest('hex');
  if (extractionCache.has(hash)) {
    return extractionCache.get(hash)!;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const regexResult = extractFromText(text);
    extractionCache.set(hash, regexResult);
    return regexResult;
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const prompt = `Analyze this real estate listing description. Extract structured facts strictly according to what is explicitly stated. Do NOT infer or guess. Return null or "unknown" for anything not stated.

Listing description:
"""
${text}
"""

Return JSON format:
{
  "parking": {
    "coveredSpaces": number or null,
    "type": "garage" | "carport" | "covered_assigned" | "street" | "open_lot" | "unknown",
    "coveredConfirmed": boolean,
    "twoCarsCovered": "yes" | "no" | "unknown",
    "sourceSnippet": string or null
  },
  "petPolicy": {
    "dogsAllowed": boolean | "unknown",
    "maxPets": number | null,
    "weightLimitLbs": number | null,
    "twoDogsOk": "yes" | "no" | "unknown",
    "sourceSnippet": string or null
  },
  "amenities": {
    "inUnitLaundry": boolean or null,
    "fencedYard": boolean or null,
    "pool": boolean or null,
    "gym": boolean or null,
    "ac": boolean or null,
    "dishwasher": boolean or null,
    "evCharging": boolean or null,
    "gated": boolean or null
  }
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    });

    const contentBlock = response.content[0];
    if (contentBlock && contentBlock.type === 'text') {
      const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const flags: string[] = [];
        if (!parsed.parking.coveredConfirmed) flags.push('covered parking unverified');
        if (parsed.petPolicy.dogsAllowed === 'unknown') flags.push('pet policy unverified');
        if (parsed.petPolicy.twoDogsOk === 'no') flags.push('no 2 dogs allowed');

        const result: ExtractionResult = {
          parking: parsed.parking,
          petPolicy: parsed.petPolicy,
          amenities: parsed.amenities || {},
          flags,
        };
        extractionCache.set(hash, result);
        return result;
      }
    }
  } catch (err) {
    console.error('LLM extraction error, falling back to regex:', err);
  }

  const fallback = extractFromText(text);
  extractionCache.set(hash, fallback);
  return fallback;
}
