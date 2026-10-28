import type { ReactNode } from "react";
import { getRoomType, workLabelInRoom } from "@/catalog";
import { StatusBadge } from "@/components/ui/Notice";
import {
  describeAnswer,
  describeArea,
  isRoomComplete,
  roomDisplayName,
  roomGenericName,
  roomIssues,
  roomPendingItems,
  roomQuestions,
  roomWorkInclusions,
  type Project,
  type Room,
} from "@/domain/project";

interface RoomSummaryCardProps {
  project: Project;
  room: Room;
  /** Buttons or links shown in the card header (edit, remove). */
  actions?: ReactNode;
  /** Hide the title when the card sits under a heading that already names the room. */
  hideTitle?: boolean;
}

export function RoomSummaryCard({ project, room, actions, hideTitle }: RoomSummaryCardProps) {
  const type = getRoomType(room.type);
  const name = roomDisplayName(project, room);
  const generic = roomGenericName(project, room);
  const complete = isRoomComplete(room);
  const issues = roomIssues(room);
  const pending = roomPendingItems(room);
  const inclusions = roomWorkInclusions(room);
  const questions = roomQuestions(room);
  const answered = questions
    .map((q) => ({ q, text: describeAnswer(q, room.answers[q.id]) }))
    .filter((a): a is { q: (typeof questions)[number]; text: string } => a.text !== null);

  return (
    <article className="rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
      {!hideTitle && (
        <header className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{name}</h3>
            {name !== generic && <p className="text-sm text-ink-500">{generic}</p>}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge tone={complete ? "ok" : "pending"}>{complete ? "✓ Completa" : "Por preencher"}</StatusBadge>
            {actions}
          </div>
        </header>
      )}

      <dl className={`grid gap-3 text-sm ${hideTitle ? "" : "mt-4"}`}>
        {type.requiresDescription && (
          <div>
            <dt className="text-ink-500">Espaço</dt>
            <dd>{room.description.trim() || <span className="text-pending-700">Por descrever</span>}</dd>
          </div>
        )}
        <div>
          <dt className="text-ink-500">Área</dt>
          <dd>{describeArea(room)}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Trabalhos</dt>
          <dd>
            {room.works.length === 0 ? (
              <span className="text-pending-700">Nenhum trabalho escolhido</span>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                {room.works.map((w) => {
                  const includedBy = inclusions.find((i) => i.workId === w.workId)?.includedBy ?? [];
                  return (
                    <li key={w.workId}>
                      {workLabelInRoom(room.type, w.workId)}
                      {w.details.trim() && <span className="text-ink-700"> — {w.details.trim()}</span>}
                      {includedBy.length > 0 && (
                        <span className="block text-ink-500">
                          Incluído em «{includedBy.map((id) => workLabelInRoom(room.type, id)).join("», «")}»; contado uma vez.
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </dd>
        </div>
        {answered.length > 0 && (
          <div>
            <dt className="text-ink-500">Detalhes</dt>
            <dd>
              <ul className="space-y-1">
                {answered.map(({ q, text }) => (
                  <li key={q.id}>
                    <span className="text-ink-700">{q.text}</span> {text}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {room.notes.trim() && (
          <div>
            <dt className="text-ink-500">Observações</dt>
            <dd className="whitespace-pre-line">{room.notes.trim()}</dd>
          </div>
        )}
        {(issues.length > 0 || pending.length > 0) && (
          <div>
            <dt className="text-ink-500">Por confirmar</dt>
            <dd>
              <ul className="space-y-1">
                {issues.map((i) => (
                  <li key={i.id} className="text-pending-700">
                    {i.message}
                  </li>
                ))}
                {pending.map((p, i) => (
                  <li key={i}>{p.message}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
