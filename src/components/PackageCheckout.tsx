/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  CheckoutProps,
  Coupon,
  DowngradeImpact,
  PackageDetail,
  ScenarioKey,
  SubscriptionPeriod,
  SwitchCredit,
} from '../types/checkout.ts';
import { CheckoutApiService } from '../services/checkoutApi.ts';
import { calculateCheckout, formatAZN } from '../utils/pricing.ts';
import { az } from '../i18n/az.ts';

import { CheckoutHeader } from './CheckoutHeader.tsx';
import { PeriodToggle } from './PeriodToggle.tsx';
import { PackageCard } from './PackageCard.tsx';
import { PaymentMethod } from './PaymentMethod.tsx';
import { CouponBox } from './CouponBox.tsx';
import { OrderSummary } from './OrderSummary.tsx';
import { MobileStickyBar } from './MobileStickyBar.tsx';
import { SkeletonCheckout } from './SkeletonCheckout.tsx';
import { ErrorState } from './ErrorState.tsx';
import { SuccessView } from './SuccessView.tsx';
import { SuccessModal } from './SuccessModal.tsx';

interface PackageCheckoutInternalProps extends CheckoutProps {
  currentScenario?: ScenarioKey;
}

export const PackageCheckout: React.FC<PackageCheckoutInternalProps> = ({
  packageSlug = 'burunc-mehsul',
  initialPeriod = 'yearly',
  backUrl = '/vendor/packages',
  walletTopupUrl = '/vendor/wallet',
  successUrl = '/vendor/subscriptions',
  loginUrl = '/login',
  currentScenario = 'new_subscription',
  onSubscriptionSuccess,
}) => {
  // Sync initial period from URL if available (?period=monthly|yearly)
  const getUrlPeriod = (): SubscriptionPeriod => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('period');
      if (p === 'monthly' || p === 'yearly') return p;
    }
    return initialPeriod;
  };

  const [period, setPeriod] = useState<SubscriptionPeriod>(getUrlPeriod());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [switchCredit, setSwitchCredit] = useState<SwitchCredit | null>(null);
  const [downgradeImpact, setDowngradeImpact] = useState<DowngradeImpact>({
    has_impact: false,
    impact: { product: { active: 0, will_deactivate: 0 }, ilan: { active: 0, will_deactivate: 0 } },
  });
  const [isDowngradeConfirmed, setIsDowngradeConfirmed] = useState(false);

  // Coupon state
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [transactionId, setTransactionId] = useState<string>('SUB-89410-AZ');
  const [successInfo, setSuccessInfo] = useState<{
    newBalance: number;
    nextBillingDate: string;
  } | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Instantiate api service
  const api = useMemo(() => new CheckoutApiService(currentScenario), [currentScenario]);

  // Update URL search query on period toggle without refresh
  const handlePeriodChange = (newPeriod: SubscriptionPeriod) => {
    setPeriod(newPeriod);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('period', newPeriod);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Main data loader function
  const loadCheckoutData = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    setGeneralError(null);
    setIsCompleted(false);
    setIsSuccessModalOpen(false);
    setIsDowngradeConfirmed(false);
    setCouponError(null);

    try {
      // 1) GET /packages/check-auth/
      const auth = await api.checkAuth();
      if (!auth.ok) {
        setAuthError(az.errors.authMessage);
        setIsLoading(false);
        // Simulate automatic redirect after 2 seconds
        setTimeout(() => {
          // If in standalone mode, just notify or simulate redirect
          console.log(`Redirecting to ${loginUrl}...`);
        }, 2000);
        return;
      }

      // 2) GET /packages/api/detail/slug/<slug>/
      const pkg = await api.getPackageDetail(packageSlug);
      setPackageData(pkg);

      // 3) GET /api/vendor/dashboard/ -> wallet balance
      const balance = await api.getVendorWalletBalance();
      setWalletBalance(balance);

      // 4) GET /packages/api/switch-credit/<slug>/
      try {
        const creditData = await api.getSwitchCredit(packageSlug);
        setSwitchCredit(creditData);
      } catch (err) {
        // If error occurs, row is hidden and does not block checkout
        setSwitchCredit(null);
      }

      // 5) GET /packages/api/downgrade-impact/<slug>/
      try {
        const impactData = await api.getDowngradeImpact(packageSlug);
        setDowngradeImpact(impactData);
      } catch {
        setDowngradeImpact({
          has_impact: false,
          impact: { product: { active: 0, will_deactivate: 0 }, ilan: { active: 0, will_deactivate: 0 } },
        });
      }

      // Set initial coupon from scenario if exists
      const scen = api.getCurrentScenario();
      if (scen === 'with_coupon') {
        setCoupon({
          code: 'PANSHOP10',
          discount_type: 'percentage',
          discount_value: 10,
        });
      } else {
        setCoupon(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setGeneralError(error.message || 'Məlumatları yükləyərkən xəta baş verdi.');
    } finally {
      setIsLoading(false);
    }
  }, [api, packageSlug, loginUrl]);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  // Pure price calculation
  const calculation = useMemo(() => {
    if (!packageData) {
      return {
        basePrice: 0,
        discountAmount: 0,
        priceAfterCoupon: 0,
        switchCreditApplied: 0,
        refundToWallet: 0,
        finalAmount: 0,
        hasEnoughBalance: false,
        balanceShortage: 0,
        monthlyEquivalent: null,
      };
    }

    return calculateCheckout(packageData, period, walletBalance, coupon, switchCredit);
  }, [packageData, period, walletBalance, coupon, switchCredit]);

  // Handle coupon validation
  const handleApplyCoupon = async (code: string): Promise<boolean> => {
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const validCoupon = await api.validateCoupon(code, packageSlug);
      setCoupon(validCoupon);
      setToast({
        text: az.coupon.appliedSuccess(validCoupon.code, validCoupon.discount_type === 'percentage' ? `%${validCoupon.discount_value}` : formatAZN(validCoupon.discount_value)),
        type: 'success',
      });
      setTimeout(() => setToast(null), 3500);
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      setCouponError(error.message || az.coupon.invalidError);
      return false;
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  // Handle final subscription payment
  const handleCompletePayment = async () => {
    if (!packageData || isSubmitting) return;

    if (!calculation.hasEnoughBalance) {
      setToast({
        text: 'Cüzdanınızda kifayət qədər vəsait yoxdur. Zəhmət olmasa balansı artırın.',
        type: 'error',
      });
      return;
    }

    if (downgradeImpact.has_impact && !isDowngradeConfirmed) {
      setToast({
        text: 'Davam etmək üçün məhsulların bağlanması barədə xəbərdarlığı təsdiqləyin.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const amountToCharge = calculation.finalAmount;
      const res = await api.subscribe(
        {
          package_slug: packageData.slug,
          payment_period: period,
          auto_renew: true,
          payment_method: 'wallet',
          coupon_code: coupon ? coupon.code : null,
        },
        amountToCharge
      );

      // Toast notification
      setToast({
        text: `${res.message} Yeni balans: ${formatAZN(res.new_balance)}`,
        type: 'success',
      });

      // Update state
      setPaidAmount(amountToCharge);
      setTransactionId(res.subscription_id);
      setWalletBalance(res.new_balance);
      setSuccessInfo({
        newBalance: res.new_balance,
        nextBillingDate: res.next_billing_date,
      });
      setIsCompleted(true);
      setIsSuccessModalOpen(true);

      if (onSubscriptionSuccess) {
        onSubscriptionSuccess({
          packageSlug: packageData.slug,
          period,
          newBalance: res.new_balance,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setToast({
        text: error.message || 'Ödəniş həyata keçirilərkən server xətası baş verdi.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <main className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SkeletonCheckout />
      </main>
    );
  }

  // 2. Auth Error State (401)
  if (authError) {
    return (
      <main className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorState
          type="auth"
          message={authError}
          loginUrl={loginUrl}
          backUrl={backUrl}
        />
      </main>
    );
  }

  // 3. Not Found or General Error State
  if (generalError || !packageData) {
    return (
      <main className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorState
          type="not_found"
          message={generalError || undefined}
          backUrl={backUrl}
          onRetry={loadCheckoutData}
        />
      </main>
    );
  }

  // 4. Completed Success State
  if (isCompleted && successInfo) {
    return (
      <main className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SuccessView
          packageName={packageData.name}
          period={period}
          newBalance={successInfo.newBalance}
          nextBillingDate={successInfo.nextBillingDate}
          successUrl={successUrl}
          onReset={loadCheckoutData}
          onOpenModal={() => setIsSuccessModalOpen(true)}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          packageData={packageData}
          period={period}
          totalPaid={paidAmount}
          newBalance={successInfo.newBalance}
          nextBillingDate={successInfo.nextBillingDate}
          transactionId={transactionId}
          successUrl={successUrl}
          onClose={() => setIsSuccessModalOpen(false)}
          onBackToSubscriptions={() => {
            if (typeof window !== 'undefined') {
              window.location.href = successUrl;
            }
          }}
        />
      </main>
    );
  }

  // 5. Main Checkout Form
  return (
    <main className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-32 sm:pb-36 lg:pb-8">
      {/* Toast Alert Banner */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium animate-in fade-in transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs underline hover:no-underline cursor-pointer"
          >
            Bağla
          </button>
        </div>
      )}

      {/* Header */}
      <CheckoutHeader
        backUrl={backUrl}
      />

      {/* Two-Column Grid: 2/3 (Left) + 1/3 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left main content column (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Period Selection Toggle */}
          <PeriodToggle
            period={period}
            onChange={handlePeriodChange}
            yearlyDiscountPercent={packageData.yearly_discount_percent}
            yearlyPrice={Number(packageData.yearly_price)}
          />

          {/* Package Details & Feature Matrix Card */}
          <PackageCard packageData={packageData} />

          {/* Payment Method Card (Wallet / Card disabled) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
            <PaymentMethod
              walletBalance={walletBalance}
              hasEnoughBalance={calculation.hasEnoughBalance}
              walletTopupUrl={walletTopupUrl}
            />

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Coupon Box */}
            <CouponBox
              coupon={coupon}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              isValidating={isValidatingCoupon}
              errorMessage={couponError}
            />
          </div>
        </div>

        {/* Right column: Sticky Order Summary (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
          <OrderSummary
            packageData={packageData}
            period={period}
            calculation={calculation}
            coupon={coupon}
            switchCredit={switchCredit}
            downgradeImpact={downgradeImpact}
            isDowngradeConfirmed={isDowngradeConfirmed}
            onToggleDowngradeConfirm={setIsDowngradeConfirmed}
            isSubmitting={isSubmitting}
            onCompletePayment={handleCompletePayment}
          />
        </div>
      </div>

      {/* Mobile Sticky Payment Bar */}
      <MobileStickyBar
        finalAmount={calculation.finalAmount}
        hasEnoughBalance={calculation.hasEnoughBalance}
        isDowngradeBlocked={downgradeImpact.has_impact && !isDowngradeConfirmed}
        isSubmitting={isSubmitting}
        onCompletePayment={handleCompletePayment}
      />
    </main>
  );
};
