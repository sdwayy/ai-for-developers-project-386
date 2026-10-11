import type { EventType } from "@/shared/api";
import { store, zEventType } from "@/shared/api/server";

export function GET(): Response {
  const eventTypes: EventType[] = zEventType.array().parse(store.eventTypes);

  return Response.json(eventTypes);
}
