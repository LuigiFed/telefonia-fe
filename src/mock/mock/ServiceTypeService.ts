import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { assegnazioni, serviceType } from "./data";
import type { ServiceType } from "../../types/types";
import { API } from "./api/endpoints";


export class ServiceTypeService extends RestService<ServiceType> {
  public readonly apiVersion = "v1";
  protected store = serviceType;

  protected validateCreate = (body: Partial<ServiceType>): string | null => {
    if (!body.descrizione || body.descrizione.trim() === "") {
      return "Il campo descrizione è obbligatorio e non può essere vuoto.";
    }

    return null;
  };

  public getHandlers() {
    return [
      // LIST
      http.get(API.serviceTypes.list, async () => {
        await this.delay(500);
        return HttpResponse.json(this.store);
      }),

      // CREATE
      http.post(API.serviceTypes.create, async ({ request }) => {
        await this.delay(500);
        const body = (await request.json()) as Partial<ServiceType>;
        if (!body || typeof body !== "object") {
          return this.error("VALIDATION_ERROR", "Payload non valido.", 400);
        }

        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

        const newItem: ServiceType = {
          ...body,
          id: Number(this.generateId()),
        } as ServiceType;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.serviceTypes.update}`, async ({ params, request }) =>  {
        await this.delay(500);
        const id = Number(params.id);
        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1)
          return this.error("NOT_FOUND", "Servizio non trovato.", 404);

        const body = (await request.json()) as Partial<ServiceType>;
        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),


      http.delete(`${API.serviceTypes.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1)
          return this.error("NOT_FOUND", "Servizio non trovato.", 404);

        const servizio = this.store[index];
        const usato = assegnazioni.some((a) => a.modello === servizio.descrizione);
        if (usato) {
          return this.error(
            "REFERENCE_ERROR",
            "Impossibile eliminare: il servizio è referenziato in assegnazioni.",
            409
          );
        }

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}