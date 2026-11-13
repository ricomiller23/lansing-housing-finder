'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Listing } from '@/lib/providers/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  Dog,
  Car,
  Building,
  Images,
} from 'lucide-react';

interface PhotoGalleryModalProps {
  listing: Listing | null;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  listing,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, listing]);

  const photos = listing?.photos && listing.photos.length > 0 ? listing.photos : [];
  const propertyLabel = listing?.communityName || listing?.address.line1 || 'Property';
  const websiteUrl = listing?.source_url || listing?.url || '#';
  const galleryUrl = listing?.gallery_url || websiteUrl;

  const nextPhoto = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nextPhoto, prevPhoto]);

  if (!isOpen || !listing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative flex h-full max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-800/80 px-4 py-3 sm:px-6">
          <div className="min-w-0 pr-4">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-teal-400">
                {listing.operator || 'Official Leasing Portal'}
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-[11px] text-stone-400">
                Photo {currentIndex + 1} of {Math.max(1, photos.length)}
              </span>
            </div>
            <h2 id="photo-modal-title" className="font-serif text-base sm:text-lg font-bold truncate text-white">
              {propertyLabel}
            </h2>
            <p className="text-xs text-stone-400 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 text-stone-500 shrink-0" />
              <span>
                {listing.address.line1}, {listing.address.city}, MI {listing.address.zip}
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={galleryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex min-h-9 items-center space-x-1.5 rounded-xl bg-teal-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition shadow-xs"
            >
              <Images className="h-3.5 w-3.5" />
              <span>Open Official Website Gallery</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-800/80 text-stone-400 hover:bg-stone-700 hover:text-white transition"
              aria-label="Close photo viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Display Area */}
        <div className="relative flex-1 overflow-hidden bg-black flex items-center justify-center select-none">
          {photos.length > 0 ? (
            <img
              src={photos[currentIndex]}
              alt={`${propertyLabel} photo ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-sm text-stone-500">No photos available for this property</div>
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition border border-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition border border-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Key Specs Floating Pill */}
          <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-2 rounded-xl bg-stone-950/80 px-3 py-1.5 text-xs backdrop-blur-md border border-stone-800">
            <span className="font-bold text-teal-400">${listing.price.toLocaleString()}/mo</span>
            <span className="text-stone-600">·</span>
            <span>{listing.beds} bd / {listing.baths} ba</span>
            {listing.sqft && (
              <>
                <span className="text-stone-600">·</span>
                <span>{listing.sqft.toLocaleString()} sqft</span>
              </>
            )}
            <span className="text-stone-600">·</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {listing.commute?.morning.minutes} min to 241 E Saginaw
            </span>
          </div>
        </div>

        {/* Thumbnail Carousel Bar */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-stone-800/80 bg-stone-900/60 p-3 sm:px-6">
            {photos.map((url, idx) => (
              <button
                key={url + idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  currentIndex === idx
                    ? 'border-teal-500 ring-2 ring-teal-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Mobile Footer Actions */}
        <div className="sm:hidden flex items-center justify-between border-t border-stone-800 p-3">
          <div className="text-xs">
            <span className="font-bold text-teal-400">${listing.price.toLocaleString()}/mo</span>
            <span className="text-stone-500 ml-1.5">
              {listing.commute?.morning.minutes}m to 241 E Saginaw
            </span>
          </div>
          <a
            href={galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center space-x-1 rounded-lg bg-teal-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition"
          >
            <span>Official Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
