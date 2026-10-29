import { LinkButton } from "@/components/ui/Button";
import { SpaceIcon } from "@/components/pedido/SpaceIcon";
import { SPACE_TYPES } from "@/lead/catalog";

const STEPS = [
  {
    title: "Diga o que quer remodelar",
    text: "Escolha os espaços, a área aproximada e os trabalhos. Demora cerca de 2 minutos.",
  },
  {
    title: "Encontramos o profissional certo",
    text: "Analisamos o seu pedido e encaminhamo-lo para profissionais parceiros da sua zona.",
  },
  {
    title: "Receba propostas",
    text: "É contactado com propostas para a sua obra. Sem custos e sem compromisso.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-20">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-700">Remodelações sem complicações</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Quer remodelar a sua casa?</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-700">
          Cozinhas, casas de banho, quartos, escritórios ou garagens. Diga-nos o que pretende e receba propostas de
          profissionais da sua zona.
        </p>
        <div className="mt-8">
          <LinkButton href="/pedido/espacos" className="w-full sm:w-auto sm:min-w-56">
            Pedir propostas grátis
          </LinkButton>
        </div>
        <p className="mt-4 text-sm text-ink-500">Sem registo. Só pedimos os seus contactos no fim.</p>
      </section>

      <ul className="mt-12 flex flex-wrap gap-2" aria-label="Espaços que pode remodelar">
        {SPACE_TYPES.map((type) => (
          <li
            key={type.id}
            className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-2.5 pr-3.5 text-sm text-ink-700"
          >
            <SpaceIcon type={type.id} className="size-5 text-brand-700" />
            {type.label}
          </li>
        ))}
      </ul>

      <section className="mt-12 grid gap-6 sm:grid-cols-3" aria-label="Como funciona">
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
