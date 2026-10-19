/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Calendar, Wallet } from 'lucide-react';
import { formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

interface SuccessViewProps {
  packageName: string;
  period: string;
  newBalance: number;
  nextBillingDate: string;
  successUrl?: string;
  onReset?: () => void;
  onOpenModal?: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  packageName,
  period,
  newBalance,
  nextBillingDate,
  successUrl = '/vendor/subscriptions',
  onReset,
  onOpenModal,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-lg mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-6"
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
        <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {az.success.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {az.success.subtitle}
        </p>
      </div>

      {/* Highlights summary */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Aktiv paket:</span>
          <span className="font-bold text-slate-900 dark:text-white">{packageName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Dövr:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {period === 'yearly' ? 'İllik (365 gün)' : 'Aylıq (30 gün)'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
            <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{az.success.newBalance}:</span>
          </div>
          <span className="font-bold tabular-nums text-slate-900 dark:text-white">
            {formatAZN(newBalance)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{az.success.nextBillingDate}:</span>
          </div>
          <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">
            {nextBillingDate}
          </span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
          >
            <span>Qəbzi və xülasəni göstər</span>
          </button>
        )}

        <a
          href={successUrl}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span>{az.success.actionDashboard}</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>{az.success.actionStay}</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Panshop Marketplace zəmanəti</span>
      </div>
    </div>
  );
};
