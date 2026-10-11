export { BookPage as default, metadata } from "@/_pages/book";

// Каталог читает мутабельный in-memory стор, поэтому рендерится на каждый запрос.
export const dynamic = "force-dynamic";
