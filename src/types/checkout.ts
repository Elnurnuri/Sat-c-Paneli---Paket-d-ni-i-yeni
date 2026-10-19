/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface FeatureItem {
  key: string;
  name: string;
  value: string | null;
  included: boolean;
  label: string;
}

export interface PackageDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  yearly_discount_percent: string;
  is_popular: boolean;
  duration_days: number;
  features_matrix: FeatureItem[];
}

export interface SwitchCredit {
  credit: number;
  from_package: string;
  remaining_days: number;
}

export interface DowngradeImpact {
  has_impact: boolean;
  impact: {
    product: {
      active: number;
      will_deactivate: number;
    };
    ilan: {
      active: number;
      will_deactivate: number;
    };
  };
}

export interface Coupon {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

export interface CalculationResult {
  basePrice: number;
  discountAmount: number;
  priceAfterCoupon: number;
  switchCreditApplied: number;
  refundToWallet: number;
  finalAmount: number;
  hasEnoughBalance: boolean;
  balanceShortage: number;
  monthlyEquivalent: number | null;
}

export type CheckoutMode = 'vendor' | 'corporate';

export interface CheckoutProps {
  /**
   * Slug of the package being purchased (e.g. "burunc-mehsul")
   */
  packageSlug?: string;
  /**
   * Initial selected billing period
   */
  initialPeriod?: SubscriptionPeriod;
  /**
   * Return link when clicking "Back to packages"
   */
  backUrl?: string;
  /**
   * Top-up balance link when balance is insufficient
   */
  walletTopupUrl?: string;
  /**
   * Success redirect link
   */
  successUrl?: string;
  /**
   * Login page redirect URL if session is unauthenticated
   */
  loginUrl?: string;
  /**
   * Corporate panel slug if accessed from /corporate/:slug/...
   */
  corporateSlug?: string;
  /**
   * Checkout mode: vendor vs corporate
   */
  mode?: CheckoutMode;
  /**
   * Callback on complete
   */
  onSubscriptionSuccess?: (info: { packageSlug: string; period: SubscriptionPeriod; newBalance: number }) => void;
}

export type ScenarioKey =
  | 'new_subscription'
  | 'switch_package'
  | 'with_coupon'
  | 'insufficient_balance'
  | 'downgrade_impact'
  | 'credit_exceeds_price'
  | 'package_not_found'
  | 'auth_unauthorized';
