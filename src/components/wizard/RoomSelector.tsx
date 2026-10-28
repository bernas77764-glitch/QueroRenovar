"use client";

import { useState } from "react";
import { ROOM_TYPES, type RoomTypeId } from "@/catalog";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Counter } from "@/components/ui/Counter";
import { TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { WizardLoading, WizardShell } from "@/components/wizard/WizardShell";
import { useProject } from "@/domain/ProjectProvider";
import {
  countRoomsOfType,
  isRoomComplete,
  isRoomConfigured,
  MAX_ROOMS_PER_TYPE,
  roomGenericName,
  type ProjectAction,
  type Room,
} from "@/domain/project";

/** Etapa 1 — choose room types and quantities. Everything starts at zero. */
export function RoomSelector() {
  const { project, ready, dispatch } = useProject();
  const [pending, setPending] = useState<{ action: ProjectAction; rooms: Room[] } | null>(null);
  const [wholeHouseHint, setWholeHouseHint] = useState(false);

  if (!ready) return <WizardLoading step="divisoes" />;

  /** Dispatches directly, or asks first when configured rooms would be removed. */
  const removeWithConfirmation = (action: ProjectAction, rooms: Room[]) => {
    if (rooms.some(isRoomConfigured)) setPending({ action, rooms });
    else dispatch(action);
  };

  const setCount = (type: RoomTypeId, count: number) => {
    const current = countRoomsOfType(project, type);
    if (count >= current) {
      dispatch({ type: "setRoomCount", roomType: type, count });
      return;
    }
    const ofType = project.rooms.filter((r) => r.type === type);
    removeWithConfirmation({ type: "setRoomCount", roomType: type, count }, ofType.slice(count));
  };

  const total = project.rooms.length;
  const firstToConfigure = project.rooms.find((r) => !isRoomComplete(r)) ?? project.rooms[0];

  return (
    <WizardShell
      step="divisoes"
      title="O que quer renovar?"
      intro={<p>Indique quantas divisões de cada tipo quer renovar. Configura cada uma a seguir, uma de cada vez.</p>}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">Comece por uma divisão ou escolha várias.</p>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch({ type: "applyWholeHouse" });
            setWholeHouseHint(true);
          }}
        >
          Uma casa inteira
        </Button>
      </div>

      {wholeHouseHint && (
        <Notice tone="info" className="mt-3">
          Acrescentámos as divisões mais comuns. Confirme as divisões e as quantidades: não assumimos que tudo será
          substituído, e os trabalhos são escolhidos divisão a divisão.
        </Notice>
      )}

      <div className="mt-4 grid gap-2">
        {ROOM_TYPES.map((type) => (
          <Counter
            key={type.id}
            id={`count-${type.id}`}
            label={type.label}
            description={type.description}
            value={countRoomsOfType(project, type.id)}
            max={MAX_ROOMS_PER_TYPE}
            onChange={(count) => setCount(type.id, count)}
          />
        ))}
      </div>

      {total > 0 && (
        <section className="mt-8" aria-labelledby="rooms-heading">
          <h2 id="rooms-heading" className="font-semibold">
            {total === 1 ? "1 divisão" : `${total} divisões`} a configurar
          </h2>
          <p className="mt-1 text-sm text-ink-500">Pode dar um nome a cada divisão para as distinguir (opcional).</p>
          <ul className="mt-3 grid gap-2">
            {project.rooms.map((room) => {
              const generic = roomGenericName(project, room);
              return (
                <li key={room.id} className="flex items-end gap-2 rounded-xl border border-ink-200 bg-white p-3">
                  <TextField
                    id={`name-${room.id}`}
                    className="flex-1"
                    label={generic}
                    optional
                    placeholder="Ex.: Casa de banho da suite"
                    value={room.name}
                    maxLength={60}
                    onChange={(event) => dispatch({ type: "renameRoom", roomId: room.id, name: event.target.value })}
                  />
                  <Button
                    variant="ghost"
                    aria-label={`Remover ${room.name.trim() || generic}`}
                    onClick={() => removeWithConfirmation({ type: "removeRoom", roomId: room.id }, [room])}
                  >
                    Remover
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LinkButton href="/" variant="ghost">
          Voltar ao início
        </LinkButton>
        {firstToConfigure ? (
          <LinkButton href={`/projeto/divisoes/${firstToConfigure.id}`}>Continuar</LinkButton>
        ) : (
          <Button disabled aria-describedby="continue-hint">
            Continuar
          </Button>
        )}
      </div>
      {!firstToConfigure && (
        <p id="continue-hint" className="mt-2 text-right text-sm text-ink-500">
          Escolha pelo menos uma divisão para continuar.
        </p>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending && pending.rooms.length > 1 ? "Remover divisões preenchidas?" : "Remover divisão preenchida?"}
        description={
          pending
            ? `${pending.rooms.map((r) => r.name.trim() || roomGenericName(project, r)).join(", ")}: as respostas desta${
                pending.rooms.length > 1 ? "s divisões" : " divisão"
              } serão apagadas. As restantes divisões não são alteradas.`
            : ""
        }
        confirmLabel="Remover"
        destructive
        onConfirm={() => {
          if (pending) dispatch(pending.action);
          setPending(null);
        }}
        onCancel={() => setPending(null)}
      />
    </WizardShell>
  );
}
