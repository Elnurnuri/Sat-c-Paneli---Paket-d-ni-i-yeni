/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CalculationResult, Coupon, PackageDetail, SubscriptionPeriod, SwitchCredit } from '../types/checkout.ts';

/**
 * Formats a numeric amount to Azerbaijani AZN currency standard:
 * e.g. 1999.00 -> "1.999,00 ₼", 199.99 -> "199,99 ₼", 47.6 -> "47,60 ₼"
 */
export function formatAZN(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0,00 ₼';
  }

  // Round to 2 decimal places safely
  const rounded = Math.round(amount * 100) / 100;
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  const parts = absVal.toFixed(2).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Insert dots as thousands separator
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const sign = isNegative ? '−' : '';
  return `${sign}${formattedInteger},${decimalPart} ₼`;
}

/**
 * Pure calculation function for checkout math:
 * - base price based on period (monthly/yearly)
 * - coupon calculation (percentage or fixed)
 * - switch credit deduction from previous package
 * - refund to wallet if switch credit > price after coupon
 * - final amount and balance sufficiency check
 */
export function calculateCheckout(
  pkg: PackageDetail,
  period: SubscriptionPeriod,
  walletBalance: number,
  coupon: Coupon | null = null,
  switchCredit: SwitchCredit | null = null
): CalculationResult {
  const basePrice = period === 'yearly' ? Number(pkg.yearly_price) : Number(pkg.monthly_price);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discountAmount = (basePrice * coupon.discount_value) / 100;
    } else {
      discountAmount = Math.min(basePrice, coupon.discount_value);
    }
  }

  // Price after coupon discount
  const priceAfterCoupon = Math.max(0, basePrice - discountAmount);

  // Switch credit from old package
  const credit = switchCredit ? Math.max(0, switchCredit.credit) : 0;

  // Final amount to pay
  const finalAmount = Math.max(0, priceAfterCoupon - credit);

  // Switch credit applied towards the invoice
  const switchCreditApplied = Math.min(priceAfterCoupon, credit);

  // If credit exceeds the invoice price, the excess is credited back to wallet
  const refundToWallet = credit > priceAfterCoupon ? credit - priceAfterCoupon : 0;

  // Balance sufficiency check
  const hasEnoughBalance = walletBalance >= finalAmount;
  const balanceShortage = hasEnoughBalance ? 0 : Math.max(0, finalAmount - walletBalance);

  // Monthly equivalent for yearly billing
  const monthlyEquivalent = period === 'yearly' ? basePrice / 12 : null;

  return {
    basePrice,
    discountAmount,
    priceAfterCoupon,
    switchCreditApplied,
    refundToWallet,
    finalAmount,
    hasEnoughBalance,
    balanceShortage,
    monthlyEquivalent,
  };
}

/**
 * Computes next billing renewal date in Asia/Baku timezone.
 * Monthly: +30 days, Yearly: +365 days
 */
export function calculateNextBillingDate(period: SubscriptionPeriod, fromDate: Date = new Date()): string {
  const date = new Date(fromDate.getTime());
  if (period === 'monthly') {
    date.setDate(date.getDate() + 30);
  } else {
    date.setDate(date.getDate() + 365);
  }

  // Format in Asia/Baku locale
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();

  return `${d}.${m}.${y}`;
}
