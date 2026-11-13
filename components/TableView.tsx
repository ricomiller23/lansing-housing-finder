'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/providers/types';
import {
  ExternalLink,
  Bookmark,
  Scale,
  MessageSquare,
  Clock,
  Check,
  HelpCircle,
  X,
  Navigation,
  Images,
} from 'lucide-react';

interface TableViewProps {
  listings: Listing[];
  savedIds: string[];
  compareIds: string[];
  onToggleSaved: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenOutreach: (listing: Listing) => void;
  onOpenRoute?: (listing: Listing) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  listings,
  savedIds,
  compareIds,
  onToggleSaved,
  onToggleCompare,
  onOpenOutreach,
  onOpenRoute,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <table className="w-full text-left text-xs">
        <caption className="sr-only">
          Apartment and rental property comparison table with website photo links and commute times
        </caption>
        <thead className="border-b border-stone-200 bg-stone-50 font-semibold text-stone-600 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3">Community / Address</th>
            <th scope="col" className="px-3 py-3.5">Website & Photos</th>
            <th scope="col" className="px-3 py-3.5">Price / mo</th>
            <th scope="col" className="px-3 py-3.5">Beds/Baths</th>
            <th scope="col" className="px-3 py-3.5">Sq Ft</th>
            <th scope="col" className="px-3 py-3.5">Commute to Bank</th>
            <th scope="col" className="px-3 py-3.5">Google Maps Route</th>
            <th scope="col" className="px-3 py-3.5">2 Dogs OK?</th>
            <th scope="col" className="px-3 py-3.5">2 Cars Covered?</th>
            <th scope="col" className="px-3 py-3.5">Benchmark Match</th>
            <th scope="col" className="py-3.5 pl-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {listings.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isCompared = compareIds.includes(item.id);
            const propertyLabel = item.communityName || item.address.line1;
            const websiteUrl = item.source_url || item.url;
            const galleryUrl = item.gallery_url || websiteUrl;

            return (
              <tr key={item.id} className="hover:bg-stone-50/80 transition dark:hover:bg-stone-800/50">
                <td className="py-3 pl-4 pr-3 font-medium">
                  <Link
                    href={`/listing/${encodeURIComponent(item.id)}`}
                    className="font-serif text-sm font-bold text-stone-900 hover:text-teal-800 hover:underline dark:text-white dark:hover:text-teal-400"
                  >
                    {propertyLabel}
                  </Link>
                  <p className="text-[11px] text-stone-500">
                    {item.address.line1}, {item.address.city}, CA {item.address.zip}
                  </p>
                  <span className="text-[10px] text-stone-400">
                    {item.operator || 'Private Landlord'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <a
                    href={galleryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center space-x-1 rounded-lg bg-teal-800 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-teal-700 transition whitespace-nowrap"
                  >
                    <Images className="h-3 w-3 text-teal-200 shrink-0" />
                    <span>Website & Photos</span>
                    <span className="sr-only"> for {propertyLabel}</span>
                    <ExternalLink className="h-3 w-3 text-teal-200 shrink-0" />
                  </a>
                </td>
                <td className="px-3 py-3 font-mono font-bold text-stone-900 dark:text-white">
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-stone-600 dark:text-stone-300 whitespace-nowrap">
                  {item.beds} bd / {item.baths} ba
                </td>
                <td className="px-3 py-3 font-mono text-stone-600 dark:text-stone-300 whitespace-nowrap">
                  {item.sqft ? `${item.sqft.toLocaleString()} sqft` : '—'}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-1 font-semibold text-stone-800 dark:text-stone-200">
                    <Clock className="h-3 w-3 text-amber-600" />
                    <span>{item.commute?.morning.minutes}m AM / {item.commute?.evening.minutes}m PM</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {item.commute?.morning.miles} mi to 241 E Saginaw
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onOpenRoute && onOpenRoute(item)}
                    className="inline-flex min-h-9 items-center space-x-1 rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-900 hover:bg-teal-100 transition dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
                  >
                    <Navigation className="h-3 w-3 text-teal-700" />
                    <span>View Car Route</span>
                  </button>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {item.petPolicy.twoDogsOk === 'yes' ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>Confirmed (2)</span>
                    </span>
                  ) : item.petPolicy.dogsAllowed === true ? (
                    <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold dark:text-amber-400">
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Verify 2 Pets</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-rose-600 font-semibold">
                      <X className="h-3.5 w-3.5" />
                      <span>No Dogs</span>
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {item.parking.twoCarsCovered === 'yes' ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>2 Covered</span>
                    </span>
                  ) : item.parking.coveredConfirmed ? (
                    <span className="inline-flex items-center space-x-1 text-indigo-700 font-semibold dark:text-indigo-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>1+ Covered</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-stone-500">
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Unverified</span>
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-1 font-bold">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        (item.scores?.lincolnParity || 0) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{item.scores?.lincolnParity}%</span>
                  </div>
                </td>
                <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(item.id)}
                      title="Compare"
                      aria-label={`Compare ${propertyLabel}`}
                      className={`rounded p-1.5 transition ${
                        isCompared
                          ? 'bg-amber-500 text-white'
                          : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800'
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSaved(item.id)}
                      title="Favorite"
                      aria-label={`Save ${propertyLabel}`}
                      className={`rounded p-1.5 transition ${
                        isSaved
                          ? 'bg-teal-700 text-white'
                          : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenOutreach(item)}
                      title="Inquire"
                      aria-label={`Inquire about ${propertyLabel}`}
                      className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/listing/${encodeURIComponent(item.id)}`}
                      className="rounded px-2 py-1 text-[11px] font-semibold text-teal-800 hover:bg-stone-100 dark:text-teal-400 dark:hover:bg-stone-800"
                    >
                      Details<span className="sr-only"> for {propertyLabel}</span>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
