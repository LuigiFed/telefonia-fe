import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { mobileProviders } from "./data";
import type { MobileProvider } from "../../types/types";
import { API } from "./api/endpoints";


export class MobileProvidersService extends RestService<MobileProvider> {
  public readonly apiVersion = "v1";
  protected store = mobileProviders;

  public getHandlers() {
    return [
      http.get(API.mobileProviders.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),

      http.post(API.mobileProviders.create, async ({ request }) => {
        await this.delay(300);
        const body = (await request.json()) as Partial<MobileProvider>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

       const newItem: MobileProvider = {...body,id: Number(this.generateId()),} as MobileProvider;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

       http.put(`${API.mobileProviders.update}`, async ({ params, request }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x : MobileProvider) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Provider non trovato.", 404);

         const body = (await request.json()) as Partial<MobileProvider>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.mobileProviders.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: MobileProvider) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Provider non trovato.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}