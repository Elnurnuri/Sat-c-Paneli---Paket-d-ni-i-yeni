/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

interface MobileStickyBarProps {
  finalAmount: number;
  hasEnoughBalance: boolean;
  isDowngradeBlocked: boolean;
  isSubmitting: boolean;
  onCompletePayment: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  finalAmount,
  hasEnoughBalance,
  isDowngradeBlocked,
  isSubmitting,
  onCompletePayment,
}) => {
  const isButtonDisabled = !hasEnoughBalance || isDowngradeBlocked || isSubmitting;

  return (
    <div
      role="region"
      aria-label="Mobil ödəniş paneli"
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-xl z-30"
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <div className="shrink-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {az.summary.totalToPay}
          </span>
          <span className="text-lg sm:text-xl font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {formatAZN(finalAmount)}
          </span>
          {!hasEnoughBalance && (
            <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Balans çatmır
            </span>
          )}
          {isDowngradeBlocked && hasEnoughBalance && (
            <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Təsdiq gözlənilir
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isButtonDisabled}
          onClick={onCompletePayment}
          className={`flex-1 min-h-[46px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
            isButtonDisabled
              ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer shadow-sm'
          }`}
          aria-label={az.summary.payButton(formatAZN(finalAmount))}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{az.summary.processing}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Ödənişi tamamla</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
