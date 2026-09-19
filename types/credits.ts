export type CreditBalance = {
  plan: string;
  credits_total: number;
  credits_remaining: number;
  credits_used: number;
};

export type CreditTransaction = {
  id: string;
  action: string;
  credits: number;
  balance_after: number;
  created_at: string;
};

export type Subscription = {
  plan: string;
  status: string;
  credits_total: number;
  credits_remaining: number;
};
