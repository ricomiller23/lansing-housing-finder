import { Listing, Scores } from '../providers/types';
import { computeLincolnParity, BaselineProfile, DEFAULT_BASELINE } from './lincoln';
import { computeDogFriendly } from './dog';
import { computeValue } from './value';

export interface ScoreWeights {
  lincolnParity: number;
  dogFriendly: number;
  value: number;
  commute: number;
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  lincolnParity: 0.35,
  dogFriendly: 0.30,
  value: 0.20,
  commute: 0.15,
};

export function computeScores(
  listing: Listing,
  baseline: BaselineProfile = DEFAULT_BASELINE,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
  targetDogWeightLbs: number = 25
): Scores {
  const lincolnParity = computeLincolnParity(listing, baseline);
  const dogFriendly = computeDogFriendly(listing, targetDogWeightLbs);
  const value = computeValue(listing);

  // Commute score: under 15 min = 100, 25 min = 80, 40 min = 50, >55 min = 20
  let commuteScore = 75;
  if (listing.commute) {
    const worstMin = Math.max(listing.commute.morning.minutes, listing.commute.evening.minutes);
    if (worstMin <= 12) commuteScore = 100;
    else if (worstMin <= 20) commuteScore = 90;
    else if (worstMin <= 30) commuteScore = 75;
    else if (worstMin <= 45) commuteScore = 55;
    else commuteScore = 30;
  }

  const overall = Math.round(
    lincolnParity * weights.lincolnParity +
    dogFriendly * weights.dogFriendly +
    value * weights.value +
    commuteScore * weights.commute
  );

  return {
    lincolnParity,
    dogFriendly,
    value,
    overall: Math.min(100, Math.max(0, overall)),
  };
}
