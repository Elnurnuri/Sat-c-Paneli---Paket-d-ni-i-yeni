/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const SkeletonCheckout: React.FC = () => {
  return (
    <div className="w-full max-w-[1100px] mx-auto animate-pulse space-y-6" aria-busy="true" aria-label="Yüklənir">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: 2 cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Card 1: Toggle & Package */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="pt-4 space-y-3">
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="grid grid-cols-2 gap-3 pt-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-5 bg-slate-100 dark:bg-slate-800/60 rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Payment & Coupon */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
            <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/30 rounded-xl" />
          </div>
        </div>

        {/* Right column: Order summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
