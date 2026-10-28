"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROJECT_WORKS, workLabelInRoom } from "@/catalog";
import { Button, LinkButton } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Fieldset, TextAreaField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { RoomSummaryCard } from "@/components/wizard/RoomSummaryCard";
import { WizardLoading, WizardShell } from "@/components/wizard/WizardShell";
import { useProject } from "@/domain/ProjectProvider";
import {
  hasWork,
  OCCUPIED_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  projectIssues,
  projectWorkCoverage,
  roomDisplayName,
  roomPendingItems,
  TIMELINE_OPTIONS,
  type Room,
} from "@/domain/project";

/** Etapa 3 — editable summary, works common to the house and the minimum context for the works. */
export function ProjectReview() {
  const { project, ready, dispatch } = useProject();
  const router = useRouter();
  const [removing, setRemoving] = useState<Room | null>(null);
  const [resetting, setResetting] = useState(false);

  if (!ready) return <WizardLoading step="rever" />;

  if (project.rooms.length === 0) {
    return (
      <WizardShell step="rever" title="Rever o projeto">
        <Notice tone="info">Ainda não escolheu nenhuma divisão.</Notice>
        <div className="mt-6">
          <LinkButton href="/projeto/divisoes">Escolher divisões</LinkButton>
        </div>
      </WizardShell>
    );
  }

  const issues = projectIssues(project);
  const coverage = projectWorkCoverage(project);
  const totalWorks = project.rooms.reduce((n, r) => n + r.works.length, 0) + project.projectWorks.length;
  const totalPending = project.rooms.reduce((n, r) => n + roomPendingItems(r).length, 0);
  const { context } = project;

  return (
    <WizardShell
      step="rever"
      title="Rever o projeto"
      intro={
        <p>
          {project.rooms.length === 1 ? "1 divisão" : `${project.rooms.length} divisões`} ·{" "}
          {totalWorks === 1 ? "1 trabalho" : `${totalWorks} trabalhos`}
          {totalPending > 0 && ` · ${totalPending === 1 ? "1 item" : `${totalPending} itens`} por confirmar`}
        </p>
      }
    >
      <div className="grid gap-10">
        <section aria-labelledby="rooms-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="rooms-heading" className="text-xl font-semibold">
              Divisões
            </h2>
            <Link href="/projeto/divisoes" className="text-sm font-medium text-brand-700 hover:underline">
              Adicionar ou alterar divisões
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {project.rooms.map((room) => (
              <RoomSummaryCard
                key={room.id}
                project={project}
                room={room}
                actions={
                  <>
                    <Link
                      href={`/projeto/divisoes/${room.id}`}
                      className="rounded-lg px-2 py-1 text-sm font-medium text-brand-700 hover:bg-brand-50"
                    >
                      Editar<span className="sr-only"> {roomDisplayName(project, room)}</span>
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-sm font-medium text-ink-700 hover:bg-ink-100"
                      onClick={() => setRemoving(room)}
                    >
                      Remover<span className="sr-only"> {roomDisplayName(project, room)}</span>
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="common-heading">
          <h2 id="common-heading" className="text-xl font-semibold">
            Trabalhos comuns à casa
          </h2>
          <p className="mt-1 text-ink-500">
            Trabalhos que abrangem toda a habitação. Têm âmbito próprio e não são contados novamente em cada divisão.
          </p>
          <div className="mt-4 grid gap-2">
            {PROJECT_WORKS.map((work) => {
              const selected = hasWork({ works: project.projectWorks }, work.id);
              const covered = coverage.find((c) => c.projectWorkId === work.id)?.rooms ?? [];
              const details = project.projectWorks.find((w) => w.workId === work.id)?.details ?? "";
              return (
                <div key={work.id}>
                  <ChoiceCard
                    type="checkbox"
                    name="project-works"
                    value={work.id}
                    checked={selected}
                    onChange={(checked) => dispatch({ type: "setProjectWorkSelected", workId: work.id, selected: checked })}
                    title={work.label}
                    badge={work.requiresAssessment ? "Sujeito a avaliação" : undefined}
                    description={
                      <>
                        {work.help}
                        {covered.length > 0 && (
                          <span className="block text-pending-700">
                            Substitui{" "}
                            {covered
                              .map(
                                (c) =>
                                  `«${c.workIds.map((id) => workLabelInRoom(c.room.type, id)).join("», «")}» em ${roomDisplayName(
                                    project,
                                    c.room,
                                  )}`,
                              )
                              .join("; ")}
                            . Contado uma única vez.
                          </span>
                        )}
                      </>
                    }
                  />
                  {selected && work.freeText && (
                    <TextAreaField
                      id={`project-work-${work.id}`}
                      className="ml-8 mt-2"
                      label="Descreva o trabalho"
                      rows={2}
                      value={details}
                      onChange={(event) =>
                        dispatch({ type: "setProjectWorkDetails", workId: work.id, details: event.target.value })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="context-heading" className="grid gap-6">
          <div>
            <h2 id="context-heading" className="text-xl font-semibold">
              Onde é a obra?
            </h2>
            <p className="mt-1 text-ink-500">Só pedimos o necessário para estimar e procurar profissionais na sua zona.</p>
          </div>
          <TextField
            id="location"
            label="Localidade ou código postal"
            hint="Não precisamos da morada completa."
            placeholder="Ex.: 4000 Porto"
            autoComplete="postal-code"
            value={context.location}
            maxLength={80}
            onChange={(event) => dispatch({ type: "setContext", patch: { location: event.target.value } })}
          />
          <Fieldset legend="Tipo de imóvel">
            <div className="grid gap-2 sm:grid-cols-3">
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.id}
                  type="radio"
                  compact
                  name="property-type"
                  value={option.id}
                  checked={context.propertyType === option.id}
                  onChange={() => dispatch({ type: "setContext", patch: { propertyType: option.id } })}
                  title={option.label}
                />
              ))}
            </div>
          </Fieldset>
          <Fieldset legend="A casa está habitada durante a obra?">
            <div className="grid gap-2 sm:grid-cols-3">
              {OCCUPIED_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.id}
                  type="radio"
                  compact
                  name="occupied"
                  value={option.id}
                  checked={context.occupied === option.id}
                  onChange={() => dispatch({ type: "setContext", patch: { occupied: option.id } })}
                  title={option.label}
                />
              ))}
            </div>
          </Fieldset>
          <Fieldset legend="Quando gostaria de fazer a obra?">
            {TIMELINE_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.id}
                type="radio"
                compact
                name="timeline"
                value={option.id}
                checked={context.timeline === option.id}
                onChange={() => dispatch({ type: "setContext", patch: { timeline: option.id } })}
                title={option.label}
              />
            ))}
          </Fieldset>
          <TextAreaField
            id="access"
            label="Condições de acesso"
            optional
            hint="Ex.: 3.º andar sem elevador, rua estreita, estacionamento difícil."
            rows={2}
            value={context.access}
            onChange={(event) => dispatch({ type: "setContext", patch: { access: event.target.value } })}
          />
        </section>

        <section aria-labelledby="next-heading">
          <h2 id="next-heading" className="sr-only">
            Continuar
          </h2>
          {issues.length > 0 ? (
            <Notice tone="pending" title="Antes de ver a estimativa">
              <ul className="list-disc space-y-1 pl-5">
                {issues.map((issue, i) => (
                  <li key={i}>
                    {issue.roomId ? (
                      <Link href={`/projeto/divisoes/${issue.roomId}`} className="font-medium underline">
                        {issue.message}
                      </Link>
                    ) : (
                      issue.message
                    )}
                  </li>
                ))}
              </ul>
            </Notice>
          ) : (
            <Notice tone="ok">
              O projeto está pronto para a estimativa. Consultar a estimativa não envia o projeto nem partilha contactos.
            </Notice>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={() => setResetting(true)}>
              Apagar e recomeçar
            </Button>
            {issues.length === 0 ? (
              <LinkButton href="/projeto/estimativa">Ver estimativa e profissionais</LinkButton>
            ) : (
              <Button disabled>Ver estimativa e profissionais</Button>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={removing !== null}
        title="Remover divisão?"
        description={
          removing
            ? `${roomDisplayName(project, removing)} e as suas respostas serão apagadas. As restantes divisões não são alteradas.`
            : ""
        }
        confirmLabel="Remover"
        destructive
        onConfirm={() => {
          if (removing) dispatch({ type: "removeRoom", roomId: removing.id });
          setRemoving(null);
        }}
        onCancel={() => setRemoving(null)}
      />
      <ConfirmDialog
        open={resetting}
        title="Apagar o projeto?"
        description="Todas as divisões, trabalhos e respostas guardadas neste dispositivo serão apagados."
        confirmLabel="Apagar tudo"
        destructive
        onConfirm={() => {
          dispatch({ type: "reset" });
          setResetting(false);
          router.push("/");
        }}
        onCancel={() => setResetting(false)}
      />
    </WizardShell>
  );
}
