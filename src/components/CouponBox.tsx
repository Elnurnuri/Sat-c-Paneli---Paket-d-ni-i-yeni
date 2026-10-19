/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag, Loader2, Check, AlertCircle, X } from 'lucide-react';
import type { Coupon } from '../types/checkout.ts';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

interface CouponBoxProps {
  coupon: Coupon | null;
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  isValidating: boolean;
  errorMessage: string | null;
}

export const CouponBox: React.FC<CouponBoxProps> = ({
  coupon,
  onApply,
  onRemove,
  isValidating,
  errorMessage,
}) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim() || isValidating) return;
    const success = await onApply(inputCode.trim());
    if (success) {
      setInputCode('');
    }
  };

  const getDiscountLabel = (c: Coupon) => {
    if (c.discount_type === 'percentage') {
      return `%${c.discount_value}`;
    }
    return formatAZN(c.discount_value);
  };

  return (
    <section aria-labelledby="coupon-section-title" className="space-y-2.5">
      <h3
        id="coupon-section-title"
        className="text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        {az.coupon.title}
      </h3>

      {coupon ? (
        // Applied state: green card with code, discount and remove button
        <div
          role="status"
          className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div className="text-sm">
              <span className="font-bold tracking-wide">{coupon.code}</span>
              <span className="mx-1.5 opacity-60">·</span>
              <span className="font-medium text-emerald-700 dark:text-emerald-300">
                {getDiscountLabel(coupon)} endirim
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 py-1 px-2.5 rounded-lg hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            aria-label={`${coupon.code} kuponunu sil`}
          >
            <X className="w-3.5 h-3.5" />
            <span>{az.coupon.remove}</span>
          </button>
        </div>
      ) : (
        // Input form
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Kupon kodu (məs: PANSHOP10)"
                disabled={isValidating}
                className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium uppercase tracking-wider text-slate-900 dark:text-white placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                aria-label={az.coupon.title}
              />
            </div>

            <button
              type="submit"
              disabled={!inputCode.trim() || isValidating}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">{az.coupon.checking}</span>
                </>
              ) : (
                <span>{az.coupon.applyButton}</span>
              )}
            </button>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pl-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick suggestions helper for testing */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            <span>{az.coupon.quickSuggestions}</span>
            <button
              type="button"
              onClick={() => onApply('PANSHOP10')}
              className="font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              PANSHOP10 (-10%)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onApply('BAKU50')}
              className="font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              BAKU50 (-50 ₼)
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
