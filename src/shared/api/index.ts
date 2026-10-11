/**
 * Публичный API слайса `shared/api`: рукописный фасад поверх сгенерированного
 * контракта. Фичи и страницы ходят только сюда, чтобы форма машинного вывода и
 * базовый адрес API не протекали в UI.
 */
export const apiBaseUrl = "/api";

export type { ErrorCode, ErrorResponse, EventType } from "./generated/types.gen";
