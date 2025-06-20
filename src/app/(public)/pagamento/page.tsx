import { Suspense } from "react";
import CheckoutForm from "./components/payment-form";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
