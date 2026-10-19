/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Package,
  Wallet,
  Calendar,
  ArrowLeft,
  X,
  ShieldCheck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import type { PackageDetail, SubscriptionPeriod } from '../types/checkout.ts';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

export interface SuccessModalProps {
  isOpen: boolean;
  packageData: PackageDetail;
  period: SubscriptionPeriod;
  totalPaid: number;
  newBalance: number;
  nextBillingDate: string;
  transactionId?: string;
  successUrl?: string;
  onClose: () => void;
  onBackToSubscriptions?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  packageData,
  period,
  totalPaid,
  newBalance,
  nextBillingDate,
  transactionId = 'SUB-89410-AZ',
  successUrl = '/vendor/subscriptions',
  onClose,
  onBackToSubscriptions,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPeriodYearly = period === 'yearly';

  // Highlight top features from package
  const keyFeatures = packageData.features_matrix
    ? packageData.features_matrix.filter((f) => f.included).slice(0, 3)
    : [];

  const handleReturnClick = (e: React.MouseEvent) => {
    if (onBackToSubscriptions) {
      e.preventDefault();
      onBackToSubscriptions();
    }
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          aria-label={az.success.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Heading */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/90 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <div>
            <h2
              id="success-modal-title"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {az.success.modalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {az.success.subtitle}
            </p>
          </div>
        </div>

        {/* Summary Card with purchased details */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-4 sm:p-5 space-y-4 text-sm">
          {/* Purchased Package Row */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {packageData.name}
                  </span>
                  {packageData.is_popular && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/90 dark:text-blue-300">
                      <Sparkles className="w-2.5 h-2.5" />
                      {az.packageCard.popularBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isPeriodYearly ? 'İllik abunəlik (365 gün)' : 'Aylıq abunəlik (30 gün)'}
                </span>

                {/* Key feature highlights */}
                {keyFeatures.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    {keyFeatures.map((kf, i) => (
                      <span
                        key={kf.key || i}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60"
                      >
                        ✓ {kf.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 shrink-0">
              Aktivdir
            </span>
          </div>

          {/* Total Amount Paid */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {az.success.totalPaid}:
            </span>
            <div className="text-right">
              <span className="text-2xl font-black tabular-nums tracking-tight text-blue-600 dark:text-blue-400">
                {formatAZN(totalPaid)}
              </span>
              {totalPaid === 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {az.summary.freeAmount}
                </p>
              )}
            </div>
          </div>

          {/* Account Breakdown Items */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            {/* Payment Method */}
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                <span>{az.success.paymentMethod}:</span>
              </div>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {az.success.walletPaid}
              </span>
            </div>

            {/* New Balance */}
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{az.success.newBalance}:</span>
              </div>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                {formatAZN(newBalance)}
              </span>
            </div>

            {/* Next Billing Date */}
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{az.success.nextBillingDate}:</span>
              </div>
              <span className="font-medium tabular-nums text-slate-800 dark:text-slate-200">
                {nextBillingDate}
              </span>
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-slate-400" />
                <span>{az.success.transactionId}:</span>
              </div>
              <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                {transactionId}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          {/* Main button to go back to the subscriptions list */}
          <a
            href={successUrl}
            onClick={handleReturnClick}
            className="w-full py-3.5 px-5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{az.success.actionBackToSubscriptions}</span>
          </a>

          {/* Secondary close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <span>{az.success.close}</span>
          </button>
        </div>

        {/* Security / Marketplace guarantee footer */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-slate-400 dark:text-slate-500 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Panshop Marketplace zəmanəti</span>
        </div>
      </div>
    </div>
  );
};
