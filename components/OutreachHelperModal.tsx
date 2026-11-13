'use client';

import React, { useState } from 'react';
import { Listing } from '@/lib/providers/types';
import { X, Copy, Check, Mail, Phone, ExternalLink } from 'lucide-react';

interface OutreachHelperModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const OutreachHelperModal: React.FC<OutreachHelperModalProps> = ({
  listing,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const emailSubject = `Inquiry regarding rental availability & pet/parking policy - ${listing.communityName || listing.address.line1}`;
  
  const emailBody = `Hello Leasing Team,

My husband and I are looking to relocate to Greater Lansing for our office at 241 East Saginaw, East Lansing, MI 48824. We came across ${listing.communityName || listing.address.line1} and are very interested.

Before scheduling a private tour or submitting an application, we want to confirm a few specific criteria:

1. Pet Policy: We have 2 small, well-trained dogs (~25 lbs each). Can you confirm that 2 dogs are permitted in this floorplan, along with any breed restrictions, monthly pet rent, or pet deposits?
2. Covered Parking: We have 2 vehicles and require covered parking (either a 2-car garage, private carport, or assigned covered spaces). Are 2 covered spaces included, or is there an option to reserve a second covered stall?
3. In-Unit Amenities: Can you confirm that this specific unit features an in-unit washer and dryer and central air conditioning?
4. Move-in & Fees: What is the current availability date, required security deposit (in accordance with Michigan Landlord-Tenant Act), and are there any RUBS/utility fees?

Thank you so much for your time and assistance.

Warm regards,
Deb & Family
Contact: (714) 612-4725`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Pre-Filled Landlord Outreach Script
              </h3>
              <p className="text-xs text-stone-500">
                Addresses exact pet, 2-car parking, and California fee specifics
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

        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Subject Line:
          </label>
          <div className="rounded-lg bg-stone-50 p-2.5 text-xs font-mono text-stone-800 dark:bg-stone-800 dark:text-stone-200">
            {emailSubject}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Message Body:
          </label>
          <textarea
            readOnly
            rows={10}
            value={emailBody}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/80 p-3 text-xs font-sans text-stone-800 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-200"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <a
            href={listing.gallery_url || listing.source_url || listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center space-x-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-900 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
          >
            <span>Property Website & Photos</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
          >
            <Mail className="h-4 w-4 text-teal-700" />
            <span>Open in Mail Client</span>
          </a>

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-teal-800 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
