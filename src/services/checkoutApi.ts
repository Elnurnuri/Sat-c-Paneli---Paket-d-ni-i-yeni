/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Coupon, DowngradeImpact, PackageDetail, ScenarioKey, SubscriptionPeriod, SwitchCredit } from '../types/checkout.ts';
import { mockScenarios, validCouponsList } from './mockData.ts';

export interface SubscribePayload {
  package_slug: string;
  payment_period: SubscriptionPeriod;
  auto_renew: boolean;
  payment_method: 'wallet';
  coupon_code?: string | null;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  new_balance: number;
  subscription_id: string;
  next_billing_date: string;
}

/**
 * Service simulating the real backend API endpoints:
 * 1) GET /packages/check-auth/
 * 2) GET /packages/api/detail/slug/<slug>/
 * 3) GET /api/vendor/dashboard/
 * 4) GET /packages/api/switch-credit/<slug>/
 * 5) GET /packages/api/downgrade-impact/<slug>/
 * 6) POST /packages/coupons/validate/
 * 7) POST /packages/subscriptions/subscribe/
 */
export class CheckoutApiService {
  private scenarioKey: ScenarioKey = 'new_subscription';
  private dynamicWalletBalance: number = 2450.0;

  constructor(initialScenario: ScenarioKey = 'new_subscription') {
    this.setScenario(initialScenario);
  }

  setScenario(key: ScenarioKey) {
    this.scenarioKey = key;
    const scen = mockScenarios[key];
    if (scen) {
      this.dynamicWalletBalance = scen.walletBalance;
    }
  }

  getCurrentScenario(): ScenarioKey {
    return this.scenarioKey;
  }

  async checkAuth(): Promise<{ ok: boolean; status: number }> {
    await new Promise((r) => setTimeout(r, 120));
    const scen = mockScenarios[this.scenarioKey];
    if (!scen.isAuthorized) {
      return { ok: false, status: 401 };
    }
    return { ok: true, status: 200 };
  }

  async getPackageDetail(slug: string): Promise<PackageDetail> {
    await new Promise((r) => setTimeout(r, 200));
    const scen = mockScenarios[this.scenarioKey];
    if (!scen.packageFound) {
      throw new Error(`Paket tapılmadı: ${slug} (404)`);
    }
    return { ...scen.packageData, slug };
  }

  async getVendorWalletBalance(): Promise<number> {
    await new Promise((r) => setTimeout(r, 100));
    return this.dynamicWalletBalance;
  }

  async getSwitchCredit(slug: string): Promise<SwitchCredit | null> {
    await new Promise((r) => setTimeout(r, 150));
    const scen = mockScenarios[this.scenarioKey];
    // If error occurs in real API, row is hidden and does not block checkout
    return scen.switchCredit ? { ...scen.switchCredit } : null;
  }

  async getDowngradeImpact(slug: string): Promise<DowngradeImpact> {
    await new Promise((r) => setTimeout(r, 150));
    const scen = mockScenarios[this.scenarioKey];
    return { ...scen.downgradeImpact };
  }

  async validateCoupon(code: string, packageSlug: string): Promise<Coupon> {
    await new Promise((r) => setTimeout(r, 350));
    const cleaned = code.trim().toUpperCase();
    const found = validCouponsList[cleaned];
    if (!found) {
      throw new Error('Kupon kodu tapılmadı və ya etibarsızlıq müddəti bitib.');
    }
    return { ...found };
  }

  async subscribe(payload: SubscribePayload, finalAmount: number): Promise<SubscribeResponse> {
    await new Promise((r) => setTimeout(r, 600));

    if (this.dynamicWalletBalance < finalAmount) {
      throw new Error('Cüzdanınızda kifayət qədər vəsait yoxdur. Zəhmət olmasa balansı artırın.');
    }

    this.dynamicWalletBalance = Math.max(0, this.dynamicWalletBalance - finalAmount);

    return {
      success: true,
      message: 'Abunəlik başladı.',
      new_balance: this.dynamicWalletBalance,
      subscription_id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      next_billing_date: payload.payment_period === 'yearly' ? '19.10.2027' : '19.11.2026',
    };
  }
}
