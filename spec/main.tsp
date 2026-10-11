import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Календарь звонков" })
@info(#{ version: "1.0.0" })
namespace Calendar;

@doc("Тип встречи, выбираемый при бронировании. Публичный идентификатор генерирует сервер из названия.")
model EventType {
  @doc("Публичный идентификатор типа; генерируется сервером, в запросе на создание не принимается.")
  id: string;

  @doc("Название типа встречи.")
  @maxLength(100)
  title: string;

  @doc("Описание типа встречи.")
  @maxLength(500)
  description?: string;

  @doc("Длительность встречи в минутах.")
  @minValue(5)
  @maxValue(480)
  durationMinutes: int32;
}

@doc("Код ошибки API. Интерфейс отображает его в русский текст.")
enum ErrorCode {
  @doc("Некорректный ввод.")
  invalidInput: "invalid-input",

  @doc("Тип встречи не найден.")
  unknownEventType: "unknown-event-type",

  @doc("Слот уже занят.")
  slotUnavailable: "slot-unavailable",

  @doc("Дата вне окна записи.")
  slotOutOfWindow: "slot-out-of-window",

  @doc("У типа встречи есть предстоящие записи.")
  eventTypeInUse: "event-type-in-use",
}

@doc("Ответ с ошибкой. Поле message техническое и не показывается пользователю.")
@error
model ErrorResponse {
  @doc("HTTP-статус ошибки.")
  @statusCode
  statusCode: 400 | 404 | 409;

  @doc("Код ошибки.")
  code: ErrorCode;

  @doc("Техническое сообщение об ошибке.")
  message: string;
}

@doc("Операции над типами встреч.")
@route("/event-types")
interface EventTypes {
  @doc("Список типов встреч в порядке создания.")
  @get list(): EventType[];
}
