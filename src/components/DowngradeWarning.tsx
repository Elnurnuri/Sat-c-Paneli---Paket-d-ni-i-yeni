/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { DowngradeImpact } from '../types/checkout.ts';
import { az } from '../i18n/az.ts';

interface DowngradeWarningProps {
  impact: DowngradeImpact;
  isConfirmed: boolean;
  onToggleConfirm: (confirmed: boolean) => void;
}

export const DowngradeWarning: React.FC<DowngradeWarningProps> = ({
  impact,
  isConfirmed,
  onToggleConfirm,
}) => {
  if (!impact.has_impact) return null;

  const { product } = impact.impact;

  return (
    <div
      role="region"
      aria-labelledby="downgrade-warning-heading"
      className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4
            id="downgrade-warning-heading"
            className="text-sm font-bold text-amber-950 dark:text-amber-100"
          >
            {az.downgrade.title}
          </h4>
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-300">
            {az.downgrade.message(product.active, product.will_deactivate)}
          </p>
          <p className="text-xs leading-relaxed text-amber-800/80 dark:text-amber-400/80">
            {az.downgrade.hint}
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => onToggleConfirm(e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 border-amber-400 focus:ring-blue-500 dark:bg-slate-900 dark:border-amber-800"
        />
        <span className="text-amber-950 dark:text-amber-100">
          {az.downgrade.checkboxConfirm}
        </span>
      </label>
    </div>
  );
};
