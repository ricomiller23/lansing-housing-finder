'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/lib/providers/types';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { CompareDrawer } from '@/components/CompareDrawer';
import { OutreachHelperModal } from '@/components/OutreachHelperModal';
import { CostRealityModal } from '@/components/CostRealityModal';
import { RouteModal } from '@/components/RouteModal';
import { Bookmark, ArrowLeft } from 'lucide-react';

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeOutreach, setActiveOutreach] = useState<Listing | null>(null);
  const [activeCost, setActiveCost] = useState<Listing | null>(null);
  const [activeRoute, setActiveRoute] = useState<Listing | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('irvine_saved_listings');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {}
  }, []);

  const { data } = useQuery({
    queryKey: ['saved-listings'],
    queryFn: async () => {
      const res = await fetch('/api/listings');
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
  });

  const allListings: Listing[] = data?.listings || [];
  const savedListings = allListings.filter((l) => savedIds.includes(l.id));

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.filter((i) => i !== id);
      try {
        localStorage.setItem('irvine_saved_listings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 flex flex-col">
      <Navbar
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Apartment Search</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Saved Favorites ({savedListings.length})
            </h1>
            <p className="text-xs text-stone-500">
              Apartments and homes shortlisted in East Lansing and Greater Lansing
            </p>
          </div>
        </div>

        {savedListings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 text-center dark:border-stone-800 dark:bg-stone-900">
            <Bookmark className="mx-auto h-10 w-10 text-stone-300" />
            <h3 className="font-serif mt-3 text-lg font-bold text-stone-900 dark:text-white">
              No saved apartments yet
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Bookmark apartments on the main Lansing search page to review them here anytime.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-xl bg-teal-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
              >
                Explore Lansing Area Apartments
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSaved={true}
                isCompared={compareIds.includes(listing.id)}
                onToggleSaved={toggleSaved}
                onToggleCompare={toggleCompare}
                onOpenOutreach={setActiveOutreach}
                onOpenCostReality={setActiveCost}
                onOpenRoute={setActiveRoute}
              />
            ))}
          </div>
        )}
      </div>

      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        listings={allListings.filter((l) => compareIds.includes(l.id))}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />

      <RouteModal listing={activeRoute} onClose={() => setActiveRoute(null)} />
      <OutreachHelperModal listing={activeOutreach} onClose={() => setActiveOutreach(null)} />
      <CostRealityModal listing={activeCost} onClose={() => setActiveCost(null)} />
    </div>
  );
}
