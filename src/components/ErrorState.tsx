/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw, LogIn } from 'lucide-react';
import { az } from '../i18n/az.ts';

interface ErrorStateProps {
  type: 'auth' | 'not_found' | 'general';
  message?: string;
  backUrl?: string;
  loginUrl?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type,
  message,
  backUrl = '/vendor/packages',
  loginUrl = '/login',
  onRetry,
}) => {
  if (type === 'auth') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="max-w-md mx-auto my-12 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
          <LogIn className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {az.errors.authTitle}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {message || az.errors.authMessage}
        </p>
        <div className="pt-2">
          <a
            href={loginUrl}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Daxil ol</span>
          </a>
        </div>
      </div>
    );
  }

  const isNotFound = type === 'not_found';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-md mx-auto my-12 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {isNotFound ? az.errors.notFoundTitle : az.errors.genericTitle}
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {message || (isNotFound ? az.errors.notFoundMessage : 'Gözlənilməz xəta baş verdi.')}
      </p>

      <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
        <a
          href={backUrl}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{az.errors.backToPackages}</span>
        </a>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{az.errors.tryAgain}</span>
          </button>
        )}
      </div>
    </div>
  );
};
