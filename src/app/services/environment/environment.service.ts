import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EnvironmentService {
  constructor() {}

  get isProduction() {
    return environment.production;
  }

  get apiUrl() {
    return environment.apiURL;
  }
}
