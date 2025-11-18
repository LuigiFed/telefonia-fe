import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { convention } from "./data";
import type { Convention} from "../../types/types";
import { API } from "./api/endpoints";


export class ConventionService extends RestService<Convention> {
  public readonly apiVersion = "v1";
  protected store = convention;

  public getHandlers() {
    return [
      http.get(API.convention.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),

      http.post(API.convention.create, async ({ request }) => {
        await this.delay(300);
        const body = (await request.json()) as Partial<Convention>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

         const newItem: Convention = {...body,id: Number(this.generateId()),} as Convention;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.convention.update}`, async ({ params, request }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: Convention) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Convenzione non trovata.", 404);

         const body = (await request.json()) as Partial<Convention>;
        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),

      http.delete(`${API.convention.delete}`, async ({ params }) => {
        await this.delay(300);
        const id = Number(params.id);
        const index = this.store.findIndex((x: Convention) => x.id === id);
        if (index === -1) return this.error("NOT_FOUND", "Convenzione non trovata.", 404);

        this.store.splice(index, 1);
        return HttpResponse.json({ success: true });
      }),
    ];
  }
}

