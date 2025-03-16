import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileSpreadsheet,
  Globe,
  LineChart,
  Lock,
  Users,
  Trophy,
  Star,
  Crown,
  X,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Synerdata - Transforme seus dados em insights estratégicos",
  description:
    "Centralize, analise e tome decisões baseadas em dados com nossa plataforma integrada de gestão empresarial e Power BI.",
};

const features = [
  { name: "Demitidos", available: true },
  { name: "Faltas", available: true },
  { name: "Atestados", available: true },
  { name: "Acidentes", available: true },
  { name: "Advertências", available: true },
  { name: "Status do Trabalhador", available: true },
  { name: "Aniversariantes", available: false },
  { name: "EPI", available: false },
  { name: "Ficha Cadastral", available: false },
  { name: "Folha", available: false },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed w-full z-50">
        <div className="nav-blur border-b border-white/10">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link className="flex items-center space-x-2" href="/">
                <span className="font-bold text-white text-xl">Synerdata</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm">
                <a
                  className="text-white/70 hover:text-white transition-colors font-bold"
                  href="#recursos"
                >
                  Recursos
                </a>
                <a
                  className="text-white/70 hover:text-white transition-colors font-bold"
                  href="#precos"
                >
                  Preços
                </a>
                <a
                  className="text-white/70 hover:text-white transition-colors font-bold"
                  href="#sobre"
                >
                  Sobre
                </a>
                <a
                  className="text-white/70 hover:text-white transition-colors font-bold"
                  href="#faq"
                >
                  FAQ
                </a>
                <Link
                  href="/politica-reembolso"
                  className="text-white/70 hover:text-white transition-colors font-bold"
                >
                  Política de Reembolso
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/sign-in" className="font-bold">
                  Acessar Plataforma
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-screen flex items-center hero-gradient">
          <div className="absolute inset-0 hero-overlay"></div>
          <div className="container relative z-10 py-32">
            <div className="max-w-[64rem] space-y-6">
              <Badge className="bg-white/10 text-white hover:bg-white/20 transition-colors">
                ✨ Simplifique sua gestão de dados
              </Badge>
              <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Transforme seus dados em{" "}
                <span className="gradient-text gradient-border">
                  insights estratégicos
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-[42rem]">
                Centralize, analise e tome decisões baseadas em dados com nossa
                plataforma integrada de gestão empresarial e Power BI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href="/solicitar-demonstracao">
                    Agende sua demonstração
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
        </section>
        <section id="recursos" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl text-[#340D64]">
                Recursos
              </h2>
              <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
                Tudo que você precisa para uma gestão eficiente e integrada
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <Users className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Gestão de RH
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Controle completo de funcionários, ocorrências e
                    documentação.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Relatórios Power BI
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Integração direta via API para relatórios dinâmicos.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <Lock className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Segurança
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Dados protegidos com criptografia e controle de acesso.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <Globe className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Dashboard Web
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Acesse seus dados de qualquer lugar, a qualquer momento.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <FileSpreadsheet className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Gestão Documental
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Organize todos os documentos empresariais em um só lugar.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#340D64] text-white border-none transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                <CardHeader>
                  <LineChart className="h-12 w-12 mb-4 text-white" />
                  <CardTitle className="text-xl text-white">
                    Análise Avançada
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Insights profundos para tomada de decisão estratégica.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section id="precos" className="py-8 md:py-12 lg:py-24 bg-gray-100">
          <div className="container">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Comece a usar hoje mesmo e veja a diferença!
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Oferta por tempo limitado: obtenha um desconto em sua assinatura
              </p>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-3 max-w-[1200px] mx-auto">
              {["Ouro Insights", "Diamante Analytics", "Platina Vision"].map(
                (plan, index) => (
                  <Card key={plan} className="relative pt-16">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <div className="rounded-full bg-white p-4 shadow-md">
                        {index === 0 && (
                          <Trophy className="h-8 w-8 text-yellow-500" />
                        )}
                        {index === 1 && (
                          <Star className="h-8 w-8 text-blue-500" />
                        )}
                        {index === 2 && (
                          <Crown className="h-8 w-8 text-purple-500" />
                        )}
                      </div>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold">
                        {plan}
                      </CardTitle>
                      <CardDescription>
                        {index === 0 &&
                          "Comece com o essencial para contratações eficavas"}
                        {index === 1 &&
                          "ALÉM DE CONTAR COM OS BENEFICIOS DO PLANO OURO INSIGHTS VOCE TERÁ"}
                        {index === 2 &&
                          "ALÉM DE CONTAR COM OS BENEFICIOS DOS PLANOS ANTERIORES VOCÊ TERÁ"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            {feature.available ? (
                              <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                            ) : (
                              <X className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                            )}
                            <span className="flex-grow">{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                      {index === 2 && (
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <p>
                            • Análise Prévia de Rescisão, sua empresa terá um
                            processo de desligamento mais seguro, obtendo riscos
                            financeiros e evitando complicações jurídicas. Esse
                            benefício agrega um valor estratégico ao plano,
                            melhorando a gestão de desligamentos e garantindo
                            uma saída tranquila tanto para a empresa quanto para
                            o colaborador.
                          </p>
                          <p>
                            • Relatórios financeiros para controle e
                            planejamento orçamentário.
                          </p>
                        </div>
                      )}
                      {index === 0 && (
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <p>
                            • Redução de custos com rescisão ao avaliar o perfil
                            dos funcionários demitidos.
                          </p>
                          <p>
                            • Monitoramento real das ausências para redução de
                            impacto na produtividade.
                          </p>
                          <p>
                            • Identificação de padrões recorrentes que podem
                            indicar problemas de saúde ou fraudes.
                          </p>
                          <p>
                            • Melhoria no acompanhamento dos afastamentos,
                            promovendo ações para reintegração rápida e
                            eficiente.
                          </p>
                          <p>
                            • Garantia de conformidade com as Normas
                            Regulamentadoras (NRs), evitando multas.
                          </p>
                          <p>
                            • Status atual de funcionários para gestão dos
                            funcionários que estão ativos e disponíveis para o
                            trabalho.
                          </p>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <p>
                            • Organização automática dos dados de aniversário
                            dos colaboradores.
                          </p>
                          <p>
                            • Criação de ações de endomarketing para fortalecer
                            o engajamento da equipe.
                          </p>
                          <p>
                            • Controle rigoroso de distribuição e devolução de
                            EPIs.
                          </p>
                          <p>
                            • Garantia de conformidade com normas de segurança
                            do trabalho.
                          </p>
                          <p>
                            • Redução de desperdícios e custos associados à
                            gestão de EPIs.
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-4 flex flex-col gap-2">
                      <Button
                        className="w-full bg-white text-[#340D64] hover:bg-white/90 border-2 border-[#340D64]"
                        asChild
                      >
                        <Link
                          href={`/solicitar-demonstracao?plano=${encodeURIComponent(plan)}`}
                        >
                          Solicitar demonstração
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-[#340D64] text-white hover:bg-[#4A1491]"
                        asChild
                      >
                        <Link
                          href={`/checkout?plan=${encodeURIComponent(plan)}&users=Até 50`}
                        >
                          Aderir Plano
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>
        <section id="sobre" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Sobre a Synerdata
            </h2>
            <div className="max-w-[85%] space-y-4 text-left text-muted-foreground sm:text-lg sm:leading-7">
              <p>
                Na Synerdata, somos especialistas em transformar dados em
                soluções estratégicas para o Departamento Pessoal. Nossa missão
                é fornecer insights precisos e ferramentas avançadas de
                inteligência de negócios para otimizar a gestão de pessoas,
                aumentar a eficiência operacional e apoiar a tomada de decisões
                fundamentadas.
              </p>
              <p>
                Combinamos tecnologia de ponta com um profundo entendimento das
                necessidades do setor de DP, oferecendo soluções personalizadas
                que simplificam processos, reduzem custos e melhoram o
                desempenho organizacional.
              </p>
              <p>
                Nosso compromisso é entregar resultados que impactam diretamente
                a produtividade e a competitividade das empresas, ajudando-as a
                alcançar seus objetivos com agilidade e confiança.
              </p>
              <p>
                Se você busca inovação e excelência na gestão de pessoas, conte
                conosco para transformar o potencial dos seus dados em valor
                real para o seu negócio.
              </p>
            </div>
            <Button
              size="lg"
              className="mt-4 bg-[#340D64] hover:bg-[#4A1491] text-white"
              asChild
            >
              <Link href="/contact">
                Entre em Contato
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section
          id="faq"
          className="container py-8 md:py-12 lg:py-24 bg-gray-100"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Perguntas Frequentes
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Encontre respostas para as dúvidas mais comuns sobre a Synerdata e
              nossos serviços.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-[58rem]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  O que é inteligência de negócios aplicada ao Departamento
                  Pessoal?
                </AccordionTrigger>
                <AccordionContent>
                  É o uso de tecnologia e análise de dados para melhorar a
                  gestão de pessoas e processos no DP. Isso inclui identificar
                  tendências, automatizar tarefas e criar relatórios que
                  auxiliem na tomada de decisões estratégicas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Quais serviços vocês oferecem?
                </AccordionTrigger>
                <AccordionContent>
                  Oferecemos soluções como análise de dados de DP, criação de
                  dashboards personalizados, automação de processos, controle de
                  indicadores-chave de desempenho (KPIs), e suporte para
                  auditorias e compliance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Preciso ter um banco de dados próprio para usar os serviços?
                </AccordionTrigger>
                <AccordionContent>
                  Não! Nós oferecemos soluções que não dependem de um banco de
                  dados próprio. Coletamos, estruturamos e armazenamos os dados
                  de forma segura, garantindo que você possa aproveitar todos os
                  benefícios da inteligência de negócios sem precisar investir
                  em infraestrutura adicional.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Como a inteligência de negócios pode ajudar minha empresa?
                </AccordionTrigger>
                <AccordionContent>
                  Nossas soluções podem reduzir custos operacionais, melhorar a
                  produtividade, identificar gargalos em processos e ajudar a
                  sua empresa a tomar decisões mais informadas e ágeis
                  relacionadas à gestão de pessoas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  A solução é adaptada para minha empresa?
                </AccordionTrigger>
                <AccordionContent>
                  Sim, todas as nossas soluções são personalizadas de acordo com
                  as necessidades específicas de cada cliente. Trabalhamos
                  juntos para entender seus desafios e desenvolver ferramentas
                  sob medida.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  Vocês atendem empresas de qual porte?
                </AccordionTrigger>
                <AccordionContent>
                  Atendemos empresas de todos os tamanhos, desde pequenas e
                  médias até grandes corporações. Adaptamos nossas soluções
                  conforme o porte e a complexidade de cada negócio.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  Qual é o prazo para implementação dos serviços?
                </AccordionTrigger>
                <AccordionContent>
                  O prazo varia dependendo da complexidade do projeto. Após uma
                  análise inicial, oferecemos um cronograma detalhado e realista
                  para cada etapa da implementação.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>
                  Vocês oferecem suporte após a implementação?
                </AccordionTrigger>
                <AccordionContent>
                  Sim! Nosso compromisso inclui suporte contínuo para garantir
                  que as soluções implementadas estejam funcionando corretamente
                  e atendendo às necessidades da sua empresa.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9">
                <AccordionTrigger>Como posso começar?</AccordionTrigger>
                <AccordionContent>
                  Se você entendeu nossos serviços e se sente seguro, realize a
                  compra e agende um treinamento OU Entre em contato conosco
                  através da página de Contato e agende uma reunião para
                  conhecer melhor nossas soluções e discutir como podemos ajudar
                  sua empresa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-8 bg-[#2A0F55] text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="font-bold text-xl">Synerdata</span>
            <p className="text-sm text-white/70">
              © 2024 Synerdata. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/70 hover:text-white transition-colors"
            >
              Termos
            </Link>
            <Link
              href="/politica-privacidade"
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
