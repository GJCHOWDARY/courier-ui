import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ParamMap, CanDeactivate, ActivatedRoute, Router, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  isAuth: boolean=false;
  role;
  constructor(private router: Router, private authService:AuthService){
    this.isAuth = this.authService.getIsAuth();   
    this.role = this.authService.getUserRole();   
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isAuth && this.role==1) {
        this.router.navigate(['/']);
        return this.isAuth;
      }
      return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUserId = this.authService.getUserRole();   
        if (this.isAuth && this.role==1) {
          return true;
        } else{
        this.authService.logout();
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
