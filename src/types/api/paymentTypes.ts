export interface getSubscriptionSaveCardsPayloadType {
    customer_identifier:number
}

export interface savePaymentinfoPayloadType {
  phone_number: string;
  amount: number;
  token: string;
  card_type: string;
  is_active: boolean;
}