import "server-only";

import type { EventType } from "../generated/types.gen";

export type Host = {
  name: string;
};

export type Store = {
  eventTypes: EventType[];
  host: Host;
};

const SEED_EVENT_TYPES: readonly EventType[] = [
  {
    id: "15min",
    title: "Встреча 15 минут",
    description: "Короткий тип события для быстрого слота.",
    durationMinutes: 15,
  },
  {
    id: "30min",
    title: "Встреча 30 минут",
    description: "Базовый тип события для бронирования.",
    durationMinutes: 30,
  },
];

const SEED_HOST: Host = { name: "Host" };

/**
 * In-memory хранилище сервиса. Заменяет базу данных: состояние живёт в процессе
 * и сбрасывается при его перезапуске.
 */
export function createStore(): Store {
  return {
    eventTypes: SEED_EVENT_TYPES.map((eventType) => ({ ...eventType })),
    host: { ...SEED_HOST },
  };
}

/**
 * Общий стор процесса. Хранится на `globalThis`, потому что Next собирает Server
 * Components и Route Handlers в разные графы модулей: обычный модульный синглтон
 * дал бы каждой стороне свою копию стора.
 */
const globalStore = globalThis as typeof globalThis & {
  calendarStore?: Store;
};

export const store: Store = (globalStore.calendarStore ??= createStore());

export { zEventType } from "../generated/zod.gen";
