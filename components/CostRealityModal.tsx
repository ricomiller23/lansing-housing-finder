'use client';

import React from 'react';
import { Listing } from '@/lib/providers/types';
import { X, Calculator, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';

interface CostRealityModalProps {
  listing: Listing | null;
  onClose: () => void;
  baselineRent?: number;
}

export const CostRealityModal: React.FC<CostRealityModalProps> = ({
  listing,
  onClose,
  baselineRent = 4200,
}) => {
  if (!listing) return null;

  // Monthly breakdown
  const rent = listing.price;
  const petRent = 60 * 2; // 2 dogs @ $60/mo
  const parkingFee = listing.fees.parkingFee || 0;
  const utilitiesEstimate = 220; // Average electricity, gas heat, water, trash in Lansing
  const rentersInsurance = 25; // Standard CA monthly renter's policy

  const totalAllIn = rent + petRent + parkingFee + utilitiesEstimate + rentersInsurance;
  const baselineAllIn = baselineRent + petRent + utilitiesEstimate + rentersInsurance;
  const monthlyDelta = totalAllIn - baselineAllIn;

  // One-time move-in costs under Michigan Landlord-Tenant Act (MCL 554.602)
  // Michigan statutes cap security deposits at a statutory maximum of 1.5 months rent
  const maxSecurityDepositMI = Math.round(rent * 1.5);
  const petDeposit = listing.fees.deposit || 500;
  const appFees = (listing.fees.applicationFee || 50) * 2; // 2 applicants
  const totalMoveIn = rent + maxSecurityDepositMI + petDeposit + appFees;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                All-In Monthly Cost Reality
              </h3>
              <p className="text-xs text-stone-500">
                {listing.communityName || listing.address.line1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Monthly Cost Breakdown */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
            <span className="text-stone-600 dark:text-stone-400">Base Monthly Rent:</span>
            <span className="font-mono font-bold text-stone-900 dark:text-white">${rent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
            <span className="text-stone-600 dark:text-stone-400">Pet Rent (2 dogs @ $60/mo):</span>
            <span className="font-mono text-stone-800 dark:text-stone-200">+${petRent}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
            <span className="text-stone-600 dark:text-stone-400">Covered Parking (2 cars):</span>
            <span className="font-mono text-stone-800 dark:text-stone-200">
              {parkingFee > 0 ? `+$${parkingFee}` : 'Included'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
            <span className="text-stone-600 dark:text-stone-400">Estimated Utilities (Irvine Water/SCE):</span>
            <span className="font-mono text-stone-800 dark:text-stone-200">+${utilitiesEstimate}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
            <span className="text-stone-600 dark:text-stone-400">Renter\'s Insurance (Required):</span>
            <span className="font-mono text-stone-800 dark:text-stone-200">+${rentersInsurance}</span>
          </div>

          <div className="flex justify-between pt-3 text-sm font-bold border-t border-stone-200 dark:border-stone-700">
            <span className="text-stone-900 dark:text-white">Total True Monthly Out-of-Pocket:</span>
            <span className="font-mono text-teal-800 dark:text-teal-400">${totalAllIn.toLocaleString()}/mo</span>
          </div>


        </div>

        {/* California Legal Specifics: AB 12 */}
        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
          <div className="flex items-center space-x-1.5 font-bold text-teal-900 dark:text-teal-100 mb-1">
            <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
            <span>California Security Deposit Law (AB 12 Protected)</span>
          </div>
          <p className="leading-relaxed text-[11px] text-teal-900/90 dark:text-teal-200/90">
            Under California Assembly Bill 12 (effective July 1, 2024), residential landlords are legally prohibited from demanding more than <strong>one month's rent</strong> as a security deposit, regardless of whether the unit is furnished or has pets. Total estimated initial move-in deposit: <strong>${maxSecurityDepositMI.toLocaleString()}</strong>.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <a
            href={listing.gallery_url || listing.source_url || listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center space-x-1.5 rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
          >
            <span>Property Website & Photos</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
