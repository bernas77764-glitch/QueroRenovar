"use client";

import { getSpecialty } from "@/catalog";
import { Button, LinkButton } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { WizardLoading, WizardShell } from "@/components/wizard/WizardShell";
import { useProject } from "@/domain/ProjectProvider";
import { projectIssues, projectSpecialties, roomPendingItems } from "@/domain/project";

/**
 * Etapa 4 — placeholder. The estimator needs a validated price table before any
 * value is shown (documento-base §7), so this screen says what is coming and
 * what already results from the client's choices, without inventing figures.
 */
export function EstimatePlaceholder() {
  const { project, ready } = useProject();

  if (!ready) return <WizardLoading step="estimativa" />;

  const issues = projectIssues(project);
  if (issues.length > 0) {
    return (
      <WizardShell step="estimativa" title="Estimativa e profissionais">
        <Notice tone="pending">Complete a revisão do projeto antes de ver a estimativa.</Notice>
        <div className="mt-6">
          <LinkButton href="/projeto/rever" variant="secondary">
            Voltar à revisão
          </LinkButton>
        </div>
      </WizardShell>
    );
  }

  const totalPending = project.rooms.reduce((n, r) => n + roomPendingItems(r).length, 0);
  const specialties = projectSpecialties(project);

  return (
    <WizardShell
      step="estimativa"
      title="Estimativa e profissionais"
      intro={<p>O seu pedido está organizado. A estimativa de custo ainda não está disponível nesta versão.</p>}
    >
      <div className="grid gap-8">
        <Notice tone="info" title="Em desenvolvimento">
          <p>
            A estimativa precisa de uma tabela de preços validada com profissionais antes de apresentar valores. Quando
            estiver disponível, verá aqui um intervalo indicativo, a desagregação por divisão, os trabalhos incluídos e
            excluídos, o tratamento do IVA e as parcelas por avaliar.
          </p>
          {totalPending > 0 && (
            <p className="mt-2">
              O seu projeto tem {totalPending === 1 ? "1 item" : `${totalPending} itens`} por confirmar; nessa parte a
              estimativa será parcial.
            </p>
          )}
        </Notice>

        <section aria-labelledby="specialties-heading">
          <h2 id="specialties-heading" className="text-xl font-semibold">
            Especialidades que resultam das suas escolhas
          </h2>
          <p className="mt-1 text-ink-500">
            Proposta inicial a partir dos trabalhos escolhidos. Uma empresa de remodelações pode cobrir várias destas
            competências; não tem de contratar cada uma separadamente.
          </p>
          <ul className="mt-4 grid gap-2">
            {specialties.map(({ specialtyId, reasons }) => {
              const specialty = getSpecialty(specialtyId);
              return (
                <li key={specialtyId} className="rounded-xl border border-ink-200 bg-white p-4">
                  <p className="font-medium">{specialty.label}</p>
                  <p className="text-sm text-ink-500">Para: {reasons.join(", ").toLowerCase()}.</p>
                </li>
              );
            })}
          </ul>
        </section>

        <Notice tone="ok">
          Nada foi enviado. Consultar esta página não partilha o seu projeto nem os seus contactos. O pedido de propostas
          a profissionais será o próximo passo, com confirmação explícita.
        </Notice>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LinkButton href="/projeto/rever" variant="secondary">
            Alterar o projeto
          </LinkButton>
          <Button disabled title="Disponível numa próxima versão">
            Quero receber propostas
          </Button>
        </div>
      </div>
    </WizardShell>
  );
}
