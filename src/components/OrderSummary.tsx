/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import type { CalculationResult, Coupon, DowngradeImpact, PackageDetail, SubscriptionPeriod, SwitchCredit } from '../types/checkout.ts';
import { formatAZN, calculateNextBillingDate } from '../utils/pricing.ts';
import { DowngradeWarning } from './DowngradeWarning.tsx';
import { az } from '../i18n/az.ts';

interface OrderSummaryProps {
  packageData: PackageDetail;
  period: SubscriptionPeriod;
  calculation: CalculationResult;
  coupon: Coupon | null;
  switchCredit: SwitchCredit | null;
  downgradeImpact: DowngradeImpact;
  isDowngradeConfirmed: boolean;
  onToggleDowngradeConfirm: (confirmed: boolean) => void;
  isSubmitting: boolean;
  onCompletePayment: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageData,
  period,
  calculation,
  coupon,
  switchCredit,
  downgradeImpact,
  isDowngradeConfirmed,
  onToggleDowngradeConfirm,
  isSubmitting,
  onCompletePayment,
}) => {
  const nextBillingDate = calculateNextBillingDate(period);
  const isPeriodYearly = period === 'yearly';

  // Disabled criteria
  const isBlockedByBalance = !calculation.hasEnoughBalance;
  const isBlockedByDowngrade = downgradeImpact.has_impact && !isDowngradeConfirmed;
  const isButtonDisabled = isBlockedByBalance || isBlockedByDowngrade || isSubmitting;

  return (
    <aside
      aria-label={az.summary.title}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {az.summary.title}
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {isPeriodYearly ? az.period.yearly : az.period.monthly}
        </span>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-sm">
        {/* Package Row */}
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>{az.summary.packageRow}</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {packageData.name}
          </span>
        </div>

        {/* Period Row */}
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>{az.summary.periodRow}</span>
          <span className="font-medium">
            {isPeriodYearly ? 'İllik (365 gün)' : 'Aylıq (30 gün)'}
          </span>
        </div>

        {/* Base Price Row */}
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>{az.summary.basePrice}</span>
          <span
            className={`font-semibold tabular-nums ${
              calculation.discountAmount > 0
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatAZN(calculation.basePrice)}
          </span>
        </div>

        {/* Coupon Discount Row (if coupon applied) */}
        {coupon && calculation.discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-medium">
            <span>{az.summary.couponDiscount(coupon.code)}</span>
            <span className="tabular-nums font-bold">
              −{formatAZN(calculation.discountAmount)}
            </span>
          </div>
        )}

        {/* Switch Credit Row (if credit > 0) */}
        {switchCredit && switchCredit.credit > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-start justify-between gap-2 text-emerald-700 dark:text-emerald-400">
              <div className="flex items-start gap-1.5 text-xs font-semibold">
                <RotateCcw className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  {az.summary.switchCredit(switchCredit.from_package, switchCredit.remaining_days)}
                </span>
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0">
                −{formatAZN(calculation.switchCreditApplied)}
              </span>
            </div>

            {/* Refund to wallet notice if credit exceeded invoice */}
            {calculation.refundToWallet > 0 && (
              <p className="text-[11px] text-blue-700 dark:text-blue-400 pl-5">
                {az.summary.refundNote(formatAZN(calculation.refundToWallet))}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Total Separator and Display */}
      <div className="pt-4 border-t border-slate-200/90 dark:border-slate-800 space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {az.summary.totalToPay}
          </span>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white">
              {formatAZN(calculation.finalAmount)}
            </span>
            {calculation.finalAmount === 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {az.summary.freeAmount}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Downgrade Warning if applicable */}
      {downgradeImpact.has_impact && (
        <DowngradeWarning
          impact={downgradeImpact}
          isConfirmed={isDowngradeConfirmed}
          onToggleConfirm={onToggleDowngradeConfirm}
        />
      )}

      {/* Primary Payment Action Button */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          disabled={isButtonDisabled}
          onClick={onCompletePayment}
          className={`w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 select-none ${
            isButtonDisabled
              ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm cursor-pointer'
          }`}
          aria-label={az.summary.payButton(formatAZN(calculation.finalAmount))}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{az.summary.processing}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 shrink-0" />
              <span>{az.summary.payButton(formatAZN(calculation.finalAmount))}</span>
            </>
          )}
        </button>

        {/* Reason for button disabled */}
        {isBlockedByBalance && (
          <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
            Ödəniş üçün cüzdan balansınız kifayət etmir ({formatAZN(calculation.balanceShortage)} çatışmır).
          </p>
        )}
        {isBlockedByDowngrade && !isBlockedByBalance && (
          <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
            Davam etmək üçün xəbərdarlıq şərtini təsdiqləyin.
          </p>
        )}
      </div>

      {/* Auto-renewal and Trust notes */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <p className="leading-relaxed">
          {az.summary.autoRenewNote(nextBillingDate)}
        </p>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
          <span>{az.summary.securePayment}</span>
        </div>
      </div>
    </aside>
  );
};
