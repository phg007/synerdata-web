import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliticaReembolsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0F55] to-[#4B0082]">
      <div className="container py-8">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-white/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Synerdata
        </Link>

        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold">
              Política de Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p>
                Na Synerdata, nosso compromisso é oferecer serviços digitais de
                alta qualidade que atendam às suas expectativas. Caso você tenha
                alguma insatisfação com o serviço contratado, esta Política de
                Reembolso detalha as condições e os procedimentos para solicitar
                um reembolso.
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  1. Aplicação da Política
                </h2>
                <p>
                  Esta política aplica-se exclusivamente aos serviços digitais
                  contratados por meio da nossa plataforma.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  2. Condições para Reembolso
                </h2>
                <p>
                  Você poderá solicitar o reembolso nas seguintes condições:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Se o serviço contratado apresentar falhas técnicas
                    comprovadas que não puderam ser solucionadas pelo suporte
                    técnico.
                  </li>
                  <li>
                    Caso a solicitação de cancelamento seja feita dentro de 7
                    (sete) dias corridos após a contratação, conforme previsto
                    no Código de Defesa do Consumidor para compras online.
                  </li>
                  <li>
                    Em situações específicas acordadas diretamente com nosso
                    time de suporte.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  3. Exceções
                </h2>
                <p>
                  Os reembolsos não serão aplicáveis nas seguintes situações:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Cancelamentos solicitados após o prazo de 7 (sete) dias
                    corridos.
                  </li>
                  <li>
                    Serviços que já tenham sido integralmente utilizados ou
                    concluídos.
                  </li>
                  <li>
                    Problemas resultantes de incompatibilidades técnicas não
                    informadas antes da contratação do serviço.
                  </li>
                  <li>
                    Insatisfação com funcionalidades que estão claramente
                    descritas na nossa documentação ou termos de uso.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  4. Processo para Solicitação de Reembolso
                </h2>
                <p>Para solicitar um reembolso, siga os passos abaixo:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Envie um e-mail para suporte@synerdata.com.br com o assunto:
                    Solicitação de Reembolso.
                  </li>
                  <li>
                    Inclua no corpo do e-mail:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Nome completo.</li>
                      <li>
                        Número do pedido ou identificação do serviço contratado.
                      </li>
                      <li>Motivo detalhado da solicitação.</li>
                    </ul>
                  </li>
                  <li>
                    Nossa equipe analisará sua solicitação e responderá em até 5
                    dias úteis.
                  </li>
                </ol>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  5. Prazo para Processamento do Reembolso
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Uma vez aprovada, a devolução do valor será realizada em até
                    15 dias úteis.
                  </li>
                  <li>
                    O reembolso será processado pelo mesmo método de pagamento
                    utilizado no ato da compra.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  6. Alternativas ao Reembolso
                </h2>
                <p>
                  Em situações em que o reembolso não seja aplicável, podemos
                  oferecer:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Créditos para utilização em outros serviços disponíveis na
                    plataforma.
                  </li>
                  <li>
                    Ajustes técnicos ou atualizações para solucionar o problema
                    reportado.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#2A0F55]">
                  7. Contato
                </h2>
                <p>
                  Se você tiver dúvidas ou precisar de mais informações sobre a
                  nossa Política de Reembolso, entre em contato pelo e-mail
                  suporte@synerdata.com.br.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            asChild
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
