import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ParamMap, CanDeactivate, ActivatedRoute, Router, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
 
  constructor(private router: Router, private authService:AuthService) 
    {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isAuth = this.authService.getIsAuth();      
      if (!isAuth) {
        this.router.navigate(['/auth/login']);
      }
      return isAuth;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isAuth = this.authService.getIsAuth();   
      const role = this.authService.getUserRole();   
        if (isAuth && role==1 ||role==2) {
          return true;
        } else{
          this.router.navigate(['/authorized']);
      } 
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
