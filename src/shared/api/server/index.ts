import "server-only";

import type { EventType } from "../generated/types.gen";

export type Store = {
  eventTypes: EventType[];
};

/**
 * In-memory хранилище сервиса. Заменяет базу данных: состояние живёт в процессе
 * и сбрасывается при его перезапуске. Сиды и операции каталога появятся вместе
 * с первым экраном, который их читает.
 */
export function createStore(): Store {
  return { eventTypes: [] };
}
