import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import { subscriptionCalculateApi } from '@/services/paymentService';
import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';

export type PlanType = 'Starter' | 'AI Suite';
export type BillingCycle = 'Monthly' | 'Yearly';

export default function useSelectPlanContainer() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('Starter');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [isExpanded, setIsExpanded] = useState(false);

  const planKey = selectedPlan === 'Starter' ? 'starter' : 'ai_suite';
  const cycle = billingCycle === 'Monthly' ? 'monthly' : 'yearly';

  const { data: priceData, isLoading: isLoadingPrice, refetch } = useQuery({
    queryKey: [STORAGE_CONST.SUBSCRIPTION_CALCULATE, planKey, cycle],
    queryFn: () =>
      subscriptionCalculateApi({
        properties_count: 1,
        billing_cycle: cycle,
        plan_key: planKey,
      }),
  });

  const plan = priceData?.data?.plans?.[0];
  const currency = plan?.currency ?? 'SAR';
  const price = plan ? plan.price_per_property.toFixed(2) : '0.00';
  const planId = plan?.plan_id ?? '';
  const qtyFrom = plan?.matched_tier?.qty_from ?? 1;

  const handleStartTrial = useCallback(() => {
    navigate(NavigationRoutes.APP_STACK.SUBSCRIPTION_WEBVIEW, {
      planId,
      qtyFrom,
      full_name: user?.name ?? '',
      email: user?.email ?? '',
      country_code: user?.country_code ?? '',
      phone_number: user?.phone ?? '',
    });
  }, [planId, qtyFrom, user]);

  const starterFeatures = [
    {
      title: t('auth.payment.starter_features.channel_sync.title'),
      items: [
        t('auth.payment.starter_features.channel_sync.airbnb'),
        t('auth.payment.starter_features.channel_sync.booking'),
        t('auth.payment.starter_features.channel_sync.gathern'),
        t('auth.payment.starter_features.channel_sync.create_export'),
        t('auth.payment.starter_features.channel_sync.reservation_details'),
      ],
    },
    {
      title: t('auth.payment.starter_features.ai_limited.title'),
      items: [
        t('auth.payment.starter_features.ai_limited.ai_reply'),
        t('auth.payment.starter_features.ai_limited.ai_pricing'),
      ],
    },
    {
      title: t('auth.payment.starter_features.inbox.title'),
      items: [
        t('auth.payment.starter_features.inbox.unified_inbox'),
        t('auth.payment.starter_features.inbox.saved_replies'),
        t('auth.payment.starter_features.inbox.automated_triggers'),
        t('auth.payment.starter_features.inbox.direct_booking'),
        t('auth.payment.starter_features.inbox.multilang'),
      ],
    },
    {
      title: t('auth.payment.starter_features.calendar.title'),
      items: [t('auth.payment.starter_features.calendar.management')],
    },
    {
      title: t('auth.payment.starter_features.operations.title'),
      items: [
        t('auth.payment.starter_features.operations.cleaning'),
        t('auth.payment.starter_features.operations.maintenance'),
        t('auth.payment.starter_features.operations.smart_lock'),
        t('auth.payment.starter_features.operations.lock_code'),
      ],
    },
    {
      title: t('auth.payment.starter_features.analytics.title'),
      items: [
        t('auth.payment.starter_features.analytics.reviews'),
        t('auth.payment.starter_features.analytics.performance'),
        t('auth.payment.starter_features.analytics.revenue'),
      ],
    },
    {
      title: t('auth.payment.starter_features.platform.title'),
      items: [
        t('auth.payment.starter_features.platform.mobile_app'),
        t('auth.payment.starter_features.platform.staff_app'),
        t('auth.payment.starter_features.platform.user_roles'),
        t('auth.payment.starter_features.platform.onboarding'),
        t('auth.payment.starter_features.platform.whatsapp'),
      ],
    },
  ];

  const aiSuiteFeatures = [
    {
      title: t('auth.payment.ai_suite_features.communication.title'),
      items: [
        t('auth.payment.ai_suite_features.communication.autopilot'),
        t('auth.payment.ai_suite_features.communication.copilot'),
        t('auth.payment.ai_suite_features.communication.policy'),
        t('auth.payment.ai_suite_features.communication.tone'),
        t('auth.payment.ai_suite_features.communication.escalation'),
      ],
    },
    {
      title: t('auth.payment.ai_suite_features.revenue.title'),
      items: [
        t('auth.payment.ai_suite_features.revenue.dynamic_pricing'),
        t('auth.payment.ai_suite_features.revenue.gap_night'),
        t('auth.payment.ai_suite_features.revenue.checkin_upsell'),
      ],
    },
    {
      title: t('auth.payment.ai_suite_features.operations.title'),
      items: [
        t('auth.payment.ai_suite_features.operations.maintenance_ticket'),
        t('auth.payment.ai_suite_features.operations.review_requests'),
        t('auth.payment.ai_suite_features.operations.scheduling'),
      ],
    },
    {
      title: t('auth.payment.ai_suite_features.onboarding.title'),
      items: [
        t('auth.payment.ai_suite_features.onboarding.dedicated_support'),
        t('auth.payment.ai_suite_features.onboarding.csat'),
        t('auth.payment.ai_suite_features.onboarding.api_access'),
      ],
    },
  ];

  return {
    selectedPlan,
    setSelectedPlan,
    billingCycle,
    setBillingCycle,
    isExpanded,
    setIsExpanded,
    currency,
    price,
    isLoadingPrice,
    planId,
    qtyFrom,
    features: selectedPlan === 'Starter' ? starterFeatures : aiSuiteFeatures,
    refetch,
    handleStartTrial,
  };
}
