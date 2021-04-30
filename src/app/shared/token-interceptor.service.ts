import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  /* intercept wird automatisch getriggert / holt sich den Request und reicht ihn an next weiter */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    });
    return next.handle(request);
  }
}
