import { http, HttpResponse } from "msw";
import { assegnazioni } from "./data";
import { RestService } from "./RestService";
import type { Device } from "../../types/types";
import { API } from "./api/endpoints";

export class AssignmentsService extends RestService<Device> {
  public readonly apiVersion = "v1";
  protected store = assegnazioni;

  public getHandlers() {
    return [

      http.get(API.assegnazioni.list, async ({ request }) => {
        await this.delay(300);
        const url = new URL(request.url);
        const utenteIdParam = url.searchParams.get("utenteId");
        const utenteId = Number(utenteIdParam);
        const filtered = utenteId
          ? this.store.filter((a) => a.utenteId == utenteId)
          : this.store;
        return HttpResponse.json(filtered);
      }),


      http.post(API.assegnazioni.create, async ({ request }) => {
        await this.delay(300);
        const body = (await request.json()) as Partial<Device>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

        const newItem: Device = {
          ...body,
          id: Number(this.generateId()), 
        } as Device;

        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

    
       http.put(`${API.assegnazioni.update}`, async ({ params, request }) => {
        await this.delay(300);

        const idParam = params.id;
        const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
        const id = Number(idStr);
        if (Number.isNaN(id)) return this.error("BAD_REQUEST", "Invalid ID", 400);

        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Assegnazione non trovata.", 404);

        const body = (await request.json()) as Partial<Device>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.assegnazioni.delete}`, async ({ params }) => {
        await this.delay(300);

        const idParam = params.id;
        const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
        const id = Number(idStr);
        if (Number.isNaN(id)) return this.error("BAD_REQUEST", "Invalid ID", 400);

        const index = this.store.findIndex((x) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Assegnazione non trovata.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}