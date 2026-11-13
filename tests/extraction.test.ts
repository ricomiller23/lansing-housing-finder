import { describe, it, expect } from 'vitest';
import { extractFromText } from '../lib/extract/regex';

describe('Regex & Keyword Extraction Suite', () => {
  it('extracts 2-car garage and two dogs allowed from text', () => {
    const text = 'Beautiful townhome featuring an attached 2-car garage. Pets welcome, up to 2 dogs allowed under 40 lbs. In-unit washer/dryer included.';
    const result = extractFromText(text);

    expect(result.parking.coveredConfirmed).toBe(true);
    expect(result.parking.twoCarsCovered).toBe('yes');
    expect(result.petPolicy.twoDogsOk).toBe('yes');
    expect(result.petPolicy.weightLimitLbs).toBe(40);
    expect(result.amenities.inUnitLaundry).toBe(true);
  });

  it('flags unverified parking when not stated', () => {
    const text = 'Spacious 2 bedroom with city views. Close to shopping.';
    const result = extractFromText(text);

    expect(result.parking.coveredConfirmed).toBe(false);
    expect(result.flags).toContain('covered parking unverified');
    expect(result.flags).toContain('pet policy unverified');
  });

  it('detects 1-car garage limitation', () => {
    const text = 'Cozy 1 bedroom with single car garage and assigned carport.';
    const result = extractFromText(text);

    expect(result.parking.coveredConfirmed).toBe(true);
    expect(result.parking.type).toBe('garage');
  });
});
