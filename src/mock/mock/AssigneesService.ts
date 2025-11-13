import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { assegnatari } from "./data";
import type { Assegnatario } from "../../types/types";
import { API } from "./api/endpoints";

export class AssigneesService extends RestService<Assegnatario> {
  public readonly apiVersion = "v1";
  protected store = assegnatari;

  protected validateCreate = (body: Partial<Assegnatario>): string | null => {
    if (!body.id || !body.tipoUtente) return "Asset e Tipo obbligatori.";
    return null;
  };

  public getHandlers() {
    return [
      http.get(API.assegnatari.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),

      http.post(API.assegnatari.create, async ({ request }) => {
        await this.delay(300);
        const body = (await request.json()) as Partial<Assegnatario>;
        if (!body) return this.error("VALIDATION_ERROR", "Payload non valido.", 400);

        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

       const newItem: Assegnatario = {...body,id: Number(this.generateId()),} as Assegnatario;
        this.store.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
      }),

      http.put(`${API.assegnatari.update}`, async ({ params, request }) => {
        await this.delay(300);
        const idParam = params.id;
        const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);
        const index = this.store.findIndex((x: Assegnatario) => x.id == id);
        if (index === -1) return this.error("NOT_FOUND", "Assegnatario non trovato.", 404);

         const body = (await request.json()) as Partial<Assegnatario>;
        const error = this.validateCreate(body);
        if (error) return this.error("VALIDATION_ERROR", error, 400);

        this.store[index] = { ...this.store[index], ...body };
        return HttpResponse.json(this.store[index]);
      }),
    ];
  }
}