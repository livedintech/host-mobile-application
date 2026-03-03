export interface getSubscriptionSaveCardsPayloadType {
    customer_identifier:number
}

export interface savePaymentinfoPayloadType {
  host_id: string;
  amount: number;
  token: string;
  card_type: string;
  customer_identifier: string;
  is_active: boolean;
}