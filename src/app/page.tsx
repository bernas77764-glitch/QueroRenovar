import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { SpaceIcon } from "@/components/pedido/SpaceIcon";
import { SPACE_TYPES } from "@/lead/catalog";

const PROMISES = ["Gratuito", "Sem compromisso", "Profissionais da sua zona"];

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
    text: "É contactado com propostas para a sua obra e escolhe com quem avançar.",
  },
];

const REASONS = [
  {
    title: "Um pedido, várias propostas",
    text: "Descreve a obra uma vez e nós tratamos de a fazer chegar a quem a pode executar.",
  },
  {
    title: "Sem custos para si",
    text: "Pedir propostas é gratuito e não o obriga a aceitar nenhuma.",
  },
  {
    title: "Pequenas ou grandes obras",
    text: "De uma casa de banho a uma remodelação total, indique só o que precisa.",
  },
];

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero: the photo sits behind a navy gradient so the white text always reads. */}
      <section className="hero-photo relative isolate overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/95 via-ink-900/75 to-ink-900/40 sm:bg-gradient-to-r sm:from-ink-900/95 sm:via-ink-900/70 sm:to-ink-900/10"
        />
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:py-28">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Remodelações sem complicações</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Quer remodelar a sua casa?
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Cozinhas, casas de banho, quartos, escritórios ou garagens. Diga-nos o que pretende e receba propostas de
              profissionais da sua zona.
            </p>
            <div className="mt-8">
              <LinkButton href="/pedido/espacos" className="min-h-13 w-full px-7 text-lg shadow-lg shadow-ink-900/30 sm:w-auto">
                Pedir propostas grátis
              </LinkButton>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-center gap-1.5">
                  <span className="text-brand-300">
                    <Check />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20" aria-labelledby="espacos-heading">
        <h2 id="espacos-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          O que quer remodelar?
        </h2>
        <p className="mt-2 text-ink-700">Escolha por onde começar. Pode juntar vários espaços no mesmo pedido.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPACE_TYPES.map((type) => (
            <li key={type.id}>
              <Link
                href="/pedido/espacos"
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-ink-200 bg-white px-3 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <SpaceIcon type={type.id} className="size-8" />
                </span>
                <span className="font-medium leading-tight">{type.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-ink-200 bg-white" aria-labelledby="como-heading">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
          <h2 id="como-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-ink-700">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20" aria-labelledby="porque-heading">
        <h2 id="porque-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Porquê o Quero Renovar
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Check />
              </span>
              <h3 className="mt-4 font-semibold">{reason.title}</h3>
              <p className="mt-1 text-sm text-ink-700">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 rounded-3xl bg-brand-700 px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Pronto para começar?</h2>
            <p className="mt-1 text-white/85">Leva cerca de 2 minutos e não tem qualquer custo.</p>
          </div>
          <Link
            href="/pedido/espacos"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-7 text-lg font-medium text-brand-800 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700 sm:w-auto"
          >
            Pedir propostas grátis
          </Link>
        </div>
      </section>
    </>
  );
}
