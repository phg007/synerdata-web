import {
  AddressFormData,
  CustomerFormData,
} from "../schemas/validation-schemas";
import { calculatePrice } from "../utils/checkout-utils";

interface SubscriptionResponseData {
  id: string;
  status: string;
  plan_id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface SubscriptionResponse {
  succeeded: boolean;
  data: SubscriptionResponseData | null;
  message: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}

interface Address {
  line_1: string;
  line_2: string | undefined;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface Phones {
  home_phone?: {
    country_code: string;
    area_code: string;
    number: string;
  };
  mobile_phone: {
    country_code: string;
    area_code: string;
    number: string;
  };
}

interface Customer {
  name: string;
  email: string;
  document_type: string;
  document: string;
  type: string;
  address: Address;
  phones: Phones;
  metadata: {
    company: string;
  };
}

interface Item {
  name: string;
  description: string;
  quantity: string;
  pricing_scheme: {
    scheme_type: string;
    price: number;
  };
}

export interface SubscriptionData {
  customer: Customer;
  items: Item[];
  card_token: string;
  credit_card: {
    card: {
      billing_address: Address;
    };
  };
}

export async function createSubscription(
  subscriptionData: SubscriptionData
): Promise<SubscriptionResponse> {
  try {
    const response = await fetch("http://localhost:3001/api/v1/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar assinatura");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
}

export function prepareSubscriptionData(
  plan: string,
  employeeCount: string,
  customerData: CustomerFormData,
  cardToken: string,
  billingAddress: AddressFormData
): SubscriptionData {
  const line_1 = `${billingAddress.number}, ${billingAddress.street}, ${billingAddress.neighborhood}`;
  const zipCode = billingAddress.zipCode.replace(/\D/g, "");
  const homePhoneNumbers =
    customerData.phones.homePhone?.replace(/\D/g, "") || undefined;
  const mobilePhoneNumbers = customerData.phones.mobilePhone.replace(/\D/g, "");
  const price = calculatePrice(plan, employeeCount);

  return {
    customer: {
      name: customerData.companyName,
      email: customerData.email,
      document_type: "CNPJ",
      document: customerData.cnpj.replace(/\D/g, ""),
      type: "company",
      address: {
        line_1: line_1,
        line_2: billingAddress.complement,
        zip_code: zipCode,
        city: billingAddress.city,
        state: billingAddress.state,
        country: "BR",
      },
      phones: {
        ...(homePhoneNumbers && {
          home_phone: {
            country_code: "55",
            area_code: homePhoneNumbers.substring(0, 2),
            number: homePhoneNumbers.substring(2),
          },
        }),
        mobile_phone: {
          country_code: "55",
          area_code: mobilePhoneNumbers.substring(0, 2),
          number: mobilePhoneNumbers.substring(2),
        },
      },
      metadata: {
        company: customerData.tradeName,
      },
    },
    items: [
      {
        name: plan,
        description: plan,
        quantity: "1",
        pricing_scheme: {
          scheme_type: "unit",
          price: price,
        },
      },
    ],
    card_token: cardToken,
    credit_card: {
      card: {
        billing_address: {
          line_1: line_1,
          line_2: billingAddress.complement,
          zip_code: zipCode,
          city: billingAddress.city,
          state: billingAddress.state,
          country: "BR",
        },
      },
    },
  };
}
