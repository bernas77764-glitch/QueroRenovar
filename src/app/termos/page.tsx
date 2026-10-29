import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Termos e Condições e Política de Privacidade" };

/*
 * Draft text: the NIF and contact email below are still to be confirmed, and
 * the whole text should be reviewed by a lawyer before it is relied upon. When the terms
 * change, bump TERMS_VERSION in src/lead/store.ts so each request records the
 * version the client accepted.
 */
const COMPANY = {
  name: "QueroRenovar, Lda.",
  nif: "[NIF]",
  email: "[email de contacto]",
};

const UPDATED = "29 de outubro de 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 grid gap-2 text-ink-700">{children}</div>
    </section>
  );
}

export default function TermosPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Termos e Condições e Política de Privacidade</h1>
      <p className="mt-2 text-sm text-ink-500">Última atualização: {UPDATED}</p>

      <Section title="1. Quem somos">
        <p>
          O serviço Quero Renovar (querorenovar.pt) é explorado por {COMPANY.name}, NIF {COMPANY.nif}. Pode
          contactar-nos através de {COMPANY.email}.
        </p>
      </Section>

      <Section title="2. O serviço">
        <p>
          O Quero Renovar ajuda quem quer remodelar um imóvel a encontrar profissionais para executar a obra. O cliente
          descreve o que pretende e o Quero Renovar encaminha o pedido para empresas ou profissionais parceiros, que podem
          contactar o cliente com propostas.
        </p>
        <p>
          O serviço é gratuito para o cliente e não o obriga a aceitar nenhuma proposta. O Quero Renovar pode receber
          uma remuneração dos parceiros quando uma obra é adjudicada.
        </p>
        <p>
          Os contratos de obra são celebrados diretamente entre o cliente e o profissional escolhido. O Quero Renovar não
          é parte desses contratos e não responde pela execução, prazos, preços ou qualidade dos trabalhos dos parceiros.
        </p>
      </Section>

      <Section title="3. Dados que recolhemos">
        <p>
          Quando faz um pedido recolhemos: o seu nome, email, telefone e o concelho da obra; os espaços, áreas, trabalhos
          e urgência que indicou; e as observações que escreveu. Antes de enviar o pedido, as suas respostas ficam
          guardadas apenas no seu navegador.
        </p>
      </Section>

      <Section title="4. Para que usamos os dados">
        <ul className="list-disc pl-5">
          <li>Analisar o seu pedido e contactá-lo sobre ele.</li>
          <li>Partilhar o pedido e os seus contactos com profissionais parceiros adequados à obra e à zona, para que lhe enviem propostas.</li>
          <li>Acompanhar o pedido até à conclusão.</li>
        </ul>
        <p>
          A base legal é o seu consentimento, dado ao aceitar estes termos no envio do pedido, e as diligências
          pré-contratuais a seu pedido. Não usamos os seus dados para outras finalidades nem os vendemos.
        </p>
      </Section>

      <Section title="5. Partilha com parceiros">
        <p>
          Os seus dados são partilhados apenas com os parceiros selecionados para o seu pedido, que os podem usar só para
          lhe apresentar propostas e, se as aceitar, executar a obra.
        </p>
      </Section>

      <Section title="6. Durante quanto tempo guardamos os dados">
        <p>
          Guardamos os dados do pedido durante o tempo necessário ao seu acompanhamento e, no máximo, 24 meses após o
          último contacto, salvo obrigação legal de os guardar por mais tempo.
        </p>
      </Section>

      <Section title="7. Os seus direitos">
        <p>
          Pode pedir o acesso, a retificação ou o apagamento dos seus dados, limitar ou opor-se ao seu tratamento, pedir
          a sua portabilidade e retirar o consentimento a qualquer momento, escrevendo para {COMPANY.email}. Retirar o
          consentimento não afeta o tratamento já feito. Pode também apresentar reclamação à Comissão Nacional de
          Proteção de Dados (www.cnpd.pt).
        </p>
      </Section>

      <Section title="8. Alterações">
        <p>
          Podemos atualizar estes termos. A versão em vigor está sempre nesta página, com a data da última atualização.
        </p>
      </Section>
    </article>
  );
}
