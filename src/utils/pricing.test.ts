/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCheckout, formatAZN, calculateNextBillingDate } from './pricing.ts';
import type { PackageDetail } from '../types/checkout.ts';

const mockPackage: PackageDetail = {
  id: 1,
  name: 'Bürünc Məhsul',
  slug: 'burunc-mehsul',
  description: 'Böyüyən biznes üçün',
  monthly_price: '199.99',
  yearly_price: '1999.00',
  yearly_discount_percent: '16.7',
  is_popular: true,
  duration_days: 30,
  features_matrix: [
    { key: 'inventory', name: '50 Fiziki inventar', value: '50', included: true, label: '50 məhsul' },
    { key: 'commission', name: '%15 komissiya', value: '15%', included: true, label: '%15' },
  ],
};

test('formatAZN formats standard amounts with Azerbaijani separators and currency symbol', () => {
  assert.equal(formatAZN(1999), '1.999,00 ₼');
  assert.equal(formatAZN(199.99), '199,99 ₼');
  assert.equal(formatAZN(47.6), '47,60 ₼');
  assert.equal(formatAZN(0), '0,00 ₼');
  assert.equal(formatAZN(2450.5), '2.450,50 ₼');
  assert.equal(formatAZN(-50), '−50,00 ₼');
});

test('calculateCheckout calculates base monthly and yearly prices correctly without discounts', () => {
  const monthlyCalc = calculateCheckout(mockPackage, 'monthly', 500);
  assert.equal(monthlyCalc.basePrice, 199.99);
  assert.equal(monthlyCalc.discountAmount, 0);
  assert.equal(monthlyCalc.finalAmount, 199.99);
  assert.equal(monthlyCalc.hasEnoughBalance, true);
  assert.equal(monthlyCalc.monthlyEquivalent, null);

  const yearlyCalc = calculateCheckout(mockPackage, 'yearly', 2500);
  assert.equal(yearlyCalc.basePrice, 1999.0);
  assert.equal(yearlyCalc.discountAmount, 0);
  assert.equal(yearlyCalc.finalAmount, 1999.0);
  assert.equal(yearlyCalc.hasEnoughBalance, true);
  assert.ok(yearlyCalc.monthlyEquivalent !== null);
  assert.equal(Math.round(yearlyCalc.monthlyEquivalent! * 100) / 100, 166.58);
});

test('calculateCheckout applies percentage coupons correctly', () => {
  const result = calculateCheckout(mockPackage, 'yearly', 2500, {
    code: 'PANSHOP10',
    discount_type: 'percentage',
    discount_value: 10,
  });

  assert.equal(result.basePrice, 1999.0);
  assert.equal(result.discountAmount, 199.9);
  assert.equal(result.priceAfterCoupon, 1799.1);
  assert.equal(result.finalAmount, 1799.1);
  assert.equal(result.hasEnoughBalance, true);
});

test('calculateCheckout applies fixed amount coupons correctly', () => {
  const result = calculateCheckout(mockPackage, 'monthly', 300, {
    code: 'BAKU50',
    discount_type: 'fixed',
    discount_value: 50,
  });

  assert.equal(result.basePrice, 199.99);
  assert.equal(result.discountAmount, 50);
  assert.equal(Math.round(result.finalAmount * 100) / 100, 149.99);
});

test('calculateCheckout deducts switch credit from previous package', () => {
  const result = calculateCheckout(
    mockPackage,
    'yearly',
    2500,
    null,
    { credit: 47.6, from_package: 'Gümüş Məhsul', remaining_days: 12 }
  );

  assert.equal(result.basePrice, 1999.0);
  assert.equal(result.switchCreditApplied, 47.6);
  assert.equal(result.finalAmount, 1951.4);
  assert.equal(result.refundToWallet, 0);
});

test('calculateCheckout refunds excess switch credit to wallet when credit > price', () => {
  const result = calculateCheckout(
    mockPackage,
    'monthly',
    50,
    null,
    { credit: 250.0, from_package: 'Qızıl Məhsul', remaining_days: 20 }
  );

  assert.equal(result.basePrice, 199.99);
  assert.equal(result.switchCreditApplied, 199.99);
  assert.equal(result.finalAmount, 0);
  assert.equal(Math.round(result.refundToWallet * 100) / 100, 50.01);
  assert.equal(result.hasEnoughBalance, true); // final amount is 0, so 50 >= 0
});

test('calculateCheckout correctly flags insufficient wallet balance', () => {
  const result = calculateCheckout(mockPackage, 'yearly', 85.4);
  assert.equal(result.hasEnoughBalance, false);
  assert.equal(Math.round(result.balanceShortage * 100) / 100, 1913.6);
});

test('calculateNextBillingDate returns valid date string', () => {
  const fixedDate = new Date('2026-05-01T10:00:00Z');
  const nextMonthly = calculateNextBillingDate('monthly', fixedDate);
  assert.equal(nextMonthly, '31.05.2026');

  const nextYearly = calculateNextBillingDate('yearly', fixedDate);
  assert.equal(nextYearly, '01.05.2027');
});
