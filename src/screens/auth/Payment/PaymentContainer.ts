import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { goBack } from '@/services/navigationService';
import { subscriptionCalculateApi } from '@/services/paymentService';
import STORAGE_CONST from '@/constants/storage';

export type PlanType = 'Starter' | 'AI Suite';
export type BillingCycle = 'Monthly' | 'Yearly';

export default function usePaymentContainer() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('Starter');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [isExpanded, setIsExpanded] = useState(false);

  const planKey = selectedPlan === 'Starter' ? 'starter' : 'ai_suite';
  const cycle = billingCycle === 'Monthly' ? 'monthly' : 'yearly';

  const { data: priceData, isLoading: isLoadingPrice } = useQuery({
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

  const starterFeatures = [
    {
      title: 'Channel & Sync',
      items: [
        'Airbnb integration (2-way sync)',
        'Booking.com integration (2-way sync)',
        'Gathern integration (KSA)',
        'Create & export property (Airbnb + Gathern)',
        'Reservation details view (all channels)',
      ],
    },
    {
      title: 'AI Features - Limited Access',
      items: [
        'AI Reply: 2 bookings/listing only',
        'AI Pricing: 1 property (multi-property hosts) or 1 month then discontinued (single-property hosts)',
      ],
    },
    {
      title: 'Inbox & Communication',
      items: [
        'Unified inbox (Airbnb + Booking.com)',
        'Saved replies / message templates',
        'Automated message triggers (event-based)',
        'Direct booking creation',
        'Multi-language: Arabic + English',
      ],
    },
    {
      title: 'Calendar',
      items: ['Calendar management (single + multi-calendar)'],
    },
    {
      title: 'Operations',
      items: [
        'Cleaning & task schedule automation',
        'Create maintenance & other tasks',
        'Smart lock integration — TT Lock (native)',
        'Automated lock code per booking & task',
      ],
    },
    {
      title: 'Analytics',
      items: [
        'Airbnb + Booking.com + Gatherin reviews',
        'Property performance analytics',
        'Revenue / booking analytics',
      ],
    },
    {
      title: 'Platform',
      items: [
        'Mobile app (iOS + Android)',
        'Separate staff / operator app',
        'User roles (Owner/Manager/Supervisor/Staff)',
        'Self-serve onboarding',
        'WhatsApp chat support',
      ],
    },
  ];

  const aiSuiteFeatures = [
    {
      title: 'AI Communication',
      items: [
        'AI Autopilot - True auto-send, no human review required',
        'Co-pilot / Draft Mode - Review messages before sending',
        'Policy Enforcement Engine - Auto-guard brand standards & rules',
        'Custom Tone & Brand Voice - Fully personalised AI responses',
        'Smart Escalation to Human - Auto-route complex guest queries',
      ],
    },
    {
      title: 'AI Revenue & Upsells',
      items: [
        'AI Dynamic Pricing - Unrestricted across all properties',
        'Gap Night Upsell Automation - Fill calendar gaps automatically',
        'Early Check-in / Late Checkout Upsell - Capture ancillary revenue',
      ],
    },
    {
      title: 'AI Operations',
      items: [
        'Maintenance Ticket from Guest Messages - Auto-create from reviews & messages',
        'Automated Review Requests - Trigger post-checkout review ask',
        '24/7 Scheduling & Shift Control - Customise AI availability windows',
      ],
    },
    {
      title: 'Onboarding & Future Feature',
      items: [
        'Dedicated Onboarding Support - White-glove setup assistance',
        'Guest Satisfaction / CSAT Tracking - coming soon',
        'API Access / Webhooks - coming soon',
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
    goBack,
  };
}
