import { HttpResponse, RequestHandler } from "msw";

export abstract class RestService<T extends { id: string | number }> {

  public abstract readonly apiVersion: string;
  protected abstract store: T[];

  public static readonly BASE_URL = "/api";
  public static readonly V1 = "/v1" as const;

  public static readonly MODELS = `${RestService.BASE_URL}${RestService.V1}/modello`;
  public static readonly SERVICE_TYPES = `${RestService.BASE_URL}${RestService.V1}/service-types`;
  public static readonly DEVICE_TYPES = `${RestService.BASE_URL}/device-types`;
  public static readonly MOBILE_PROVIDERS = `${RestService.BASE_URL}/mobile-providers`;
  public static readonly DEVICE_STATUSES = `${RestService.BASE_URL}/device-statuses`;
  public static readonly ASSEGNAZIONI = `${RestService.BASE_URL}/assegnazioni`;
  public static readonly ASSEGNATARI = `${RestService.BASE_URL}/assegnatari`;
  public static readonly DEVICE_MANAGEMENT = `${RestService.BASE_URL}/dispositivi-gestione`;
  public static readonly RIFERIMENTO = `${RestService.BASE_URL}/riferimento`;
  public static readonly CONVENTIONS = `${RestService.BASE_URL}/conventions`;

  public static readonly ACTION = {
    ALL: "all",
    INSERT: "Insert",
    UPDATE: "Update",
    DELETE: "Delete",
  } as const;

  public static readonly ENTITY = {
    MODELS: "modello",
    SERVICE_TYPES: "serviceType",
    DEVICE_TYPES: "deviceType",
    MOBILE_PROVIDERS: "mobileProvider",
    DEVICE_STATUSES: "deviceStatus",
    ASSEGNAZIONI: "assegnazioni",
    ASSEGNATARI: "assegnatari",
    DEVICE_MANAGEMENT: "deviceManagement",
    RIFERIMENTO: "riferimento",
    CONVENTIONS: "convention",
  } as const;

  protected DEFAULT_DELAY = 400;

  protected delay(ms: number = this.DEFAULT_DELAY) {
    return new Promise((r) => setTimeout(r, ms));
  }

  protected error(code: string, message: string, status: number) {
    return HttpResponse.json(
      { code, message, details: {} },
      { status }
    );
  }

  protected generateId(): number {
  if (this.store.length === 0) {
    return 1;
  }

  const ids = this.store.map((x) => x.id);
  const maxId = Math.max(...ids.map(Number));
  return maxId + 1;
}

  protected validateCreate?(body: unknown): string | null;
  protected validateUpdate?(body: unknown): string | null;

  public abstract getHandlers(): RequestHandler[];
}

