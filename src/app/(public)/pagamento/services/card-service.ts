import {
  AddressFormData,
  CustomerFormData,
  PaymentFormData,
} from "../schemas/validation-schemas";

export interface PagarMeCardTokenResponse {
  id: string;
  type: string;
  created_at: string;
  expires_at: string;
  card: {
    first_six_digits: string;
    last_four_digits: string;
    holder_name: string;
    holder_document: string;
    exp_month: number;
    exp_year: number;
    brand: string;
  };
}

export interface CardData {
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  billing_address: {
    line_1: string;
    line_2: string | undefined;
    zip_code: string;
    city: string;
    state: string;
    country: string;
  };
}

export async function getCardToken(cardData: CardData): Promise<string> {
  try {
    const response = await fetch(
      "https://api.pagar.me/core/v5/tokens?appId=pk_p27EZ88AcKtpZemd",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "card",
          card: cardData,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 422) {
        throw new Error("Verifique os dados do cartão e tente novamente");
      }
      throw new Error(errorData.message || "Erro ao tokenizar o cartão");
    }

    const tokenData: PagarMeCardTokenResponse = await response.json();
    return tokenData.id;
  } catch (error) {
    console.error("Erro ao obter token do cartão:", error);
    throw error;
  }
}

export function prepareCardData(
  customerData: CustomerFormData,
  paymentData: PaymentFormData,
  billingAddress: AddressFormData
): CardData {
  const line_1 = `${billingAddress.number}, ${billingAddress.street}, ${billingAddress.neighborhood}`;
  const zipCode = billingAddress.zipCode.replace(/\D/g, "");

  return {
    number: paymentData.cardNumber.replace(/\s/g, ""),
    holder_name: paymentData.cardHolderName.toLocaleUpperCase(),
    holder_document: customerData.cnpj.replace(/\D/g, ""),
    exp_month: parseInt(paymentData.expiryMonth),
    exp_year: parseInt(paymentData.expiryYear),
    cvv: paymentData.cvv,
    billing_address: {
      line_1: line_1,
      line_2: billingAddress.complement,
      zip_code: zipCode,
      city: billingAddress.city,
      state: billingAddress.state,
      country: "BR",
    },
  };
}
