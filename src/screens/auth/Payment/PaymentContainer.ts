import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import { subscriptionCalculateApi, contactEligibilityApi } from '@/services/paymentService';
import { getUser } from '@/services/UserPermission';
import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types/api/authTypes';
import { storage } from '@/storage/mmkv';
import i18n, { saveLanguage } from '@/locales/i18n/i18n';
import { logoutApi } from '@/services/authApi';
import { NotificationService } from '@/services/notification.service';
import { queryClient } from '@/services/api';
import { reset } from '@/services/navigationService';


export type PlanType = 'Starter' | 'AI Suite';
export type BillingCycle = 'Monthly' | 'Yearly';

export default function usePaymentContainer() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { user, logout, setUser, isLoggedIn } = useAuthStore();

  const { data: freshUser } = useQuery<User>({
    queryKey: [STORAGE_CONST.GET_USER],
    queryFn: getUser,
    enabled: true,
  });

  useEffect(() => {
    if (freshUser && isLoggedIn) {
      setUser(freshUser);
    }
  }, [freshUser, isLoggedIn]);
  const routeFullName: string = route.params?.full_name ?? user?.name ?? '';
  const routeEmail: string = route.params?.email ?? user?.email ?? '';
  const routeCountryCode: string = route.params?.country_code ?? user?.country_code ?? '';
  const routePhoneNumber: string = String(route.params?.phone_number ?? user?.phone ?? '');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('Starter');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
      const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  

  // const handleLogout = useCallback(() => {
  //   const currentLang = i18n.language || 'ar';
  //   const rememberMeData = storage.getString('remember-me-storage');
  //   storage.clearAll();
  //   saveLanguage(currentLang);
  //   if (rememberMeData) storage.set('remember-me-storage', rememberMeData);
  //   logout();
  // }, [logout]);
  //  const handleLogout = () => {
  // setLogoutModalVisible(false);
  //   const currentLang = i18n.language || 'ar';
  //   const rememberMeData = storage.getString('remember-me-storage');
  //   storage.clearAll();
  //   saveLanguage(currentLang);
  //   if (rememberMeData) storage.set('remember-me-storage', rememberMeData);
  //   logout();
  // };

  const ELIGIBLE_PLAN_ID = 'df0c79c6-e11e-4215-97b1-249011095c8f';

  useEffect(() => {
    const email = routeEmail || user?.email || '';
    console.log('[EligibilityCheck] email:', email);
    if (!email) {
      setIsCheckingEligibility(false);
      return;
    }
    contactEligibilityApi(email)
      .then((result) => {
        console.log('[EligibilityCheck] result:', JSON.stringify(result));
        if (result?.data?.eligible) {
          navigate(NavigationRoutes.APP_STACK.SUBSCRIPTION_WEBVIEW, {
            planId: ELIGIBLE_PLAN_ID,
            qtyFrom: 1,
            full_name: routeFullName,
            email: routeEmail,
            country_code: routeCountryCode,
            phone_number: routePhoneNumber,
          });
        } else {
          setIsCheckingEligibility(false);
        }
      })
      .catch((err) => {
        console.log('[EligibilityCheck] error:', JSON.stringify(err));
        setIsCheckingEligibility(false);
      });
  }, []);

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
      full_name: routeFullName,
      email: routeEmail,
      country_code: routeCountryCode,
      phone_number: routePhoneNumber,
    });
  }, [planId, qtyFrom, routeFullName, routeEmail, routeCountryCode, routePhoneNumber]);

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

    const toggleModal = () => setLogoutModalVisible(!isLogoutModalVisible);

  const performLocalLogout = useCallback(() => {
    setLogoutModalVisible(false);
    const currentLang = i18n.language || 'ar';
    const rememberMeData = storage.getString('remember-me-storage');
    logout();
    storage.clearAll();
    saveLanguage(currentLang);
    if (rememberMeData) storage.set('remember-me-storage', rememberMeData);
    queryClient.clear();
    // Explicit reset handles two cases:
    // 1. AppStack.PAYMENT (isLoggedIn was true): StackNavigator switches to AuthStack,
    //    then reset ensures login screen shows instead of any stale state.
    // 2. AuthStack.PAYMENT (isLoggedIn was already false, signup_step='step_1'):
    //    logout() is a no-op for isLoggedIn so StackNavigator doesn't switch —
    //    reset explicitly navigates within AuthStack to login screen.
    setTimeout(() => reset(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE), 0);
  }, [logout]);

  const { mutate: handleLogout, isPending: isLogoutLoading } = useMutation({
    mutationFn: async () => {
      const fcm_token = await NotificationService.getToken().catch(() => '');
      return logoutApi({ user_id: user?.id ?? '', fcm_token });
    },
    onSuccess: () => {
      performLocalLogout();
    },
    onError: () => {
      performLocalLogout();
    },
  });

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
    routeFullName,
    routeEmail,
    routeCountryCode,
    routePhoneNumber,
    isCheckingEligibility,
    handleStartTrial,
    handleLogout,
    isLogoutLoading,
    isLogoutModalVisible,
    toggleModal,
    logout
  };
}
