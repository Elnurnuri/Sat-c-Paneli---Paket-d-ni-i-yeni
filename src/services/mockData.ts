/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Coupon, DowngradeImpact, PackageDetail, ScenarioKey, SubscriptionPeriod, SwitchCredit } from '../types/checkout.ts';

export const bronzePackage: PackageDetail = {
  id: 1,
  name: 'Bürünc Məhsul',
  slug: 'burunc-mehsul',
  description: 'Böyüyən biznes üçün nəzərdə tutulmuş hərtərəfli satış alətləri',
  monthly_price: '199.99',
  yearly_price: '1999.00',
  yearly_discount_percent: '16.7',
  is_popular: true,
  duration_days: 30,
  features_matrix: [
    { key: 'inventory', name: '50 Fiziki inventar', value: '50 məhsul', included: true, label: '50 ədəd' },
    { key: 'commission', name: '%15 komissiya', value: '15%', included: true, label: '%15 dərəcə' },
    { key: 'ads', name: '3 Reklam haqqı', value: '3 ədəd', included: true, label: '3 reklam / ay' },
    { key: 'featured', name: '5 Önə çıxan məhsul', value: '5 məhsul', included: true, label: 'Aktiv vitrin' },
    { key: 'analytics', name: 'Genişləndirilmiş analitika', value: null, included: true, label: 'Satış statistikası' },
    { key: 'bulk_upload', name: 'Toplu yükləmə', value: null, included: true, label: 'Excel / CSV idxalı' },
    { key: 'ai_messages', name: 'AI dost: gündə 20 mesaj', value: '20 mesaj', included: true, label: 'Gündəlik limit' },
    { key: 'ai_memory', name: 'AI dostun yaddaşı', value: null, included: true, label: 'Mağaza konteksti' },
    { key: 'ai_voice', name: 'AI dostun səsi', value: null, included: true, label: 'Səsli əmrlər' },
    { key: 'priority_listing', name: 'Prioritet siyahı', value: null, included: false, label: 'Yalnız Qızıl paketdə' },
    { key: 'marketing_module', name: 'Marketinq modulu', value: null, included: false, label: 'Yalnız Qızıl paketdə' },
  ],
};

export const silverPackage: PackageDetail = {
  id: 2,
  name: 'Gümüş Məhsul',
  slug: 'gumus-mehsul',
  description: 'Geniş miqyaslı mağazalar və artan satış dövriyyəsi üçün',
  monthly_price: '349.99',
  yearly_price: '3499.00',
  yearly_discount_percent: '16.7',
  is_popular: false,
  duration_days: 30,
  features_matrix: [
    { key: 'inventory', name: '150 Fiziki inventar', value: '150 məhsul', included: true, label: '150 ədəd' },
    { key: 'commission', name: '%12 komissiya', value: '12%', included: true, label: '%12 dərəcə' },
    { key: 'ads', name: '8 Reklam haqqı', value: '8 ədəd', included: true, label: '8 reklam / ay' },
    { key: 'featured', name: '15 Önə çıxan məhsul', value: '15 məhsul', included: true, label: 'Geniş vitrin' },
    { key: 'analytics', name: 'Dərin analitika və hesabatlar', value: null, included: true, label: 'Hərtərəfli' },
    { key: 'bulk_upload', name: 'Toplu yükləmə və API inteqrasiyası', value: null, included: true, label: 'API dəstəyi' },
    { key: 'ai_messages', name: 'AI dost: gündə 60 mesaj', value: '60 mesaj', included: true, label: 'Gündəlik limit' },
    { key: 'ai_memory', name: 'AI dostun yaddaşı', value: null, included: true, label: 'Geniş yaddaş' },
    { key: 'ai_voice', name: 'AI dostun səsi', value: null, included: true, label: 'Səsli əmrlər' },
    { key: 'priority_listing', name: 'Prioritet siyahı', value: null, included: true, label: 'Axtarışda üstünlük' },
    { key: 'marketing_module', name: 'Marketinq modulu', value: null, included: false, label: 'Yalnız Qızıl paketdə' },
  ],
};

export interface ScenarioDefinition {
  key: ScenarioKey;
  label: string;
  description: string;
  isAuthorized: boolean;
  packageFound: boolean;
  packageData: PackageDetail;
  walletBalance: number;
  initialPeriod: SubscriptionPeriod;
  initialCoupon: Coupon | null;
  switchCredit: SwitchCredit | null;
  downgradeImpact: DowngradeImpact;
}

export const mockScenarios: Record<ScenarioKey, ScenarioDefinition> = {
  new_subscription: {
    key: 'new_subscription',
    label: 'a) Yeni abunə',
    description: 'Balans 2.450,00 ₼, kupon yoxdur, İllik seçim',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 2450.0,
    initialPeriod: 'yearly',
    initialCoupon: null,
    switchCredit: null,
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 30, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  switch_package: {
    key: 'switch_package',
    label: 'b) Paket dəyişmə',
    description: 'Köhnə «Gümüş Məhsul» paketinin qalan 12 günü → 47,60 ₼ endirim',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 2450.0,
    initialPeriod: 'yearly',
    initialCoupon: null,
    switchCredit: {
      credit: 47.6,
      from_package: 'Gümüş Məhsul',
      remaining_days: 12,
    },
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 40, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  with_coupon: {
    key: 'with_coupon',
    label: 'c) Kupon tətbiq olunub',
    description: '«PANSHOP10» kuponu ilə %10 endirim aktivdir',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 2450.0,
    initialPeriod: 'yearly',
    initialCoupon: {
      code: 'PANSHOP10',
      discount_type: 'percentage',
      discount_value: 10,
    },
    switchCredit: null,
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 20, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  insufficient_balance: {
    key: 'insufficient_balance',
    label: 'd) Balans çatmır',
    description: 'Balans cəmi 85,40 ₼ təşkil edir (ödəniş bloklanır)',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 85.4,
    initialPeriod: 'monthly',
    initialCoupon: null,
    switchCredit: null,
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 10, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  downgrade_impact: {
    key: 'downgrade_impact',
    label: 'e) Aşağı paketə keçid (Downgrade)',
    description: '64 aktiv məhsuldan 14-ü satışdan çıxarılacaq (təsdiq tələb olunur)',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 2450.0,
    initialPeriod: 'yearly',
    initialCoupon: null,
    switchCredit: {
      credit: 65.0,
      from_package: 'Gümüş Məhsul',
      remaining_days: 15,
    },
    downgradeImpact: {
      has_impact: true,
      impact: {
        product: { active: 64, will_deactivate: 14 },
        ilan: { active: 2, will_deactivate: 0 },
      },
    },
  },
  credit_exceeds_price: {
    key: 'credit_exceeds_price',
    label: 'Kredit > Qiymət (Artıq məbləğ)',
    description: 'Köhnə paketdən 250 ₼ kredit, aylıq 199,99 ₼ → Qalan 50,01 ₼ balansa',
    isAuthorized: true,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 320.0,
    initialPeriod: 'monthly',
    initialCoupon: null,
    switchCredit: {
      credit: 250.0,
      from_package: 'Qızıl Məhsul',
      remaining_days: 22,
    },
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 25, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  package_not_found: {
    key: 'package_not_found',
    label: 'f) Paket tapılmadı (404)',
    description: 'Mövcud olmayan və ya silinmiş paket səhifəsi',
    isAuthorized: true,
    packageFound: false,
    packageData: bronzePackage,
    walletBalance: 2450.0,
    initialPeriod: 'monthly',
    initialCoupon: null,
    switchCredit: null,
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 0, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
  auth_unauthorized: {
    key: 'auth_unauthorized',
    label: 'g) Giriş edilməyib (401)',
    description: 'İstifadəçi daxil olmayıb, /login səhifəsinə yönləndirmə',
    isAuthorized: false,
    packageFound: true,
    packageData: bronzePackage,
    walletBalance: 0,
    initialPeriod: 'monthly',
    initialCoupon: null,
    switchCredit: null,
    downgradeImpact: {
      has_impact: false,
      impact: {
        product: { active: 0, will_deactivate: 0 },
        ilan: { active: 0, will_deactivate: 0 },
      },
    },
  },
};

export const validCouponsList: Record<string, Coupon> = {
  PANSHOP10: {
    code: 'PANSHOP10',
    discount_type: 'percentage',
    discount_value: 10,
  },
  PANSHOP20: {
    code: 'PANSHOP20',
    discount_type: 'percentage',
    discount_value: 20,
  },
  BAKU50: {
    code: 'BAKU50',
    discount_type: 'fixed',
    discount_value: 50,
  },
  YENIIL100: {
    code: 'YENIIL100',
    discount_type: 'fixed',
    discount_value: 100,
  },
};
