/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Bell,
  ExternalLink,
} from 'lucide-react';
import type { ScenarioKey } from './types/checkout.ts';
import { DevScenarioBar } from './components/DevScenarioBar.tsx';
import { PackageCheckout } from './components/PackageCheckout.tsx';
import { mockScenarios } from './services/mockData.ts';
import { formatAZN } from './utils/pricing.ts';

export default function App() {
  const [panelMode, setPanelMode] = useState<'vendor' | 'corporate'>('vendor');
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>('new_subscription');
  const [isDark, setIsDark] = useState<boolean>(false);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Dynamic panel-specific links
  const corporateSlug = 'azer-tech';
  const backUrl = panelMode === 'vendor' ? '/vendor/packages' : `/corporate/${corporateSlug}/packages`;
  const walletTopupUrl = panelMode === 'vendor' ? '/vendor/wallet' : `/corporate/${corporateSlug}/wallet`;
  const successUrl = panelMode === 'vendor' ? '/vendor/subscriptions' : `/corporate/${corporateSlug}/subscriptions`;

  const activeScenarioData = mockScenarios[currentScenario];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Dev Testing Bar (Dev environment control for all scenarios) */}
      <DevScenarioBar
        currentScenario={currentScenario}
        onSelectScenario={(scen) => setCurrentScenario(scen)}
        panelMode={panelMode}
        onTogglePanelMode={(mode) => setPanelMode(mode)}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Panel Header (Breadcrumbs + Marketplace Logo + Wallet Balance) */}
        <header className="h-16 px-3.5 sm:px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Panshop branding logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-xs">
                P
              </div>
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white hidden sm:inline">
                panshop<span className="text-blue-600">.az</span>
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Breadcrumbs */}
            <nav aria-label="Naviqasiya" className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300 hidden md:inline">
                {panelMode === 'vendor' ? 'Satıcı Paneli' : 'Şirkət Paneli'}
              </span>
              <span aria-hidden="true" className="hidden md:inline">/</span>
              <a href={backUrl} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Paketlər
              </a>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                Ödəniş
              </span>
            </nav>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href={walletTopupUrl}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Cüzdan balansı"
            >
              <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="tabular-nums">
                {formatAZN(activeScenarioData?.walletBalance ?? 2450)}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Bildirişlər"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* The Checkout Content Component */}
        <div className="flex-1 overflow-y-auto">
          <PackageCheckout
            key={`${currentScenario}-${panelMode}`}
            packageSlug="burunc-mehsul"
            initialPeriod={activeScenarioData?.initialPeriod || 'yearly'}
            backUrl={backUrl}
            walletTopupUrl={walletTopupUrl}
            successUrl={successUrl}
            loginUrl="/login"
            corporateSlug={corporateSlug}
            mode={panelMode}
            currentScenario={currentScenario}
          />
        </div>
      </div>
    </div>
  );
}
