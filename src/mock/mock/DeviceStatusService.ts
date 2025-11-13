import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { deviceStatuses } from "./data";
import type { DeviceStatus } from "../../types/types";
import { API } from "./api/endpoints";


export class DeviceStatusesService extends RestService<DeviceStatus> {
  public readonly apiVersion = "v1";
  protected store = deviceStatuses;

  public getHandlers() {
    return [
      http.get(API.deviceStatuses.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),

      http.post(API.deviceStatuses.create, async ({ request }) => {
        await this.delay(300);
        const body = (await request.json()) as Partial<DeviceStatus>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

         const newItem: DeviceStatus = {...body,id: Number(this.generateId()),} as DeviceStatus;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.deviceStatuses.update}`, async ({ params, request }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: DeviceStatus) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Stato non trovato.", 404);

         const body = (await request.json()) as Partial<DeviceStatus>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.deviceStatuses.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: DeviceStatus) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Stato non trovato.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}

