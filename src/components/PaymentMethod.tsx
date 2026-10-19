/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, CreditCard, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

interface PaymentMethodProps {
  walletBalance: number;
  hasEnoughBalance: boolean;
  walletTopupUrl?: string;
  onTopUpClick?: () => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  walletBalance,
  hasEnoughBalance,
  walletTopupUrl = '/vendor/wallet',
  onTopUpClick,
}) => {
  return (
    <section aria-labelledby="payment-method-title" className="space-y-3">
      <h3
        id="payment-method-title"
        className="text-base font-semibold text-slate-900 dark:text-white"
      >
        {az.paymentMethod.title}
      </h3>

      <div className="space-y-3" role="radiogroup" aria-label={az.paymentMethod.title}>
        {/* Wallet Option (Primary / Enabled if enough balance) */}
        <div
          role="radio"
          aria-checked={true}
          tabIndex={0}
          className={`relative rounded-2xl border p-4.5 transition-all ${
            hasEnoughBalance
              ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
              : 'border-amber-300 bg-amber-50/20 dark:border-amber-900/60 dark:bg-amber-950/10'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                  hasEnoughBalance
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                }`}
              >
                <Wallet className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    {az.paymentMethod.walletTitle}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Əsas
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {az.paymentMethod.walletDesc}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {az.paymentMethod.currentBalance}:
                  </span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      hasEnoughBalance
                        ? 'text-slate-900 dark:text-white'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {formatAZN(walletBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom radio indicator */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-blue-600 dark:border-blue-400 shrink-0 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </div>
          </div>

          {/* Insufficient balance warning and top-up link */}
          {!hasEnoughBalance && (
            <div
              role="alert"
              aria-live="polite"
              className="mt-3.5 pt-3.5 border-t border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{az.paymentMethod.insufficientWarning}</span>
              </div>

              <a
                href={walletTopupUrl}
                onClick={(e) => {
                  if (onTopUpClick) {
                    e.preventDefault();
                    onTopUpClick();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                <span>{az.paymentMethod.topUpBalance}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Bank Card Option (Disabled / Soon) */}
        <div
          role="radio"
          aria-checked={false}
          aria-disabled={true}
          className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4.5 opacity-75 cursor-not-allowed select-none"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    {az.paymentMethod.cardTitle}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {az.paymentMethod.cardSoonBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {az.paymentMethod.cardDesc}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {az.paymentMethod.cardUnavailable}
                </p>
              </div>
            </div>

            {/* Inactive radio marker */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
};
