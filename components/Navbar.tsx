'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Sliders, RefreshCw, Scale, Building2 } from 'lucide-react';

interface NavbarProps {
  savedCount?: number;
  compareCount?: number;
  onOpenCompare?: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount = 0,
  compareCount = 0,
  onOpenCompare = () => {},
  isRefreshing,
  onRefresh,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0 min-h-11">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-teal-800 text-white shadow-xs shrink-0 transition group-hover:bg-teal-700">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-sm sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white truncate block">
                Lansing Housing Finder
              </span>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 truncate hidden sm:block">
                Greater Lansing & East Lansing · Commute to 241 E Saginaw St
              </p>
            </div>
          </Link>
        </div>

        {/* Right side navigation & status items */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh inventory"
              className="inline-flex min-h-11 items-center space-x-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync Live</span>
            </button>
          )}

          {/* Compare Button */}
          <button
            type="button"
            onClick={onOpenCompare}
            title="Open side-by-side comparison drawer"
            className={`relative inline-flex min-h-11 items-center space-x-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
              compareCount > 0
                ? 'border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200'
                : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </button>

          {/* Saved Homes Link */}
          <Link
            href="/saved"
            title="View saved apartments"
            className="inline-flex min-h-11 items-center space-x-1.5 rounded-xl border border-stone-200 bg-stone-50 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
          >
            <Bookmark className="h-3.5 w-3.5 text-teal-700" />
            <span className="hidden sm:inline">Saved</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800 text-[10px] font-bold text-white">
              {savedCount}
            </span>
          </Link>

          {/* Settings Link */}
          <Link
            href="/settings"
            title="Benchmark settings"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
          >
            <Sliders className="h-3.5 w-3.5 text-stone-600 dark:text-stone-300" />
            <span className="sr-only">Settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
