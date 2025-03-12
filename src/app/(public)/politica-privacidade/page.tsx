import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliticaPrivacidadePage() {
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
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              SYNNERDATA4
            </h2>
            <p>
              A presente Política de Privacidade contém informações sobre
              coleta, uso, armazenamento, tratamento e proteção dos dados
              pessoais dos usuários e visitantes do site da empresa SYNNERDATA4,
              com a finalidade de demonstrar absoluta transparência quanto ao
              assunto e esclarecer a todos interessados sobre os tipos de dados
              que são coletados, os motivos da coleta e a forma como os usuários
              podem gerenciar ou excluir as suas informações pessoais.
            </p>
            <p>
              O presente documento foi elaborado em conformidade com a Lei Geral
              de Proteção de Dados Pessoais (Lei 13.709/18), o Marco Civil da
              Internet (Lei 12.965/14) (e o Regulamento da UE n. 2016/6790).
              Ainda, o documento poderá ser atualizado em decorrência de
              eventual atualização normativa, razão pela qual se convida o
              usuário a consultar periodicamente esta seção.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              2 – SOBRE OS DADOS COLETADOS
            </h2>
            <h3 className="text-xl font-semibold text-[#2A0F55]">
              2.1 – DADOS PESSOAIS FORNECIDOS PELO USUÁRIO
            </h3>
            <p>
              Os dados pessoais podem ser coletados diretamente por simples
              disponibilização a um funcionário do(a) SYNNERDATA4 quando do
              preenchimento de cadastro ou acordos comerciais, bem, como
              mediante a interação em nossas plataformas.
            </p>

            <h3 className="text-xl font-semibold text-[#2A0F55]">
              2.2 – QUAIS DADOS SÃO COLETADOS
            </h3>
            <p>
              O(a) SYNNERDATA4 coleta informações de modo automático em suas
              plataformas de interação com o Usuário, tais como: Nome Completo,
              CPF, E-mail e Telefone; estado civil, local de nascimento,
              documentos de identificação e CPF, nome da mãe e pai, informações
              sobre cônjuge, endereço, dados bancários, dados de contrato; dados
              bancário; informações de renda; endereço de IP e Cookies.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              3 – PARA QUE FINALIDADES UTILIZAMOS OS DADOS PESSOAIS DO USUÁRIO E
              VISITANTE?
            </h2>
            <p>
              Os dados pessoais tratados pelo(a) SYNNERDATA4 têm como principais
              finalidades a possibilidade do Usuário conhecer a oferta de
              produtos e serviços SYNNERDATA4, o fornecimento de informações via
              formulário de contato ou pelo corretor online, identificar os
              Usuários que navegam no site e manter os dados de Usuários
              atualizados.
            </p>
            <p>Os dados poderão ser utilizados:</p>
            <ul>
              <li>
                Bem-estar do usuário e visitante: aprimorar o produto e/ou
                serviço oferecido, facilitar, agilizar e cumprir os compromissos
                estabelecidos entre o usuário e a empresa, melhorar a
                experiência dos usuários e fornecer funcionalidades específicas
                a depender das características básicas do usuário.
              </li>
              <li>
                Melhorias da plataforma: compreender como o usuário utiliza os
                serviços da plataforma, para ajudar no desenvolvimento de
                negócios e técnicas.
              </li>
              <li>
                Anúncios: apresentar anúncios personalizados para o usuário com
                base nos dados fornecidos.
              </li>
              <li>
                Comercial: os dados são usados para personalizar o conteúdo
                oferecido e gerar subsídio à plataforma para a melhora da
                qualidade no funcionamento dos serviços.
              </li>
              <li>
                Previsão do perfil do usuário: tratamento automatizados de dados
                pessoais para avaliar o uso na plataforma.
              </li>
              <li>
                Dados de cadastro: para permitir o acesso do usuário a
                determinados conteúdos da plataforma, exclusivo para usuários
                cadastrados
              </li>
              <li>
                Dados de contrato: conferir às partes segurança jurídica e
                facilitar a conclusão do negócio.
              </li>
              <li>Outras</li>
            </ul>
            <p>
              Em alguns casos, poderá tratar seus dados pessoais quando
              necessários para o cumprimento de obrigação legal ou exercício
              regular de direitos em processo judicial, administrativo ou
              arbitral.
            </p>
            <p>
              Além disso, também poderá tratar dados pessoais com base em seu
              interesse legítimo, sempre no limite de sua expectativa, e nunca
              em prejuízo de seus interesses, direitos e liberdades
              fundamentais.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              4 – COM QUEM OS DADOS SÃO COMPARTILHADOS
            </h2>
            <ul>
              <li>
                Com autoridades judiciais, administrativas ou governamentais
                competentes, sempre que houver determinação legal, requerimento,
                requisição ou ordem judicial;
              </li>
              <li>
                Com instituições responsáveis por cobrar o crédito decorrente da
                aquisição da(s) unidade(s) imobiliária(s) que você adquiriu;
              </li>
              <li>
                Com o corretor de imóveis, quando a compra for intermediada;
              </li>
              <li>Instituições financeiras de financiamento de imóvel;</li>
              <li>
                Com a administradora do condomínio, que prestará os serviços de
                gestão e administração do empreendimento; e
              </li>
              <li>
                De forma automática, em caso de movimentações societárias, como
                fusão, aquisição e incorporação.
              </li>
              <li>Securitização de recebíveis</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              5 – POR QUANTO TEMPO OS DADOS PESSOAIS FICAM ARMAZENADOS?
            </h2>
            <p>
              Os dados pessoais do usuário e visitante são armazenados pela
              plataforma durante o período necessário para a prestação do
              serviço ou o cumprimento das finalidades previstas no presente
              documento, conforme o disposto no inciso I do artigo 15 da Lei
              13.709/18.
            </p>
            <p>
              Os dados podem ser removidos ou anonimizados a pedido do usuário,
              excetuando os casos em que a lei oferecer outro tratamento.
            </p>
            <p>
              Ainda, os dados pessoais dos usuários apenas podem ser conservados
              após o término de seu tratamento nas seguintes hipóteses previstas
              no artigo 16 da referida lei:
            </p>
            <ol>
              <li>
                I – cumprimento de obrigação legal ou regulatória pelo
                controlador;
              </li>
              <li>
                II – estudo por órgão de pesquisa, garantida, sempre que
                possível, a anonimização dos dados pessoais;
              </li>
              <li>
                III – transferência a terceiro, desde que respeitados os
                requisitos de tratamento de dados dispostos nesta Lei;
              </li>
              <li>
                IV – uso exclusivo do controlador, vedado seu acesso por
                terceiro, e desde que anonimizados os dados.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              6 – SEGURANÇA DOS DADOS PESSOAIS ARMAZENADOS
            </h2>
            <p>
              O(a) SYNNERDATA4 se compromete a aplicar as medidas técnicas e
              organizativas aptas a proteger os dados pessoais de acessos não
              autorizados e de situações de destruição, perda, alteração,
              comunicação ou difusão de tais dados.
            </p>
            <p>
              O(a) SYNNERDATA4 não se exime de responsabilidade por culpa
              exclusiva de terceiro, como em caso de ataque de hackers ou
              crackers, ou culpa exclusiva do usuário, como no caso em que ele
              mesmo transfere seus dados a terceiros, comprometendo-se a
              comunicar o usuário em caso de alguma violação de segurança dos
              seus dados pessoais.
            </p>
            <p>
              Os dados pessoais armazenados são tratados com confidencialidade,
              dentro dos limites legais. No entanto, podemos divulgar suas
              informações pessoais caso sejamos obrigados pela lei para fazê-lo
              ou se você violar nossos Termos de Serviço.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              7 – COOKIES OU DADOS DE NAVEGAÇÃO
            </h2>
            <p>
              Os cookies referem-se a arquivos de texto enviados pela plataforma
              ao computador do usuário e visitante e que nele ficam armazenados,
              com informações relacionadas à navegação no site.
            </p>
            <p>
              Tais informações são relacionadas aos dados de acesso como local e
              horário de acesso e são armazenadas pelo navegador do usuário e
              visitante para que o servidor da plataforma possa lê-las
              posteriormente a fim de personalizar os serviços da plataforma.
            </p>
            <p>
              O usuário e o visitante do site manifesta conhecer e aceitar que
              pode ser utilizado um sistema de coleta de dados de navegação
              mediante à utilização de cookies.
            </p>
            <p>
              O cookie persistente permanece no disco rígido do usuário e
              visitante depois que o navegador é fechado e será usado pelo
              navegador em visitas subsequentes ao site. Os cookies persistentes
              podem ser removidos seguindo as instruções do seu navegador. Já o
              cookie de sessão é temporário e desaparece depois que o navegador
              é fechado. É possível redefinir seu navegador da web para recusar
              todos os cookies, porém alguns recursos da plataforma podem não
              funcionar corretamente se a capacidade de aceitar cookies estiver
              desabilitada.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              8 – CONSENTIMENTO
            </h2>
            <p>
              Ao utilizar os serviços e fornecer as informações pessoais na
              plataforma, o usuário está consentindo com a presente Política de
              Privacidade.
            </p>
            <p>
              O usuário, ao cadastrar-se, manifesta conhecer e pode exercitar
              seus direitos de cancelar seu cadastro, acessar e atualizar seus
              dados pessoais e garante a veracidade das informações por ele
              disponibilizadas.
            </p>
            <p>
              O usuário tem direito de retirar o seu consentimento a qualquer
              tempo, para tanto deve entrar em contato com nosso escritório.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              9 – ALTERAÇÕES PARA ESSA POLÍTICA DE PRIVACIDADE
            </h2>
            <p>
              Reservamos o direito de modificar essa Política de Privacidade a
              qualquer momento, então, é recomendável que o usuário e visitante
              revise-a com frequência.
            </p>
            <p>
              As alterações e esclarecimentos vão surtir efeito imediatamente
              após sua publicação na plataforma. Quando realizadas alterações os
              usuários serão notificados. Ao utilizar o serviço ou fornecer
              informações pessoais após eventuais modificações, o usuário e
              visitante demonstra sua concordância com as novas normas.
            </p>
            <p>
              Diante da fusão ou venda da plataforma à outra empresa os dados
              dos usuários podem ser transferidas para os novos proprietários
              para que a permanência dos serviços oferecidos.
            </p>

            <h2 className="text-2xl font-semibold text-[#2A0F55]">
              10 – JURISDIÇÃO PARA RESOLUÇÃO DE CONFLITOS
            </h2>
            <p>
              Para a solução de controvérsias decorrentes do presente
              instrumento será aplicado integralmente o Direito brasileiro.
            </p>
            <p>
              Os eventuais litígios deverão ser apresentados no foro da comarca
              em que se encontra a sede da empresa.
            </p>
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
