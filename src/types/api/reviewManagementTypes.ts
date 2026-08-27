export interface RateYourGuestPayload {
  review_id: number;
  respect_house_rules: number;
  communication: number;
  cleanliness: number;
  private_review: string;
  public_review: string;
  is_reviewee_recommended: boolean;
  issues: string[];
}
