import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvironmentService } from "../environment/environment.service";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private envService: EnvironmentService,
  ) {
    this.baseUrl = this.envService.apiUrl;
  }

  public async post<T>(endpoint: string, body?: any) {
    return this.httpClient.post<T>(this.baseUrl + endpoint, body);
  }

  public async get<T>(endpoint: string, queryParams?: any) {
    return this.httpClient.get<T>(this.baseUrl + endpoint, {
      params: queryParams
    });
  }

  public async patch<T>(endpoint: string, body?: any) {
    return this.httpClient.patch<T>(this.baseUrl + endpoint, body);
  }

  public async delete<T>(endpoint: string, queryParams?: any) {
    return this.httpClient.delete<T>(this.baseUrl + endpoint, {
      params: queryParams
    });
  }

  public getFullUrl(endpoint: string) {
    return this.baseUrl + '/' + endpoint;
  }
}
