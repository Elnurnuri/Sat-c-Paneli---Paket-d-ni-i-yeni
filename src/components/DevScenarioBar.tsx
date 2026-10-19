/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { ScenarioKey } from '../types/checkout.ts';
import { mockScenarios } from '../services/mockData.ts';

interface DevScenarioBarProps {
  currentScenario: ScenarioKey;
  onSelectScenario: (scenario: ScenarioKey) => void;
  panelMode: 'vendor' | 'corporate';
  onTogglePanelMode: (mode: 'vendor' | 'corporate') => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const DevScenarioBar: React.FC<DevScenarioBarProps> = ({
  currentScenario,
  onSelectScenario,
  panelMode,
  onTogglePanelMode,
  isDark,
  onToggleDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="Tərtibatçı test ssenariləri"
      className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs px-4 py-2 transition-all"
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] shrink-0">
            DEV
          </span>
          <span className="font-semibold text-slate-300 hidden sm:inline">
            Panshop Test Mühiti
          </span>
          <button
            type="button"
            onClick={() => onTogglePanelMode(panelMode === 'vendor' ? 'corporate' : 'vendor')}
            className="px-2 py-0.5 rounded font-medium bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 cursor-pointer text-[11px] truncate"
          >
            {panelMode === 'vendor' ? 'Satıcı' : 'Şirkət'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Scenario dropdown */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:inline shrink-0" />
            <select
              value={currentScenario}
              onChange={(e) => onSelectScenario(e.target.value as ScenarioKey)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] sm:text-xs rounded-lg px-2 py-1 max-w-[145px] sm:max-w-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
              aria-label="Ssenari seçimi"
            >
              {Object.values(mockScenarios).map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1 text-[11px]"
            aria-label="Gecə/Gündüz rejimi"
          >
            <span>{isDark ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline">{isDark ? 'Gecə' : 'Gündüz'}</span>
          </button>

          {/* Expand details toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label={isOpen ? 'Təsviri bağla' : 'Təsviri aç'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded scenario description */}
      {isOpen && (
        <div className="max-w-[1100px] mx-auto mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <p>
            <strong className="text-slate-200">Aktiv ssenari:</strong>{' '}
            {mockScenarios[currentScenario]?.description}
          </p>
          <span className="text-slate-500 italic">
            Bu panel yalnız development zamanı test etmək üçün mövcuddur.
          </span>
        </div>
      )}
    </aside>
  );
};
