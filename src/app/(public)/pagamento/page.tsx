"use client";

import { useCheckoutForm } from "./hooks/use-checkout-form";
import CustomerForm from "./_components/customer-form";
import PaymentForm from "./_components/payment-form";
import ReviewStep from "./_components/review-step";
import OrderSummary from "./_components/order-summary";
import { useEffect } from "react";

export default function CheckoutPage() {
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const plan = searchParams.get("plan") || "Ouro Insights";
  const index = Number.parseInt(searchParams.get("index") || "0");

  const {
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
  } = useCheckoutForm();

  useEffect(() => {
    setPlanType(plan);
  }, [plan, setPlanType]);

  const renderStepContent = () => {
    switch (currentStep) {
      case "customer":
        return <CustomerForm form={customerForm} onSubmit={nextStep} />;
      case "payment":
        return (
          <PaymentForm
            form={paymentForm}
            onSubmit={nextStep}
            onBack={prevStep}
          />
        );
      case "review":
        return (
          <ReviewStep
            customerData={customerForm.getValues()}
            paymentData={paymentForm.getValues()}
            employeeCount={employeeCount}
            isProcessing={isProcessing}
            processingStep={processingStep}
            planType={planType}
            planIndex={index}
            onSubmit={submitOrder}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container max-w-7xl py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Checkout
          </h1>
          <div className="mt-6">
            <div className="flex justify-between max-w-md">
              <div
                className={`text-sm ${currentStep === "customer" ? "text-white font-medium" : "text-white/70"}`}
              >
                Dados da organização
              </div>
              <div
                className={`text-sm ${currentStep === "payment" ? "text-white font-medium" : "text-white/70"}`}
              >
                Pagamento
              </div>
              <div
                className={`text-sm ${currentStep === "review" ? "text-white font-medium" : "text-white/70"}`}
              >
                Revisão
              </div>
            </div>
            <div className="mt-2 h-1 w-full max-w-md bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{
                  width:
                    currentStep === "customer"
                      ? "33.33%"
                      : currentStep === "payment"
                        ? "66.66%"
                        : "100%",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xl">
              {renderStepContent()}
            </div>
          </div>

          <div className="lg:col-span-1 order-first lg:order-last">
            <OrderSummary
              employeeCount={employeeCount}
              setEmployeeCount={setEmployeeCount}
              planType={planType}
              planIndex={index}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
