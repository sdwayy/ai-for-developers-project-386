import { store } from "@/shared/api/server";
import { BookView } from "../BookView";

export function BookPage() {
  return <BookView eventTypes={store.eventTypes} host={store.host} />;
}
