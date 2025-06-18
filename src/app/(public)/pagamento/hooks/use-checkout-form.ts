"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, paymentSchema } from "../schemas/validation-schemas";
import { getCardToken, prepareCardData } from "../services/card-service";
import {
  createSubscription,
  prepareSubscriptionData,
} from "../services/subscription-service";
import { toast } from "sonner";

export type Step = "customer" | "payment" | "review";

export function useCheckoutForm() {
  const [currentStep, setCurrentStep] = useState<Step>("customer");
  const [employeeCount, setEmployeeCount] = useState("Até 50");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string>("Ouro Insights");
  // const router = useRouter();

  const customerForm = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyName: "",
      tradeName: "",
      cnpj: "",
      email: "",
      phones: {
        homePhone: "",
        mobilePhone: "",
      },
      address: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
    },
    mode: "onChange",
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardHolderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      sameAddress: true,
      billingAddress: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
    },
    mode: "onChange",
  });

  const nextStep = () => {
    if (currentStep === "customer") setCurrentStep("payment");
    else if (currentStep === "payment") {
      if (paymentForm.getValues().sameAddress) {
        paymentForm.clearErrors("billingAddress");
        setCurrentStep("review");
      } else {
        paymentForm.trigger().then((isValid) => {
          if (isValid) setCurrentStep("review");
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep === "payment") setCurrentStep("customer");
    else if (currentStep === "review") setCurrentStep("payment");
  };

  const submitOrder = async () => {
    setIsProcessing(true);

    try {
      const paymentData = paymentForm.getValues();
      const customerData = customerForm.getValues();
      const plan = planType;

      // Determinar qual endereço usar (cobrança ou organização)
      const billingAddress = paymentData.sameAddress
        ? {
            street: customerData.address.street,
            number: customerData.address.number,
            complementary: customerData.address.complement || undefined,
            neighborhood: customerData.address.neighborhood,
            city: customerData.address.city,
            state: customerData.address.state,
            zipCode: customerData.address.zipCode.replace(/\D/g, ""),
          }
        : {
            street: paymentData.billingAddress.street || "",
            number: paymentData.billingAddress.number || "",
            complementary: paymentData.billingAddress.complement || undefined,
            neighborhood: paymentData.billingAddress.neighborhood || "",
            city: paymentData.billingAddress.city || "",
            state: paymentData.billingAddress.state || "",
            zipCode: (paymentData.billingAddress.zipCode || "").replace(
              /\D/g,
              ""
            ),
          };

      const cardData = prepareCardData(
        customerData,
        paymentData,
        billingAddress
      );

      setProcessingStep("Tokenizando cartão...");
      const cardToken = await getCardToken(cardData);

      // 3. Preparar os dados da assinatura
      const subscriptionData = prepareSubscriptionData(
        plan,
        employeeCount,
        customerData,
        cardToken,
        billingAddress
      );

      console.log(customerData);
      console.log(subscriptionData);

      // 4. Enviar o token e os dados da organização para o backend
      setProcessingStep("Criando assinatura...");
      const subscription = await createSubscription(subscriptionData);

      // console.log(subscription);

      // if (subscription.succeeded == false) {
      //   toast.success("Ocorreu um erro ao criar a assinatura!", {
      //     description: `${subscription.error.message}`,
      //   });
      // }

      // 5. Mostrar mensagem de sucesso usando Sonner
      toast.success("Assinatura criada com sucesso!", {
        description: `Sua assinatura #${subscription.data?.id} foi criada. Você receberá um e-mail com os detalhes.`,
      });

      // 6. Redirecionar para a página de sucesso
      // router.push(`/checkout/success?subscription_id=${subscription.id}`);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);

      // Mostrar mensagem de erro usando Sonner
      toast.error("Erro ao processar pagamento", {
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  return {
    currentStep,
    customerForm,
    paymentForm,
    employeeCount,
    setEmployeeCount,
    isProcessing,
    processingStep,
    planType,
    setPlanType,
    nextStep,
    prevStep,
    submitOrder,
  };
}
