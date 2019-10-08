import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({
  'providedIn': 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
      // return !!user;

        // option 2:
        const isAuth = !!user;
        if (isAuth) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          // return this.router.createUrlTree(['/auth']);
        }
      }
    ));

    // option 1: 
    // , tap((isAuth) => {
    //   if (!isAuth) {
    //     this.router.navigate(['/auth']);
    //   }
    // }));
  }
}