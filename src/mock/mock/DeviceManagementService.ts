import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { deviceManagement } from "./data";
import type { DeviceManagement } from "../../types/types";
import { API } from "./api/endpoints";


export class DeviceManagementService extends RestService<DeviceManagement> {
  public readonly apiVersion = "v1";
  protected store = deviceManagement;

  public getHandlers() {
    return [
      http.get(API.deviceManagement.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),

      http.post(API.deviceManagement.create, async ({ request }) => {
        await this.delay(300);
         const body = (await request.json()) as Partial<DeviceManagement>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

        const newItem: DeviceManagement = {...body,id: Number(this.generateId()),} as DeviceManagement;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.deviceManagement.update}`, async ({ params, request }) => {
        await this.delay(300);
        const id = String(params.id);
        const idNum = Number(id);
        const index = this.store.findIndex((x: DeviceManagement) => x.id === idNum);
        if (index === -1) return this.error("NOT_FOUND", "Dispositivo non trovato.", 404);

         const body = (await request.json()) as Partial<DeviceManagement>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.deviceManagement.delete}`, async ({ params }) => {
        await this.delay(300);
        const idParam = params.id;
        const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
        const id = Number(idStr);
        const index = this.store.findIndex((x: DeviceManagement) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Dispositivo non trovato.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}