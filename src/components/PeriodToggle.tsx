/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { SubscriptionPeriod } from '../types/checkout.ts';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

interface PeriodToggleProps {
  period: SubscriptionPeriod;
  onChange: (period: SubscriptionPeriod) => void;
  yearlyDiscountPercent?: string | number;
  yearlyPrice: number;
}

export const PeriodToggle: React.FC<PeriodToggleProps> = ({
  period,
  onChange,
  yearlyDiscountPercent,
  yearlyPrice,
}) => {
  const discountVal = typeof yearlyDiscountPercent === 'string'
    ? parseFloat(yearlyDiscountPercent)
    : Number(yearlyDiscountPercent || 0);

  const monthlyEquivalent = yearlyPrice > 0 ? formatAZN(yearlyPrice / 12) : null;

  return (
    <div className="w-full">
      <div
        role="radiogroup"
        aria-label="Ödəniş dövrü"
        className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80"
      >
        {/* Monthly Option */}
        <button
          type="button"
          role="radio"
          aria-checked={period === 'monthly'}
          onClick={() => onChange('monthly')}
          className={`relative flex flex-col items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            period === 'monthly'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 dark:bg-slate-700 dark:text-white dark:border-slate-600'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <span>{az.period.monthly}</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
            30 günlük abunəlik
          </span>
        </button>

        {/* Yearly Option */}
        <button
          type="button"
          role="radio"
          aria-checked={period === 'yearly'}
          onClick={() => onChange('yearly')}
          className={`relative flex flex-col items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            period === 'yearly'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 dark:bg-slate-700 dark:text-white dark:border-slate-600'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span>{az.period.yearly}</span>
            {discountVal > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300">
                {az.period.savePercent(discountVal.toFixed(1).replace('.', ','))}
              </span>
            )}
          </div>
          {monthlyEquivalent && (
            <span className="text-xs font-normal text-emerald-700 dark:text-emerald-400 mt-0.5">
              {az.period.monthlyEquivalent(monthlyEquivalent)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
