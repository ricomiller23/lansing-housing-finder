'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ArrowLeft, Sliders, ShieldCheck, Check, Building2 } from 'lucide-react';
import { DEFAULT_BASELINE } from '@/lib/scoring/lincoln';

export default function SettingsPage() {
  const [baseline, setBaseline] = useState(DEFAULT_BASELINE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 flex flex-col">
      <Navbar savedCount={0} compareCount={0} onOpenCompare={() => {}} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Listings</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Baseline Home & Commute Benchmark
            </h1>
            <p className="text-xs text-stone-500">
              Configured against your current residence at The Lincoln Scottsdale to prevent any downgrade
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Current Home Profile */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400 mb-4">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                Current Home Benchmark (Scottsdale, AZ)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Community & Address:
                </label>
                <input
                  type="text"
                  value={baseline.address}
                  onChange={(e) => setBaseline({ ...baseline, address: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Baseline Rent ($/mo):
                </label>
                <input
                  type="number"
                  value={baseline.rent}
                  onChange={(e) => setBaseline({ ...baseline, rent: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Bedrooms:
                </label>
                <input
                  type="number"
                  value={baseline.beds}
                  onChange={(e) => setBaseline({ ...baseline, beds: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Bathrooms:
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={baseline.baths}
                  onChange={(e) => setBaseline({ ...baseline, baths: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Square Footage:
                </label>
                <input
                  type="number"
                  value={baseline.sqft}
                  onChange={(e) => setBaseline({ ...baseline, sqft: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Covered Parking Spaces:
                </label>
                <input
                  type="number"
                  value={baseline.coveredParkingSpaces}
                  onChange={(e) => setBaseline({ ...baseline, coveredParkingSpaces: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg border border-stone-200 p-2.5 dark:border-stone-750 dark:bg-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Workplace Location */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400 mb-4">
              <Building2 className="h-5 w-5" />
              <h2 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                Destination Office (Irvine, CA)
              </h2>
            </div>
            <div className="text-xs space-y-2 text-stone-600 dark:text-stone-300">
              <p>
                <strong>Employer:</strong> Beach Cities Commercial Bank
              </p>
              <p>
                <strong>Address:</strong> 100 Progress, Suite 150, Irvine, CA 92618 (Innovation Office Park, Irvine Spectrum)
              </p>
              <p>
                <strong>Coordinates:</strong> 33.6770° N, 117.7602° W
              </p>
              <p>
                <strong>Commute Timing:</strong> Traffic-aware optimal drive modeling at 7:45 AM (Morning arrival) & 5:30 PM (Evening departure).
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            {savedSuccess && (
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                <span>Preferences Saved!</span>
              </span>
            )}
            <button
              type="submit"
              className="rounded-xl bg-teal-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-teal-700 shadow-sm"
            >
              Save Baseline Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
