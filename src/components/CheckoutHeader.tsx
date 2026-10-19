/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { az } from '../i18n/az.ts';

interface CheckoutHeaderProps {
  backUrl?: string;
  onBackClick?: () => void;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  backUrl = '/vendor/packages',
  onBackClick,
}) => {
  return (
    <header className="mb-6 space-y-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <a
          href={backUrl}
          onClick={(e) => {
            if (onBackClick) {
              e.preventDefault();
              onBackClick();
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1 -ml-2"
          aria-label={az.header.backToPackages}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{az.header.backToPackages}</span>
        </a>

        {/* Desktop Step progress indicator */}
        <nav aria-label="Abunəlik addımları" className="hidden sm:flex items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span>{az.header.steps.select}</span>
          </span>

          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">→</span>

          <span className="flex items-center gap-1.5 text-blue-600 font-semibold dark:text-blue-400">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white dark:bg-blue-500">
              2
            </span>
            <span>{az.header.steps.checkout}</span>
          </span>

          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">→</span>

          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500">
              3
            </span>
            <span>{az.header.steps.finish}</span>
          </span>
        </nav>

        {/* Mobile Step Badge */}
        <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-900/60 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
          <span>Addım 2/3</span>
          <span className="opacity-40">·</span>
          <span>{az.header.steps.checkout}</span>
        </div>
      </div>

      {/* Main title and description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {az.header.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {az.header.subtitle}
        </p>
      </div>
    </header>
  );
};
