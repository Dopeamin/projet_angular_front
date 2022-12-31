import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LocaleService } from "../locale/locale.service";

@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor {
    constructor(
        private localeService: LocaleService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            headers: new HttpHeaders({
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${this.localeService.getToken()}`,
            })
        });
        return next.handle(req).pipe(
            tap({
                error: err => {
                    err.error.errorMessage =
                        err.error.message?.join?.(" ") ||
                        err.error.message ||
                        "An error has occured"
                    throw err;
                }
            })
        );
    }
}

export const AuthentificationInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthentificationInterceptor,
    multi: true,
};