import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { assegnazioni, devices } from "./data";
import type {DeviceModel } from "../../types/types";
import { API } from "./api/endpoints";




export class ModelsService extends RestService<DeviceModel> {
  public readonly apiVersion = "v1";
  protected store = devices;

  protected validateCreate = (body: Partial<DeviceModel>): string | null => {
    if (!body.desModello || !body.desModello.trim()) {
      return "Il campo desModello è obbligatorio.";
    }
    return null;
  };

  public getHandlers() {
    return [
      // LIST
      http.get(API.deviceModels.list, async () => {
        await this.delay(500);
        return HttpResponse.json(this.store);
      }),

      // CREATE
       http.post(API.deviceModels.create, async ({ request }) => {
        await this.delay(500);
        const body = (await request.json()) as Partial<DeviceModel>;
        if (!body || typeof body !== "object") {
          return this.error("VALIDATION_ERROR", "Payload non valido.", 400);
        }

        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

        const newItem: DeviceModel = { ...body,id: Number(this.generateId()),} as DeviceModel;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      // UPDATE
      http.put(`${API.deviceModels.update}`, async ({ params, request }) => {
        await this.delay(500);
        const id = Number(params.id);
        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Modello non trovato.", 404);

        const body = (await request.json()) as Partial<DeviceModel>;
        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      // DELETE + VALIDAZIONE RIFERIMENTI
       http.delete(`${API.deviceModels.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Modello non trovato.", 404);

        const modello = this.store[index];
        const usato = assegnazioni.some((a) => a.modello === modello.desModello);
        if (usato) {
          return this.error(
            "REFERENCE_ERROR",
            "Impossibile eliminare: il modello è referenziato in assegnazioni.",
            409
          );
        }

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}