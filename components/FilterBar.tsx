'use client';

import React, { useState, useId } from 'react';
import { SearchFilters, PropertyType, SourceType } from '@/lib/providers/types';
import { normalizeCityAlias } from '@/lib/providers';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Dog,
  Car,
  X,
  MapPin,
  Building,
  Navigation,
  Search,
  Home,
} from 'lucide-react';

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  resultCount: number;
  viewMode: 'split' | 'table';
  onViewModeChange: (mode: 'split' | 'table') => void;
  mobileTab?: 'list' | 'map';
  onMobileTabChange?: (tab: 'list' | 'map') => void;
}

const REGIONAL_CITIES = [
  { id: 'all', label: 'All Lansing Metro' },
  { id: 'East Lansing', label: 'East Lansing (3-7m)' },
  { id: 'Okemos', label: 'Okemos (6-12m)' },
  { id: 'Haslett', label: 'Haslett (8-12m)' },
  { id: 'Lansing', label: 'Downtown Lansing (8-12m)' },
  { id: 'DeWitt', label: 'DeWitt (14-18m)' },
  { id: 'Holt', label: 'Holt (14-18m)' },
  { id: 'Grand Ledge', label: 'Grand Ledge (18-22m)' },
];

const QUICK_SEARCH_SUGGESTIONS = [
  'East Lansing, MI 48823',
  'The Abbot Luxury',
  'Newman Lofts',
  'Hub on Campus East Lansing',
  'Hidden Tree Apartments',
  'Club Meridian Okemos',
  'The Reserve at Okemos',
  'Elevation Central Park',
  'Stadium District Lofts',
  'Prudden Wheel Lofts',
  'Nemoke Trails Haslett',
  'Autumn Ridge DeWitt',
];

const SOURCE_TYPES: { id: SourceType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Sources' },
  { id: 'reit_operator', label: 'Apartment Operators (DTN, Gillespie Group, Eyde)' },
  { id: 'private_landlord', label: 'Private Landlords (Condos/Townhomes/SFRs)' },
  { id: 'mls_broker', label: 'MLS Brokerages (Greater Lansing Association of REALTORS)' },
  { id: 'boutique_pm', label: 'Executive Rentals (Berkshire Hathaway)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  resultCount,
  viewMode,
  onViewModeChange,
  mobileTab = 'list',
  onMobileTabChange,
}) => {
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.query || '');
  const searchInputId = useId();
  const datalistId = useId();

  const update = (patch: Partial<SearchFilters>) => {
    onFilterChange({ ...filters, ...patch });
  };

  const isApartmentsOnly =
    filters.propertyTypes &&
    filters.propertyTypes.length === 1 &&
    filters.propertyTypes[0] === 'apartment';

  const setApartmentsOnly = (onlyApts: boolean) => {
    if (onlyApts) {
      update({ propertyTypes: ['apartment'] });
    } else {
      update({ propertyTypes: ['apartment', 'townhome', 'condo', 'single_family'] });
    }
  };

  const togglePropertyType = (type: PropertyType) => {
    const current = filters.propertyTypes || ['apartment', 'single_family', 'townhome', 'condo'];
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    update({ propertyTypes: updated.length > 0 ? updated : ['apartment'] });
  };

  const selectedCity =
    filters.cities && filters.cities.length > 0 ? normalizeCityAlias(filters.cities[0]) : 'all';

  const setCity = (cityId: string) => {
    if (cityId === 'all') {
      update({ cities: undefined, query: undefined });
      setSearchDraft('');
    } else {
      update({ cities: [normalizeCityAlias(cityId)], query: undefined });
      setSearchDraft('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchDraft.trim();
    if (!trimmed) {
      update({ query: undefined });
      return;
    }
    const normalized = normalizeCityAlias(trimmed);
    const matchingRegional = REGIONAL_CITIES.find(
      (c) => c.id !== 'all' && c.id.toLowerCase() === normalized.toLowerCase()
    );
    if (matchingRegional) {
      update({ cities: [matchingRegional.id], query: undefined });
    } else {
      update({ cities: undefined, query: trimmed });
    }
  };

  const clearSearch = () => {
    setSearchDraft('');
    update({ query: undefined });
  };

  const selectedSource =
    filters.sourceTypes && filters.sourceTypes.length > 0 ? filters.sourceTypes[0] : 'all';

  const setSource = (srcId: SourceType | 'all') => {
    if (srcId === 'all') {
      update({ sourceTypes: undefined });
    } else {
      update({ sourceTypes: [srcId] });
    }
  };

  return (
    <div className="sticky top-16 z-30 w-full border-b border-stone-200 bg-white/95 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/95">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8 space-y-2">
        {/* Row 1: Semantic Search Form + Property Type Quick Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <form
            action="/"
            method="GET"
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center gap-1.5"
          >
            <label
              htmlFor={searchInputId}
              className="text-xs font-semibold text-stone-600 dark:text-stone-300 shrink-0 flex items-center gap-1"
            >
              <Search className="h-3.5 w-3.5 text-teal-700" />
              <span>Location:</span>
            </label>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                id={searchInputId}
                name="q"
                list={datalistId}
                value={searchDraft}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchDraft(val);
                  if (val.trim() === '') {
                    update({ query: undefined });
                  }
                }}
                placeholder="East Lansing, Okemos, The Abbot, Stadium District..."
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="search"
                className="w-full min-h-11 sm:min-h-9 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 pr-7 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
              />
              {searchDraft && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search query"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <datalist id={datalistId}>
                {QUICK_SEARCH_SUGGESTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <button
              type="submit"
              className="min-h-11 sm:min-h-9 rounded-xl bg-teal-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition shrink-0"
            >
              Search
            </button>
          </form>

          {/* Direct Property Type Focus Toggle (Apartments Only vs All Home Types) */}
          <div className="flex items-center gap-1.5">
            <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-0.5 text-xs font-semibold dark:border-stone-800 dark:bg-stone-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setApartmentsOnly(true)}
                className={`flex-1 sm:flex-initial inline-flex min-h-10 sm:min-h-8 items-center justify-center gap-1 rounded-lg px-3 py-1 transition ${
                  isApartmentsOnly
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Apartments Only</span>
              </button>
              <button
                type="button"
                onClick={() => setApartmentsOnly(false)}
                className={`flex-1 sm:flex-initial inline-flex min-h-10 sm:min-h-8 items-center justify-center gap-1 rounded-lg px-3 py-1 transition ${
                  !isApartmentsOnly
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>All Home Types</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: City Filter Chips Bar (Scrollable on mobile) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center space-x-1 text-xs font-semibold text-stone-500 shrink-0 pr-1">
            <MapPin className="h-3.5 w-3.5 text-teal-700" />
            <span className="hidden sm:inline">Submarket:</span>
          </div>
          {REGIONAL_CITIES.map((city) => {
            const isSelected =
              !filters.query &&
              (selectedCity.toLowerCase() === city.id.toLowerCase() ||
                (city.id === 'all' && (!filters.cities || filters.cities.length === 0)));
            return (
              <button
                type="button"
                key={city.id}
                onClick={() => setCity(city.id)}
                className={`whitespace-nowrap min-h-11 sm:min-h-7 rounded-full px-3 py-1 text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {city.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Bar Header (Visible on < md) */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="flex-1 min-h-11 inline-flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-xs dark:border-stone-750 dark:bg-stone-800 dark:text-stone-200"
          >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-teal-700" />
              <span>Filters & Constraints</span>
            </div>
            <span className="rounded-full bg-teal-800 px-2 py-0.5 text-[10px] font-bold text-white">
              ${(filters.maxPrice || 10000).toLocaleString()} · {filters.maxDriveMinutes || 40}m
            </span>
          </button>

          {/* Mobile List / Map Tab switcher */}
          {onMobileTabChange && (
            <div className="flex rounded-xl border border-stone-200 bg-stone-100 p-0.5 text-xs font-bold dark:border-stone-800 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => onMobileTabChange('list')}
                className={`min-h-10 rounded-lg px-3 py-1.5 transition ${
                  mobileTab === 'list'
                    ? 'bg-white text-teal-900 shadow-xs dark:bg-stone-700 dark:text-white'
                    : 'text-stone-500'
                }`}
              >
                List ({resultCount})
              </button>
              <button
                type="button"
                onClick={() => onMobileTabChange('map')}
                className={`min-h-10 rounded-lg px-3 py-1.5 transition ${
                  mobileTab === 'map'
                    ? 'bg-white text-teal-900 shadow-xs dark:bg-stone-700 dark:text-white'
                    : 'text-stone-500'
                }`}
              >
                Map
              </button>
            </div>
          )}
        </div>

        {/* Desktop Quick Control Bar (Visible on >= md) */}
        <div className="hidden md:flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Max Rent Price */}
            <div className="flex items-center space-x-1.5 rounded-lg border border-stone-200 bg-stone-50/80 px-2.5 py-1.5 dark:border-stone-800 dark:bg-stone-800/80">
              <label htmlFor="desktop-max-rent" className="font-medium text-stone-500">
                Max Rent:
              </label>
              <select
                id="desktop-max-rent"
                name="maxPrice"
                value={filters.maxPrice || 10000}
                onChange={(e) => update({ maxPrice: parseInt(e.target.value, 10) })}
                className="bg-transparent font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
              >
                <option value="3000">$3,000/mo</option>
                <option value="3500">$3,500/mo</option>
                <option value="4500">$4,500/mo</option>
                <option value="5500">$5,500/mo</option>
                <option value="7000">$7,000/mo</option>
                <option value="8500">$8,500/mo</option>
                <option value="10000">$10,000/mo</option>
                <option value="12000">$12,000/mo</option>
              </select>
            </div>

            {/* Commute Minutes Select */}
            <div className="flex items-center space-x-1.5 rounded-lg border border-stone-200 bg-stone-50/80 px-2.5 py-1.5 dark:border-stone-800 dark:bg-stone-800/80">
              <Navigation className="h-3 w-3 text-teal-700" />
              <label htmlFor="desktop-max-drive" className="font-medium text-stone-500">
                Drive to Bank:
              </label>
              <select
                id="desktop-max-drive"
                name="maxDriveMinutes"
                value={filters.maxDriveMinutes || 40}
                onChange={(e) => update({ maxDriveMinutes: parseInt(e.target.value, 10) })}
                className="bg-transparent font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
              >
                <option value="15">≤ 15 min</option>
                <option value="20">≤ 20 min (Aliso North & Town Center)</option>
                <option value="25">≤ 25 min (All Aliso Viejo 92656)</option>
                <option value="30">≤ 30 min</option>
                <option value="35">≤ 35 min</option>
                <option value="40">≤ 40 min (Max Radius)</option>
              </select>
            </div>

            {/* Source Type Filter */}
            <div className="flex items-center space-x-1.5 rounded-lg border border-stone-200 bg-stone-50/80 px-2.5 py-1.5 dark:border-stone-800 dark:bg-stone-800/80">
              <Building className="h-3 w-3 text-teal-700" />
              <label htmlFor="desktop-source-type" className="font-medium text-stone-500">
                Source:
              </label>
              <select
                id="desktop-source-type"
                name="sourceTypes"
                value={selectedSource}
                onChange={(e) => setSource(e.target.value as any)}
                className="bg-transparent font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
              >
                {SOURCE_TYPES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2 Dogs Quick Toggle */}
            <button
              type="button"
              onClick={() =>
                update({
                  twoDogsMode: filters.twoDogsMode === 'strict' ? 'lenient' : 'strict',
                })
              }
              className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 transition ${
                filters.twoDogsMode === 'strict'
                  ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold dark:bg-teal-950 dark:text-teal-200'
                  : 'border-stone-200 bg-stone-50/80 text-stone-600 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300'
              }`}
            >
              <Dog className="h-3.5 w-3.5 text-teal-700" />
              <span>2 Dogs: {filters.twoDogsMode === 'strict' ? 'Confirmed (2)' : 'Allow Pending'}</span>
            </button>

            {/* 2 Cars Covered Parking Quick Toggle */}
            <button
              type="button"
              onClick={() => {
                const next =
                  filters.coveredParkingMode === 'confirmed'
                    ? 'lenient'
                    : filters.coveredParkingMode === 'lenient'
                    ? 'any'
                    : 'confirmed';
                update({ coveredParkingMode: next });
              }}
              className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 transition ${
                filters.coveredParkingMode === 'confirmed'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold dark:bg-indigo-950 dark:text-indigo-200'
                  : 'border-stone-200 bg-stone-50/80 text-stone-600 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300'
              }`}
            >
              <Car className="h-3.5 w-3.5 text-indigo-600" />
              <span>
                Parking:{' '}
                {filters.coveredParkingMode === 'confirmed'
                  ? '2 Covered (Confirmed)'
                  : filters.coveredParkingMode === 'lenient'
                  ? 'Garage / Covered'
                  : 'Any'}
              </span>
            </button>

            {/* Advanced Filters Expand button */}
            <button
              type="button"
              onClick={() => setDesktopExpanded(!desktopExpanded)}
              className="inline-flex items-center space-x-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>More</span>
              {desktopExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* View Mode & Count */}
          <div className="flex items-center space-x-3 text-xs shrink-0">
            <span className="font-semibold text-stone-600 dark:text-stone-400">
              <strong className="text-teal-800 dark:text-teal-400">{resultCount}</strong> sourced matches
            </span>

            <div className="flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 dark:border-stone-800 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => onViewModeChange('split')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === 'split'
                    ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                Split Map
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Expanded Drawer */}
        {desktopExpanded && (
          <div className="hidden md:grid grid-cols-4 gap-4 pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 text-xs animate-in slide-in-from-top-2 duration-150">
            {/* Property Types */}
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">Property Type:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['apartment', 'townhome', 'condo', 'single_family'] as PropertyType[]).map((type) => {
                  const active = (filters.propertyTypes || ['apartment']).includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => togglePropertyType(type)}
                      className={`rounded-lg py-1 px-2 capitalize font-semibold border transition text-center ${
                        active
                          ? 'border-teal-700 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                          : 'border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-400'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Beds & Baths */}
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">Bedrooms & Baths:</span>
              <div className="flex space-x-2">
                <select
                  aria-label="Minimum bedrooms"
                  value={filters.minBeds || 1}
                  onChange={(e) => update({ minBeds: parseInt(e.target.value, 10) })}
                  className="w-1/2 rounded-lg border border-stone-200 bg-stone-50 p-1.5 font-semibold dark:border-stone-800 dark:bg-stone-800"
                >
                  <option value="1">1+ Bed</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                </select>
                <select
                  aria-label="Minimum bathrooms"
                  value={filters.minBaths || 1}
                  onChange={(e) => update({ minBaths: parseFloat(e.target.value) })}
                  className="w-1/2 rounded-lg border border-stone-200 bg-stone-50 p-1.5 font-semibold dark:border-stone-800 dark:bg-stone-800"
                >
                  <option value="1">1+ Bath</option>
                  <option value="1.5">1.5+ Baths</option>
                  <option value="2">2+ Baths</option>
                </select>
              </div>
            </div>

            {/* Sort by */}
            <div>
              <label htmlFor="desktop-sort-order" className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                Sort Order:
              </label>
              <select
                id="desktop-sort-order"
                value={filters.sortBy || 'overall'}
                onChange={(e) => update({ sortBy: e.target.value as any })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 p-1.5 font-semibold dark:border-stone-800 dark:bg-stone-800"
              >
                <option value="overall">Highest Benchmark Score</option>
                <option value="commute">Shortest Commute (Fastest Drive)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="sqft">Largest Square Footage</option>
                <option value="price_sqft">Lowest Price per Sq Ft</option>
              </select>
            </div>

            {/* Commute Peak Mode */}
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">Traffic Window:</span>
              <label className="flex items-center space-x-2 rounded-lg border border-stone-200 bg-stone-50 p-1.5 cursor-pointer dark:border-stone-800 dark:bg-stone-800">
                <input
                  type="checkbox"
                  checked={filters.useWorstCaseCommute || false}
                  onChange={(e) => update({ useWorstCaseCommute: e.target.checked })}
                  className="rounded text-teal-700 focus:ring-teal-500"
                />
                <span className="font-medium">Peak Rush Hour (Worst of AM/PM)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-over / Sheet */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 md:hidden animate-in fade-in duration-200">
          <div className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 text-xs dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                Filter Aliso Viejo & OC Apartments
              </h3>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                aria-label="Close filters"
                className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-stone-100 p-1.5 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Property Types */}
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-2">Property Types:</span>
              <div className="grid grid-cols-2 gap-2">
                {(['apartment', 'townhome', 'condo', 'single_family'] as PropertyType[]).map((type) => {
                  const active = (filters.propertyTypes || ['apartment']).includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => togglePropertyType(type)}
                      className={`min-h-11 rounded-xl py-2 px-3 capitalize font-semibold border transition text-center ${
                        active
                          ? 'border-teal-700 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                          : 'border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-400'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Regional City Selector */}
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-2">City / Submarket:</span>
              <div className="flex flex-wrap gap-1.5">
                {REGIONAL_CITIES.map((city) => {
                  const isSelected =
                    selectedCity.toLowerCase() === city.id.toLowerCase() ||
                    (city.id === 'all' && (!filters.cities || filters.cities.length === 0));
                  return (
                    <button
                      type="button"
                      key={city.id}
                      onClick={() => setCity(city.id)}
                      className={`min-h-11 rounded-full px-3 py-1.5 font-semibold transition ${
                        isSelected
                          ? 'bg-teal-800 text-white'
                          : 'border border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {city.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Rent Slider */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-750 dark:bg-stone-800">
              <div className="flex justify-between font-semibold mb-1.5">
                <label htmlFor="mobile-max-rent" className="text-stone-700 dark:text-stone-300">
                  Max Monthly Rent:
                </label>
                <span className="font-mono font-bold text-teal-800 dark:text-teal-400">
                  ${(filters.maxPrice || 10000).toLocaleString()}/mo
                </span>
              </div>
              <input
                id="mobile-max-rent"
                type="range"
                min="2250"
                max="12000"
                step="250"
                value={filters.maxPrice || 10000}
                onChange={(e) => update({ maxPrice: parseInt(e.target.value, 10) })}
                className="h-2 w-full accent-teal-700 cursor-pointer"
              />
            </div>

            {/* Commute Minutes Slider */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-750 dark:bg-stone-800">
              <div className="flex justify-between font-semibold mb-1.5">
                <label htmlFor="mobile-max-drive" className="text-stone-700 dark:text-stone-300">
                  Max Commute to 100 Progress:
                </label>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {filters.maxDriveMinutes || 40} minutes
                </span>
              </div>
              <input
                id="mobile-max-drive"
                type="range"
                min="10"
                max="45"
                step="5"
                value={filters.maxDriveMinutes || 40}
                onChange={(e) => update({ maxDriveMinutes: parseInt(e.target.value, 10) })}
                className="h-2 w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Household Constraints */}
            <div className="space-y-2">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">Household Constraints:</span>

              <button
                type="button"
                onClick={() =>
                  update({
                    twoDogsMode: filters.twoDogsMode === 'strict' ? 'lenient' : 'strict',
                  })
                }
                className={`min-h-11 w-full flex items-center justify-between rounded-xl border p-3 font-semibold transition ${
                  filters.twoDogsMode === 'strict'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                    : 'border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Dog className="h-4 w-4 text-teal-700" />
                  <span>2 Dogs Policy</span>
                </div>
                <span className="text-[11px] font-bold">
                  {filters.twoDogsMode === 'strict' ? 'Confirmed (2)' : 'Allow Pending'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next =
                    filters.coveredParkingMode === 'confirmed'
                      ? 'lenient'
                      : filters.coveredParkingMode === 'lenient'
                      ? 'any'
                      : 'confirmed';
                  update({ coveredParkingMode: next });
                }}
                className={`min-h-11 w-full flex items-center justify-between rounded-xl border p-3 font-semibold transition ${
                  filters.coveredParkingMode === 'confirmed'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200'
                    : 'border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-indigo-600" />
                  <span>2 Covered Parking Spaces</span>
                </div>
                <span className="text-[11px] font-bold">
                  {filters.coveredParkingMode === 'confirmed'
                    ? 'Confirmed Only'
                    : filters.coveredParkingMode === 'lenient'
                    ? 'Garage / Covered'
                    : 'Any'}
                </span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="min-h-11 w-full rounded-2xl bg-teal-800 py-3 text-center text-xs font-bold text-white shadow-md hover:bg-teal-700"
              >
                Show {resultCount} Matching Homes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
