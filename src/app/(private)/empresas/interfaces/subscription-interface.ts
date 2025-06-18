export interface CurrentCycle {
  id: string;
  start_at: string;
  end_at: string;
  billing_at: string;
  status: string;
  cycle: number;
}

export interface MobilePhone {
  country_code: string;
  area_code: string;
  number: string;
}

export interface Phones {
  mobile_phone: MobilePhone;
}

export interface CustomerMetadata {
  company: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string;
  document_type: string;
  type: string;
  delinquent: boolean;
  created_at: string;
  updated_at: string;
  phones: Phones;
  metadata: CustomerMetadata;
}

export interface PricingScheme {
  price: number;
  scheme_type: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  pricing_scheme: PricingScheme;
}

export interface SubscriptionDataResponse {
  id: string;
  start_at: string;
  interval: string;
  interval_count: number;
  billing_type: string;
  current_cycle: CurrentCycle;
  next_billing_at: string;
  payment_method: string;
  installments: number;
  status: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  items: SubscriptionItem[];
}
