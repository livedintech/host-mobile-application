export interface getSubscriptionSaveCardsPayloadType {
    customer_identifier:string | null | undefined
}

export interface savePaymentinfoPayloadType {
  phone_number?: string;
  amount?: number;
  token?: string;
  card_type?: string;
  is_active?: boolean;
  subscription_id?:number;
  auto_renew?:boolean
}