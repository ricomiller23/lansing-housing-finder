'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Listing, SearchFilters } from '@/lib/providers/types';
import { normalizeCityAlias } from '@/lib/providers';
import { Navbar } from '@/components/Navbar';
import { FilterBar } from '@/components/FilterBar';
import { ListingCard } from '@/components/ListingCard';
import { MapView } from '@/components/MapView';
import { TableView } from '@/components/TableView';
import { CompareDrawer } from '@/components/CompareDrawer';
import { OutreachHelperModal } from '@/components/OutreachHelperModal';
import { CostRealityModal } from '@/components/CostRealityModal';
import { RouteModal } from '@/components/RouteModal';
import { PhotoGalleryModal } from '@/components/PhotoGalleryModal';
import { UPSCALE_COMMUNITIES } from '@/lib/providers/communities';
import { WORK_LOCATION } from '@/lib/commute/routes';
import {
  Download,
  Sliders,
  ExternalLink,
  MapPin,
  Building,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default focus: Greater Lansing & East Lansing rentals unless overridden via URL params
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const rawCitiesParam = searchParams.get('cities');
    const rawQueryParam = searchParams.get('q') || searchParams.get('query');

    let initialCities: string[] | undefined = undefined;
    if (rawCitiesParam) {
      if (rawCitiesParam.trim().toLowerCase() === 'all') {
        initialCities = undefined;
      } else {
        initialCities = rawCitiesParam
          .split(',')
          .map((c) => normalizeCityAlias(c))
          .filter(Boolean);
      }
    } else if (rawQueryParam) {
      const normQ = normalizeCityAlias(rawQueryParam);
      if (normQ === 'East Lansing') {
        initialCities = ['East Lansing'];
      } else {
        initialCities = undefined;
      }
    }

    return {
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 10000,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
      maxDriveMinutes: searchParams.get('maxDriveMinutes') ? parseInt(searchParams.get('maxDriveMinutes')!, 10) : 40,
      minBeds: searchParams.get('minBeds') ? parseInt(searchParams.get('minBeds')!, 10) : 1,
      minBaths: searchParams.get('minBaths') ? parseFloat(searchParams.get('minBaths')!) : 1,
      propertyTypes: searchParams.get('propertyTypes')
        ? (searchParams.get('propertyTypes')!.split(',') as any)
        : ['apartment', 'townhome', 'condo', 'single_family'],
      coveredParkingMode: (searchParams.get('coveredParkingMode') as any) || 'lenient',
      twoDogsMode: (searchParams.get('twoDogsMode') as any) || 'lenient',
      cities: initialCities,
      operators: searchParams.get('operators') ? searchParams.get('operators')!.split(',') : undefined,
      sourceTypes: searchParams.get('sourceTypes') ? (searchParams.get('sourceTypes')!.split(',') as any) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'overall',
      query:
        rawQueryParam && normalizeCityAlias(rawQueryParam) !== 'East Lansing'
          ? rawQueryParam
          : undefined,
    };
  });

  // UI Views and Modals
  const [viewMode, setViewMode] = useState<'split' | 'table'>('split');
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeOutreachListing, setActiveOutreachListing] = useState<Listing | null>(null);
  const [activeCostListing, setActiveCostListing] = useState<Listing | null>(null);
  const [activeRouteListing, setActiveRouteListing] = useState<Listing | null>(null);
  const [activePhotoListing, setActivePhotoListing] = useState<Listing | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Sync saved list from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lansing_saved_listings');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('lansing_saved_listings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  // Sync filters to URL query string (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxDriveMinutes) params.set('maxDriveMinutes', filters.maxDriveMinutes.toString());
      if (filters.minBeds) params.set('minBeds', filters.minBeds.toString());
      if (filters.minBaths) params.set('minBaths', filters.minBaths.toString());
      if (filters.propertyTypes) params.set('propertyTypes', filters.propertyTypes.join(','));
      if (filters.coveredParkingMode) params.set('coveredParkingMode', filters.coveredParkingMode);
      if (filters.twoDogsMode) params.set('twoDogsMode', filters.twoDogsMode);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.cities && filters.cities.length > 0) {
        params.set('cities', filters.cities.join(','));
      } else {
        params.set('cities', 'all');
      }
      if (filters.sourceTypes && filters.sourceTypes.length > 0) {
        params.set('sourceTypes', filters.sourceTypes.join(','));
      }
      if (filters.query && filters.query.trim().length > 0) {
        params.set('q', filters.query.trim());
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [filters, router]);

  // TanStack Query to fetch all matching listings
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
      if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
      if (filters.maxDriveMinutes) queryParams.set('maxDriveMinutes', filters.maxDriveMinutes.toString());
      if (filters.minBeds) queryParams.set('minBeds', filters.minBeds.toString());
      if (filters.minBaths) queryParams.set('minBaths', filters.minBaths.toString());
      if (filters.propertyTypes) queryParams.set('propertyTypes', filters.propertyTypes.join(','));
      if (filters.coveredParkingMode) queryParams.set('coveredParkingMode', filters.coveredParkingMode);
      if (filters.twoDogsMode) queryParams.set('twoDogsMode', filters.twoDogsMode);
      if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
      if (filters.cities && filters.cities.length > 0) {
        queryParams.set('cities', filters.cities.join(','));
      }
      if (filters.sourceTypes && filters.sourceTypes.length > 0) {
        queryParams.set('sourceTypes', filters.sourceTypes.join(','));
      }
      if (filters.query && filters.query.trim().length > 0) {
        queryParams.set('q', filters.query.trim());
      }

      const res = await fetch(`/api/listings?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load listings');
      return res.json();
    },
  });

  const listings: Listing[] = data?.listings || [];

  const comparedListings = useMemo(() => {
    return listings.filter((l) => compareIds.includes(l.id));
  }, [listings, compareIds]);

  const activeCityName =
    filters.cities && filters.cities.length === 1 ? normalizeCityAlias(filters.cities[0]) : null;
  const isEastLansingFocus =
    activeCityName === 'East Lansing' &&
    filters.propertyTypes?.length === 1 &&
    filters.propertyTypes[0] === 'apartment';

  // Compute dynamic summary stats strictly from dataset at runtime
  const runtimeStats = useMemo(() => {
    if (listings.length === 0) return null;
    const prices = listings.map((l) => l.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const uniqueAddresses = new Set(listings.map((l) => l.address.line1)).size;
    const amMinutes = listings
      .map((l) => l.commute?.morning.minutes)
      .filter((m): m is number => typeof m === 'number');
    const minAm = amMinutes.length > 0 ? Math.min(...amMinutes) : null;
    const maxAm = amMinutes.length > 0 ? Math.max(...amMinutes) : null;
    return {
      count: listings.length,
      communities: uniqueAddresses,
      minPrice,
      maxPrice,
      minAm,
      maxAm,
    };
  }, [listings]);

  // Export current filtered results as CSV
  const handleExportCSV = () => {
    if (listings.length === 0) return;
    const csvData = listings.map((item) => ({
      ID: item.id,
      Community: item.communityName || item.address.line1,
      Operator: item.operator || 'Private Landlord',
      PropertyType: item.propertyType,
      Address: `${item.address.line1}, ${item.address.city}, ${item.address.state || 'MI'} ${item.address.zip}`,
      Price: item.price,
      Beds: item.beds,
      Baths: item.baths,
      Sqft: item.sqft || 'Not yet sourced',
      PricePerSqft: item.sqft ? (item.price / item.sqft).toFixed(2) : '',
      MorningCommuteMin: item.commute?.morning.minutes || '',
      EveningCommuteMin: item.commute?.evening.minutes || '',
      PrimaryCorridor: item.commute?.primaryCorridor || '',
      GoogleMapsRouteUrl: item.commute?.googleMapsUrl || '',
      TwoDogsAllowed: item.petPolicy.twoDogsOk,
      TwoCarsCovered: item.parking.twoCarsCovered,
      InUnitLaundry: item.amenities.inUnitLaundry ? 'Yes' : 'No',
      SourceURL: item.source_url || item.url,
      PhotoGalleryURL: item.gallery_url || item.source_url || item.url,
      RetrievedAt: item.retrieved_at || item.lastSeenAt,
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const slug = activeCityName ? activeCityName.replace(/\s+/g, '_') : 'Lansing_Regional';
    link.setAttribute('download', `${slug}_Apartments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-stone-950 pb-20 lg:pb-0">
      <Navbar
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        isRefreshing={isRefetching}
        onRefresh={() => refetch()}
        lastUpdated={data?.meta?.fetchedAt}
      />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        resultCount={listings.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        mobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 w-full">
        {/* Banner with active submarket & commute destination info */}
        <div className="mb-5 rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-teal-800 dark:text-teal-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Commute Target: {WORK_LOCATION.name} · {WORK_LOCATION.address}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white mt-1">
                {activeCityName === 'East Lansing'
                  ? filters.propertyTypes?.length === 1 && filters.propertyTypes[0] === 'apartment'
                    ? 'Apartments in East Lansing, Michigan (48824 / 48823)'
                    : 'Rentals in East Lansing, Michigan (48824 / 48823)'
                  : activeCityName
                  ? `Rentals in ${activeCityName}, Michigan`
                  : 'Greater Lansing Regional Housing Finder'}
              </h1>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-1">
                {runtimeStats ? (
                  <>
                    <strong>{runtimeStats.count}</strong> sourced floorplans across{' '}
                    <strong>{runtimeStats.communities}</strong> properties · Base rent{' '}
                    <strong>
                      ${runtimeStats.minPrice.toLocaleString()}–${runtimeStats.maxPrice.toLocaleString()}/mo
                    </strong>
                    {runtimeStats.minAm !== null && runtimeStats.maxAm !== null && (
                      <>
                        {' '}
                        · Morning drive <strong>{runtimeStats.minAm}–{runtimeStats.maxAm} min</strong> via M-43 / E Saginaw to 241 East Saginaw
                      </>
                    )}
                  </>
                ) : (
                  'Adjust search filters above to explore sourced apartment floorplans and operator portals.'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              {!isEastLansingFocus ? (
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cities: ['East Lansing'],
                      propertyTypes: ['apartment'],
                      query: undefined,
                    })
                  }
                  className="min-h-11 sm:min-h-9 inline-flex items-center space-x-1.5 rounded-xl bg-teal-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 shadow-xs transition"
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>Focus East Lansing Apartments</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cities: undefined,
                      propertyTypes: ['apartment', 'townhome', 'condo', 'single_family'],
                      query: undefined,
                    })
                  }
                  className="min-h-11 sm:min-h-9 inline-flex items-center space-x-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Expand to All 16 OC Cities</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={listings.length === 0}
                className="min-h-11 sm:min-h-9 inline-flex items-center space-x-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 shadow-xs dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
              >
                <Download className="h-3.5 w-3.5 text-stone-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Layouts */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl border border-stone-200 bg-white p-4 animate-pulse dark:bg-stone-900">
                <div className="h-48 w-full rounded-xl bg-stone-200 dark:bg-stone-800" />
                <div className="mt-4 h-6 w-1/3 rounded bg-stone-200 dark:bg-stone-800" />
                <div className="mt-2 h-4 w-2/3 rounded bg-stone-200 dark:bg-stone-800" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 px-6 text-center dark:border-stone-800 dark:bg-stone-900">
            <Sliders className="mx-auto h-10 w-10 text-stone-400" />
            <h3 className="font-serif mt-3 text-lg font-bold text-stone-900 dark:text-white">
              No matching apartments with your current criteria
            </h3>
            <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
              Try relaxing the rent ceiling, parking filter, or resetting to all Lansing submarkets.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    maxPrice: 10000,
                    maxDriveMinutes: 40,
                    twoDogsMode: 'lenient',
                    coveredParkingMode: 'lenient',
                    cities: undefined,
                    propertyTypes: ['apartment'],
                    sourceTypes: undefined,
                    query: undefined,
                  })
                }
                className="min-h-11 rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Listing Cards Column */}
            <div
              className={`lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5 ${
                mobileTab === 'map' ? 'hidden lg:grid' : 'grid'
              }`}
            >
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSaved={savedIds.includes(listing.id)}
                  isCompared={compareIds.includes(listing.id)}
                  onToggleSaved={toggleSaved}
                  onToggleCompare={toggleCompare}
                  onOpenOutreach={setActiveOutreachListing}
                  onOpenCostReality={setActiveCostListing}
                  onOpenRoute={setActiveRouteListing}
                  onOpenPhotos={(listing, idx) => { setActivePhotoListing(listing); setActivePhotoIndex(idx || 0); }}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  isHovered={hoveredId === listing.id}
                />
              ))}
            </div>

            {/* Interactive Map Column */}
            <div
              className={`lg:col-span-5 sticky top-36 h-[calc(100vh-9.5rem)] min-h-[420px] ${
                mobileTab === 'list' ? 'hidden lg:block' : 'block'
              }`}
            >
              <MapView
                listings={listings}
                hoveredId={hoveredId}
                onHoverListing={setHoveredId}
                onSelectListing={(l) => setActiveOutreachListing(l)}
                onOpenRoute={setActiveRouteListing}
              />
            </div>
          </div>
        ) : (
          <TableView
            listings={listings}
            savedIds={savedIds}
            compareIds={compareIds}
            onToggleSaved={toggleSaved}
            onToggleCompare={toggleCompare}
            onOpenOutreach={setActiveOutreachListing}
            onOpenRoute={setActiveRouteListing}
            onOpenPhotos={(listing, idx) => { setActivePhotoListing(listing); setActivePhotoIndex(idx || 0); }}
          />
        )}

        {/* Section: Greater Lansing & Regional Operator Portals */}
        <section className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-800">
          <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400">
            <Building className="h-5 w-5" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Official Greater Lansing & East Lansing Leasing Portals
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Direct operator portals for East Lansing, Okemos, Haslett, and Lansing apartment communities:
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {UPSCALE_COMMUNITIES.map((operator) => (
              <div
                key={operator.name}
                className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs transition hover:border-teal-700 dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                      {operator.name}
                    </h4>
                    <span className="text-[10px] shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-stone-600 font-medium dark:bg-stone-800 dark:text-stone-300">
                      {operator.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">{operator.description}</p>
                  <p className="text-[11px] text-teal-800 dark:text-teal-400 font-medium mt-2">
                    {operator.lansingCoverage}
                  </p>
                  {operator.phone && (
                    <p className="text-[10px] text-stone-400 font-mono mt-1">
                      {operator.phone}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const isSelected = filters.operators?.includes(operator.filterKey);
                      if (isSelected) {
                        setFilters({ ...filters, operators: undefined });
                      } else {
                        setFilters({ ...filters, operators: [operator.filterKey] });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`min-h-11 inline-flex w-full items-center justify-center space-x-1.5 rounded-xl text-xs font-bold transition ${
                      filters.operators?.includes(operator.filterKey)
                        ? 'bg-teal-800 text-white shadow-xs hover:bg-teal-700'
                        : 'bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" />
                    <span>
                      {filters.operators?.includes(operator.filterKey)
                        ? '✓ Showing Operator Properties'
                        : 'Filter to This Operator'}
                    </span>
                  </button>
                  <a
                    href={operator.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 inline-flex w-full items-center justify-center space-x-1 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Floating Map/List Switcher Pill Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab(mobileTab === 'list' ? 'map' : 'list')}
          className="min-h-11 flex items-center space-x-2 rounded-full bg-stone-900 text-white px-5 py-2.5 text-xs font-bold shadow-xl border border-stone-700/80 active:scale-95 transition hover:bg-stone-800"
        >
          {mobileTab === 'list' ? (
            <>
              <MapIcon className="h-4 w-4 text-amber-400" />
              <span>View Map</span>
            </>
          ) : (
            <>
              <ListIcon className="h-4 w-4 text-teal-400" />
              <span>View {listings.length} Apartments</span>
            </>
          )}
        </button>
      </div>

      {/* Slide-Up Modals & Drawers */}
      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        listings={comparedListings}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />

      <RouteModal
        listing={activeRouteListing}
        onClose={() => setActiveRouteListing(null)}
      />

      <OutreachHelperModal
        listing={activeOutreachListing}
        onClose={() => setActiveOutreachListing(null)}
      />

      <CostRealityModal
        listing={activeCostListing}
        onClose={() => setActiveCostListing(null)}
      />

      <PhotoGalleryModal
        listing={activePhotoListing}
        initialIndex={activePhotoIndex}
        isOpen={!!activePhotoListing}
        onClose={() => setActivePhotoListing(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading Lansing Housing Finder...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
