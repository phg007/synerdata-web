import { Suspense } from "react";
import RequestDemoForm from "./components/request-demo";

export default function RequestDemoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RequestDemoForm />
    </Suspense>
  );
}
