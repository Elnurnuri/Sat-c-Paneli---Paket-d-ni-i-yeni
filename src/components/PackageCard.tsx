/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Check, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { PackageDetail } from '../types/checkout.ts';
import { az } from '../i18n/az.ts';

interface PackageCardProps {
  packageData: PackageDetail;
}

export const PackageCard: React.FC<PackageCardProps> = ({ packageData }) => {
  const [isExpandedOnMobile, setIsExpandedOnMobile] = useState(false);
  const items = packageData.features_matrix || [];
  const mobileLimit = 6;
  const hasMore = items.length > mobileLimit;

  return (
    <section
      aria-labelledby="package-details-title"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm"
    >
      {/* Header section with icon, name, badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-900/50">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id="package-details-title"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              >
                {packageData.name}
              </h2>
              {packageData.is_popular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800">
                  <Sparkles className="w-3 h-3" />
                  {az.packageCard.popularBadge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {packageData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Feature matrix: 2-column on sm+, responsive on mobile */}
      <div className="pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">
          Paketə daxil olan xüsusiyyətlər
        </h3>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {items.map((feature, idx) => {
            const isHiddenOnMobile = !isExpandedOnMobile && idx >= mobileLimit;
            return (
              <li
                key={feature.key || idx}
                className={`flex items-start gap-2.5 text-sm ${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
                {feature.included ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <span
                    className={`${
                      feature.included
                        ? 'font-medium text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500 line-through'
                    }`}
                  >
                    {feature.name}
                  </span>
                  {feature.label && (
                    <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                      ({feature.label})
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle button if features exceed mobile limit */}
        {hasMore && (
          <div className="mt-4 pt-2 sm:hidden text-center border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsExpandedOnMobile(!isExpandedOnMobile)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 py-1.5 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isExpandedOnMobile ? (
                <>
                  <span>{az.packageCard.showLess}</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>{az.packageCard.showAll(items.length)}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
