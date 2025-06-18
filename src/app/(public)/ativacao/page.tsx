import { Suspense } from "react";
import ActivationForm from "./components/activation-form";

export default function ActivationPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <ActivationForm />
    </Suspense>
  );
}
