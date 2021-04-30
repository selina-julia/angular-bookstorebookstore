import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
@Injectable()
export class CanNavigateToAdminGuard implements CanActivate {
  accessGranted: boolean = false;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.accessGranted) {
      this.accessGranted = window.confirm(
        "Mit großer Macht kommt große Verantwortung. Möchten Sie den Admin-Bereich betreten?"
      );
    }
    return this.accessGranted;
  }
}
