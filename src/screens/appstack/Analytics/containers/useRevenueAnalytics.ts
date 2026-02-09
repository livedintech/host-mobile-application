// export const useRevenueAnalytics = () => {
//   return {
//     summary: [
//       { label: 'Revenue', value: 'SAR 25,000', change: '+10%' },
//     ],
//     chart: [{ value: 80, color: 'green' }],
//     total: 80,
//     listings: [],
//   };
// };



export const useRevenueAnalytics = () => ({
  summary: [
    { label: 'Rental Revenue', value: 'SAR 18,450', change: '+12%', duration: 'vs last month', icon: 'walletIcon', isUp: true },
    { label: 'Nights Booked', value: '42', change: '-5%', duration: 'vs last 30 days', icon: 'moonIcon', isUp: false },
    { label: 'Occupancy', value: '68%', change: '+8%', duration: 'vs last 30 days', icon: 'occupancyIcon', isUp: true },
    { label: 'Average Daily Rate', value: 'SAR 590', change: '+6%', duration: 'vs last 30 days', icon: 'dollarIcon', isUp: true },
    { label: 'Avg Stay Revenue', value: 'SAR 2,950', change: '+4%', duration: 'vs last 30 days', icon: 'dollarBagIcon', isUp: true },
    { label: 'Avg Length of Stay', value: '4.2 Nights', change: '-0%', duration: 'vs last 30 days', icon: 'circleClockIcon', isUp: false },
  ],
  chart: [
    { value: 60, color: '#ED0509', label: 'Airbnb', percentage: '60%', count: '18' },
    { value: 30, color: '#8C05ED', label: 'Gathem', percentage: '30%', count: '09' },
    { value: 10, color: '#0D4036', label: 'Direct', percentage: '10%', count: '03' },
  ],
  total: 30,
  listings: [
    {
      name: 'Al Riyadh Apartments',
      revenue: 'SAR 18,200',
      occupancy: '82%',
      adr: 'SAR 450',
      status: 'Top Performer',
      statusColor: '#E8F5F1',
      statusTextColor: '#1FA67A',
      trend: '15%',
      isUp: true,
      insight: 'High occupancy is driving strong revenue. Consider slight rate increases to maximize returns during peak demand.',
    },
    {
      name: 'Al Jeddah Apartments',
      revenue: 'SAR 18,200',
      occupancy: '82%',
      adr: 'SAR 450',
      status: 'Average',
      statusColor: '#FFF9C4',
      statusTextColor: '#FBC02D',
      trend: '0%',
      isUp: true,
      insight: 'At 65% occupancy and an ADR of SAR 380, revenue growth is constrained.',
    },
    {
      name: 'Burj ul Aman',
      revenue: 'SAR 18,200',
      occupancy: '82%',
      adr: 'SAR 450',
      status: 'Needs Attention',
      statusColor: '#FDEEEE',
      statusTextColor: '#E53935',
      trend: '-18%',
      isUp: false,
      insight: 'At 65% occupancy and an ADR of SAR 380, revenue growth is constrained.',
    }
  ],
});