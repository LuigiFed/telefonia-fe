import { http, HttpResponse } from "msw";
import { RestService } from "./RestService";
import { reference } from "./data";
import type { Reference } from "../../types/types";
import { API } from "./api/endpoints";


export class ReferenceService extends RestService<Reference> {
  public readonly apiVersion = "v1";
  protected store = reference;

  public getHandlers() {
    return [
      http.get(API.riferimento.list, async () => {
        await this.delay(300);
        return HttpResponse.json(this.store);
      }),
    ];
  }
}