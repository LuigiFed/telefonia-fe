import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { deviceTypes } from "./data";
import type { DeviceType } from "../../types/types";
import { API } from "./api/endpoints";


export class DeviceTypesService extends RestService<DeviceType> {
  public readonly apiVersion = "v1";
  protected store = deviceTypes;

  public getHandlers() {
    return [
       http.get(API.deviceTypes.list, async () => {
        await this.delay(500);
        return HttpResponse.json(this.store);
      }),

      http.post(API.deviceTypes.create, async ({ request }) => {
        await this.delay(500);
         const body = (await request.json()) as Partial<DeviceType>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

        const newItem: DeviceType = {...body,id: Number(this.generateId()),} as DeviceType;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.deviceTypes.update}`, async ({ params, request }) => {
        await this.delay(500);
        const id = Number(params.id);
        const index = this.store.findIndex((x: DeviceType) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Tipo dispositivo non trovato.", 404);

         const body = (await request.json()) as Partial<DeviceType>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.deviceTypes.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: DeviceType) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Tipo dispositivo non trovato.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}