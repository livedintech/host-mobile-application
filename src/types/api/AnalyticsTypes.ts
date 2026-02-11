export interface ListingOption {
  name: string;
  id: number;
}
export type KPIItem = {
  key: string;        
  label: string;
  value: string | number;
  delta_pct?: number;   
  change?: string;
  icon?: string;
};

export interface GetAnalyticSummaryParams {
  listing_ids?: string; // comma-separated
  channels?: string; // comma-separated
  start_date?: string;
  end_date?: string;
  range?: string;
}
export interface GetAnalyticPerformanceParams {
  listing_ids?: string; // comma-separated
  channels?: string; // comma-separated
  start_date?: string;
  end_date?: string;
  range?: string;
}

export type ListingPerformanceItem = {
  title: string;
  revenue: string | number;
  occupancy: string | number;
  adr: string | number;
  status: string;
  statusColor: string;
  statusTextColor: string;
  trend: string;
  isUp: boolean;
  insight?: string;
};
