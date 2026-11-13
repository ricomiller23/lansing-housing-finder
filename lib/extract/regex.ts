import { Parking, PetPolicy, Amenities } from '../providers/types';

export interface ExtractionResult {
  parking: Parking;
  petPolicy: PetPolicy;
  amenities: Amenities;
  flags: string[];
}

export function extractFromText(text: string | undefined): ExtractionResult {
  if (!text) {
    return {
      parking: {
        coveredConfirmed: false,
        twoCarsCovered: 'unknown',
        type: 'unknown',
      },
      petPolicy: {
        dogsAllowed: 'unknown',
        twoDogsOk: 'unknown',
      },
      amenities: {},
      flags: ['covered parking unverified', 'pet policy unverified'],
    };
  }

  const flags: string[] = [];
  const lower = text.toLowerCase();

  // --- Parking Extraction ---
  let coveredConfirmed = false;
  let twoCarsCovered: 'yes' | 'no' | 'unknown' = 'unknown';
  let parkingType: Parking['type'] = 'unknown';
  let coveredSpaces: number | undefined = undefined;
  let parkingSnippet: string | undefined = undefined;

  const garage2Match = text.match(/(?:2|two)[\s-]car(?:\s+attached|\s+detached|\s+private|\s+covered)?\s+(?:garage|carports?|covered\s+parking|spaces?|stalls?)/i) ||
                       text.match(/(?:attached|detached|private)?\s*(?:2|two)[\s-]car\s+(?:garage|carport)/i) ||
                       text.match(/(?:heated|indoor|underground|covered)?\s*garage\s+(?:parking\s+)?for\s+(?:2|two)\s+cars?/i) ||
                       text.match(/(?:garage|covered\s+parking|carport)\s+(?:for\s+)?(?:2|two)\s+cars?/i) ||
                       text.match(/(?:2|two)\s+(?:assigned|reserved|covered|indoor|heated|parking|\s+)*(?:spaces?|stalls?|spots?|carports?|garage)/i) ||
                       text.match(/2\s+parking\s+spaces\s+in\s+garage/i);
  
  const garage1Match = text.match(/(?:1|one)[\s-]car\s+(?:garage|carport)/i) ||
                       text.match(/(?:single|1)\s+car\s+garage/i);

  const genericGarage = text.match(/(?:attached|detached)?\s*garage/i);
  const carportMatch = text.match(/carport/i);
  const coveredMatch = text.match(/covered\s+(?:parking|spaces?|stall)/i);

  if (garage2Match) {
    coveredConfirmed = true;
    twoCarsCovered = 'yes';
    coveredSpaces = 2;
    parkingType = garage2Match[0].toLowerCase().includes('carport') ? 'carport' : 'garage';
    parkingSnippet = garage2Match[0];
  } else if (garage1Match) {
    coveredConfirmed = true;
    twoCarsCovered = 'no';
    coveredSpaces = 1;
    parkingType = 'garage';
    parkingSnippet = garage1Match[0];
    flags.push('only 1 covered space confirmed');
  } else if (genericGarage) {
    coveredConfirmed = true;
    parkingType = 'garage';
    parkingSnippet = genericGarage[0];
    twoCarsCovered = 'unknown';
  } else if (carportMatch || coveredMatch) {
    coveredConfirmed = true;
    parkingType = carportMatch ? 'carport' : 'covered_assigned';
    parkingSnippet = (carportMatch || coveredMatch)![0];
    twoCarsCovered = 'unknown';
  }

  if (!coveredConfirmed) {
    flags.push('covered parking unverified');
  }

  // --- Pet Policy Extraction ---
  let dogsAllowed: boolean | 'unknown' = 'unknown';
  let twoDogsOk: 'yes' | 'no' | 'unknown' = 'unknown';
  let maxPets: number | undefined = undefined;
  let weightLimitLbs: number | undefined = undefined;
  let petSnippet: string | undefined = undefined;

  const noPetsMatch = text.match(/no\s+pets?(?!\s*(?:deposit|rent|fee))|no\s+dogs?(?!\s*(?:deposit|rent|fee))/i);
  const twoPetsMatch = text.match(/(?:up\s+to\s+)?(?:2|two)\s+(?:pets?|dogs?|small\s+dogs?)/i) ||
                       text.match(/(?:welcomes?|allows?|permits?|friendly\s+welcoming)\s+(?:up\s+to\s+)?(?:2|two)\s+(?:dogs?|pets?|small\s+dogs?)/i) ||
                       text.match(/pet[\s-]friendly\s*\((?:up\s+to\s+)?(?:2|two)\s+(?:dogs?|pets?)\)/i) ||
                       text.match(/(?:2|two)\s+pets\s+maximum/i);
  const weightMatch = text.match(/(?:under|max|limit|up to)\s*(\d{2,3})\s*(?:lbs|pounds)/i);
  const dogsAllowedMatch = text.match(/dog(?:s)?\s+(?:allowed|welcome|friendly|ok)/i) || text.match(/pets?\s+(?:allowed|welcome|friendly|ok)/i);

  if (noPetsMatch) {
    dogsAllowed = false;
    twoDogsOk = 'no';
    petSnippet = noPetsMatch[0];
    flags.push('no dogs allowed');
  } else {
    if (twoPetsMatch) {
      dogsAllowed = true;
      twoDogsOk = 'yes';
      maxPets = 2;
      petSnippet = twoPetsMatch[0];
    } else if (dogsAllowedMatch) {
      dogsAllowed = true;
      petSnippet = dogsAllowedMatch[0];
    }

    if (weightMatch) {
      weightLimitLbs = parseInt(weightMatch[1], 10);
      petSnippet = (petSnippet ? petSnippet + '; ' : '') + weightMatch[0];
      if (weightLimitLbs < 25) {
        flags.push(`pet weight limit ${weightLimitLbs} lbs`);
      }
    }
  }

  if (dogsAllowed === 'unknown') {
    flags.push('pet policy unverified');
  }

  // --- Amenities Extraction ---
  const amenities: Amenities = {};
  if (/washer|dryer|in[\s-]unit\s+w\/?d|w\/d\s+in[\s-]unit/i.test(text)) {
    amenities.inUnitLaundry = true;
  }
  if (/fenced\s+yard|private\s+yard|enclosed\s+patio|backyard/i.test(text)) {
    amenities.fencedYard = true;
  }
  if (/pool|spa|resort-style\s+pool/i.test(text)) {
    amenities.pool = true;
  }
  if (/fitness\s+center|gym|workout/i.test(text)) {
    amenities.gym = true;
  }
  if (/central\s+air|air\s+conditioning|a\/c|ac\b/i.test(text)) {
    amenities.ac = true;
  }
  if (/ev\s+charg|electric\s+vehicle/i.test(text)) {
    amenities.evCharging = true;
  }
  if (/gated\s+community|controlled\s+access|gated\s+entry/i.test(text)) {
    amenities.gated = true;
  }
  if (/dishwasher/i.test(text)) {
    amenities.dishwasher = true;
  }

  return {
    parking: {
      coveredSpaces,
      type: parkingType,
      coveredConfirmed,
      twoCarsCovered,
      sourceSnippet: parkingSnippet,
    },
    petPolicy: {
      dogsAllowed,
      maxPets,
      weightLimitLbs,
      twoDogsOk,
      sourceSnippet: petSnippet,
    },
    amenities,
    flags,
  };
}
