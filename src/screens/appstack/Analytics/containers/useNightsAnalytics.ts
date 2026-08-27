import { useTranslation } from 'react-i18next';

const useNightsAnalytics = () => {
  const { t } = useTranslation();

  const data = {
    summary: [
      {
        label: t('app.analytics.occupancy'),
        value: '68%',
        change: '+8%',
        duration: 'vs last 30 days',
        icon: 'occupancyIcon',
        isUp: true,
      },
      {
        label: t('app.analytics.avg_daily_rate'),
        value: 'SAR 590',
        change: '+6%',
        duration: 'vs last 30 days',
        icon: 'dollarIcon',
        isUp: true,
      },
      {
        label: t('app.analytics.avg_stay_revenue'),
        value: 'SAR 2,950',
        change: '+4%',
        duration: 'vs last 30 days',
        icon: 'dollarBagIcon',
        isUp: true,
      },
      {
        label: t('app.analytics.avg_length_stay'),
        value: '4.2 Nights',
        change: '-0%',
        duration: 'vs last 30 days',
        icon: 'circleClockIcon',
        isUp: false,
      },
    ],

    chart: [
      { value: 60, color: '#ED0509', label: 'Airbnb', percentage: '60%', count: '18' },
      { value: 30, color: '#8C05ED', label: 'Gathern', percentage: '30%', count: '09' },
      { value: 10, color: '#0D4036', label: t('app.analytics.channel_direct'), percentage: '10%', count: '03' },
    ],

    total: 30,

    listings: [
      {
        name: 'Al Riyadh Apartments',
        revenue: 'SAR 18,200',
        occupancy: '82%',
        adr: 'SAR 450',
        status: 'Top Performer',
        statusColor: '#E7F7F2',
        statusTextColor: '#40B69C',
        trend: '15%',
        isUp: true,
        insight:
          'High occupancy is driving strong revenue. Consider slight rate increases to maximize returns during peak demand.',
      },
      {
        name: 'Al Jeddah Apartments',
        revenue: 'SAR 18,200',
        occupancy: '82%',
        adr: 'SAR 450',
        status: 'Average',
        statusColor: '#FFFCA3',
        statusTextColor: '#BFA10D',
        trend: '0%',
        isUp: true,
        insight:
          'At 65% occupancy and an ADR of SAR 380, revenue growth is constrained.',
      },
      {
        name: 'Burj ul Aman',
        revenue: 'SAR 18,200',
        occupancy: '82%',
        adr: 'SAR 450',
        status: 'Needs Attention',
        statusColor: '#F7E7E8',
        statusTextColor: '#F00C23',
        trend: '-18%',
        isUp: false,
        insight:
          'At 65% occupancy and an ADR of SAR 380, revenue growth is constrained.',
      },
    ],
  };

  return { data };

}

export default useNightsAnalytics