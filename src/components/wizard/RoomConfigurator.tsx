"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Dispatch, ReactNode } from "react";
import { areaRangeLabel, getRoomType, workLabelInRoom, worksForRoomType, type Question } from "@/catalog";
import { LinkButton } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Fieldset, TextAreaField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { RoomSummaryCard } from "@/components/wizard/RoomSummaryCard";
import { WizardLoading, WizardShell } from "@/components/wizard/WizardShell";
import { useProject } from "@/domain/ProjectProvider";
import {
  hasWork,
  isOpenRange,
  isRoomComplete,
  roomDisplayName,
  roomGenericName,
  roomQuestions,
  roomWorkInclusions,
  type Answer,
  type AreaAnswer,
  type Project,
  type ProjectAction,
  type Room,
} from "@/domain/project";

/** Etapa 2 — configure one room: area, works, details, brief review. */
export function RoomConfigurator() {
  const { roomId } = useParams<{ roomId: string }>();
  const { project, ready, dispatch } = useProject();

  if (!ready) return <WizardLoading step="configurar" />;

  const index = project.rooms.findIndex((r) => r.id === roomId);
  if (index === -1) {
    return (
      <WizardShell step="configurar" title="Divisão não encontrada">
        <Notice tone="error">Esta divisão já não faz parte do projeto ou o endereço está incorreto.</Notice>
        <div className="mt-6">
          <LinkButton href="/projeto/divisoes" variant="secondary">
            Voltar às divisões
          </LinkButton>
        </div>
      </WizardShell>
    );
  }

  const room = project.rooms[index];
  const type = getRoomType(room.type);
  const previous = project.rooms[index - 1];
  const next = project.rooms[index + 1];

  return (
    <WizardShell
      step="configurar"
      title={`Divisão ${index + 1} de ${project.rooms.length} — ${roomDisplayName(project, room)}`}
      intro={<RoomSwitcher project={project} current={room} />}
    >
      <div className="grid gap-10">
        <TextField
          id={`name-${room.id}`}
          label="Nome da divisão"
          optional
          hint={`Para a distinguir no resumo. Sem nome fica «${roomGenericName(project, room)}».`}
          placeholder="Ex.: Casa de banho da suite"
          value={room.name}
          maxLength={60}
          onChange={(event) => dispatch({ type: "renameRoom", roomId: room.id, name: event.target.value })}
        />

        {type.requiresDescription && (
          <Section title="Que espaço é este?" hint="Diga-nos o que é e como o usa.">
            <TextAreaField
              id={`description-${room.id}`}
              label="Descrição do espaço"
              placeholder="Ex.: escritório pequeno junto à sala, com uma janela"
              value={room.description}
              rows={2}
              onChange={(event) => dispatch({ type: "setRoomDescription", roomId: room.id, description: event.target.value })}
            />
          </Section>
        )}

        <AreaSection room={room} dispatch={dispatch} />
        <WorksSection room={room} dispatch={dispatch} />
        <DetailsSection room={room} dispatch={dispatch} />

        <Section title="Observações" hint="Qualquer informação útil para quem vai avaliar o trabalho.">
          <TextAreaField
            id={`notes-${room.id}`}
            label="Observações"
            optional
            placeholder="Ex.: a parede do duche tem humidade; quero manter o móvel atual"
            value={room.notes}
            onChange={(event) => dispatch({ type: "setNotes", roomId: room.id, notes: event.target.value })}
          />
        </Section>

        <Section title="Resumo desta divisão" hint="Pode alterar qualquer escolha acima antes de continuar.">
          <RoomSummaryCard project={project} room={room} hideTitle />
          {!isRoomComplete(room) && (
            <Notice tone="pending" className="mt-3">
              Pode continuar, mas esta divisão ficará assinalada como «por preencher» até indicar a área e pelo menos um
              trabalho.
            </Notice>
          )}
        </Section>
      </div>

      <nav
        aria-label="Navegar entre divisões"
        className="sticky bottom-0 -mx-4 mt-8 border-t border-ink-200 bg-surface/95 px-4 py-3 backdrop-blur"
      >
        <div className="flex items-center justify-between gap-3">
          {previous ? (
            <LinkButton href={`/projeto/divisoes/${previous.id}`} variant="secondary">
              Anterior
            </LinkButton>
          ) : (
            <LinkButton href="/projeto/divisoes" variant="secondary">
              Divisões
            </LinkButton>
          )}
          {next ? (
            <LinkButton href={`/projeto/divisoes/${next.id}`}>Divisão seguinte</LinkButton>
          ) : (
            <LinkButton href="/projeto/rever">Rever o projeto</LinkButton>
          )}
        </div>
      </nav>
    </WizardShell>
  );
}

// ---------------------------------------------------------------------------

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-ink-500">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RoomSwitcher({ project, current }: { project: Project; current: Room }) {
  return (
    <ol className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Divisões do projeto">
      {project.rooms.map((room) => {
        const complete = isRoomComplete(room);
        const isCurrent = room.id === current.id;
        return (
          <li key={room.id} className="shrink-0">
            <Link
              href={`/projeto/divisoes/${room.id}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                isCurrent ? "border-brand-600 bg-brand-50 font-medium text-brand-800" : "border-ink-200 bg-white text-ink-700"
              }`}
            >
              {complete && <span aria-hidden="true">✓</span>}
              {roomDisplayName(project, room)}
              <span className="sr-only">{complete ? " (completa)" : " (por preencher)"}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

interface SectionProps {
  room: Room;
  dispatch: Dispatch<ProjectAction>;
}

function AreaSection({ room, dispatch }: SectionProps) {
  const type = getRoomType(room.type);
  const name = `area-${room.id}`;
  const area = room.area;
  const set = (value: AreaAnswer | null) => dispatch({ type: "setArea", roomId: room.id, area: value });

  return (
    <Section title="Área aproximada" hint="Área do chão. Se não souber, pode continuar na mesma.">
      <div className="grid gap-2 sm:grid-cols-2">
        {type.areaRanges.map((range) => (
          <ChoiceCard
            key={range.id}
            type="radio"
            compact
            name={name}
            value={range.id}
            checked={area?.kind === "range" && area.rangeId === range.id}
            onChange={() => set({ kind: "range", rangeId: range.id })}
            title={areaRangeLabel(range)}
          />
        ))}
      </div>
      <div className="mt-2 grid gap-2">
        <ChoiceCard
          type="radio"
          compact
          name={name}
          value="exact"
          checked={area?.kind === "exact"}
          onChange={() => set({ kind: "exact", squareMeters: null })}
          title="Sei a área exata"
          description="Indique os metros quadrados do chão."
        />
        {area?.kind === "exact" && (
          <TextField
            id={`exact-${room.id}`}
            className="ml-8"
            label="Área em m²"
            type="number"
            inputMode="decimal"
            min={1}
            max={500}
            step={0.5}
            suffix="m²"
            value={area.squareMeters ?? ""}
            onChange={(event) => {
              const value = Number(event.target.value);
              set({ kind: "exact", squareMeters: event.target.value === "" || value <= 0 ? null : value });
            }}
          />
        )}
        <ChoiceCard
          type="radio"
          compact
          name={name}
          value="unknown"
          checked={area?.kind === "unknown"}
          onChange={() => set({ kind: "unknown" })}
          title="Não sei a área"
          description="Pode continuar a descrever o projeto. Esta parte fica por confirmar."
        />
      </div>
      {isOpenRange(room) && (
        <Notice tone="pending" className="mt-3">
          Num intervalo aberto não assumimos uma área máxima. Se souber uma aproximação, escolha «Sei a área exata»; caso
          contrário, a parte da estimativa que depende da medida fica por avaliar.
        </Notice>
      )}
    </Section>
  );
}

function WorksSection({ room, dispatch }: SectionProps) {
  const options = worksForRoomType(room.type);
  const inclusions = roomWorkInclusions(room);

  return (
    <Section title="Que trabalhos pretende?" hint="Pode escolher vários. O detalhe técnico fica para os profissionais.">
      <div className="grid gap-2">
        {options.map(({ work, label }) => {
          const selected = hasWork(room, work.id);
          const includedBy = inclusions.find((i) => i.workId === work.id)?.includedBy ?? [];
          const details = room.works.find((w) => w.workId === work.id)?.details ?? "";
          return (
            <div key={work.id}>
              <ChoiceCard
                type="checkbox"
                name={`works-${room.id}`}
                value={work.id}
                checked={selected}
                onChange={(checked) =>
                  dispatch({ type: "setWorkSelected", roomId: room.id, workId: work.id, selected: checked })
                }
                title={label}
                badge={work.requiresAssessment ? "Sujeito a avaliação" : undefined}
                description={
                  work.help || work.implies || includedBy.length > 0 ? (
                    <>
                      {work.help}
                      {work.implies && (
                        <span className="block">
                          Inclui normalmente: {work.implies.map((id) => workLabelInRoom(room.type, id).toLowerCase()).join(", ")}.
                        </span>
                      )}
                      {includedBy.length > 0 && (
                        <span className="block text-pending-700">
                          Incluído em «{includedBy.map((id) => workLabelInRoom(room.type, id)).join("», «")}». Não precisa de
                          o selecionar; contamos uma única vez.
                        </span>
                      )}
                    </>
                  ) : undefined
                }
              />
              {selected && work.freeText && (
                <TextAreaField
                  id={`details-${room.id}-${work.id}`}
                  className="ml-8 mt-2"
                  label={work.id === "ajuda-decidir" ? "Quais são as suas dúvidas?" : "Descreva o trabalho"}
                  rows={2}
                  value={details}
                  onChange={(event) =>
                    dispatch({ type: "setWorkDetails", roomId: room.id, workId: work.id, details: event.target.value })
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function DetailsSection({ room, dispatch }: SectionProps) {
  const questions = roomQuestions(room);
  if (questions.length === 0) return null;
  return (
    <Section title="Alguns detalhes" hint="Só perguntamos o que afeta os trabalhos que escolheu.">
      <div className="grid gap-6">
        {questions.map((question) => (
          <QuestionField key={question.id} room={room} question={question} dispatch={dispatch} />
        ))}
      </div>
    </Section>
  );
}

function QuestionField({ room, question, dispatch }: SectionProps & { question: Question }) {
  const answer = room.answers[question.id];
  const set = (value: Answer | null) =>
    dispatch({ type: "setAnswer", roomId: room.id, questionId: question.id, answer: value });

  if (question.kind === "single") {
    return (
      <Fieldset legend={question.text} hint={question.help}>
        {question.options.map((option) => (
          <ChoiceCard
            key={option.id}
            type="radio"
            compact
            name={`${room.id}-${question.id}`}
            value={option.id}
            checked={answer?.kind === "choice" && answer.optionId === option.id}
            onChange={() => set({ kind: "choice", optionId: option.id })}
            title={option.label}
          />
        ))}
      </Fieldset>
    );
  }

  const unknown = answer?.kind === "unknown";
  const inputId = `${room.id}-${question.id}`;
  return (
    <div>
      <TextField
        id={inputId}
        label={question.text}
        hint={question.help}
        type="number"
        inputMode="decimal"
        min={question.min}
        max={question.max}
        step={0.1}
        suffix={question.unit === "m" ? "m" : "m²"}
        disabled={unknown}
        value={answer?.kind === "number" ? answer.value : ""}
        onChange={(event) => {
          const value = Number(event.target.value);
          set(event.target.value === "" || value <= 0 ? null : { kind: "number", value });
        }}
      />
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-brand-600"
          checked={unknown}
          onChange={(event) => set(event.target.checked ? { kind: "unknown" } : null)}
        />
        {question.unknownLabel}
      </label>
    </div>
  );
}
