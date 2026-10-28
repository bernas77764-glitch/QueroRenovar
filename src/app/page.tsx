import { ContinueProject } from "@/components/ContinueProject";
import { LinkButton } from "@/components/ui/Button";

const STEPS = [
  {
    title: "Descreva o que quer renovar",
    text: "Escolha as divisões e, para cada uma, a área aproximada e os trabalhos pretendidos. Pode responder «ainda não sei».",
  },
  {
    title: "Veja um resumo organizado",
    text: "Reunimos as suas escolhas num pedido claro, com as dúvidas e medições por confirmar identificadas.",
  },
  {
    title: "Perceba custos e profissionais",
    text: "Nas próximas versões: uma estimativa indicativa e as especialidades necessárias, antes de pedir qualquer contacto.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-20">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-700">Remodelações sem complicações</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Tem uma casa de banho antiga e quer fazer uma nova?
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-700">
          Diga-nos o que pretende renovar, divisão a divisão, com perguntas simples. Não precisa de saber preparar um mapa
          de trabalhos nem de explicar tecnicamente a obra.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <LinkButton href="/projeto/divisoes" className="sm:min-w-48">
            Começar
          </LinkButton>
          <ContinueProject />
        </div>
        <p className="mt-4 text-sm text-ink-500">
          Sem registo. Os seus contactos só são pedidos se decidir pedir propostas.
        </p>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3" aria-label="Como funciona">
        {STEPS.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-ink-200 bg-white p-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
              {i + 1}
            </span>
            <h2 className="mt-3 font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-ink-700">{step.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
