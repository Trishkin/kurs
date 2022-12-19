import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminGuard implements CanActivate {
  constructor(private router:Router){}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const token = localStorage.getItem("jwt");
      const role = localStorage.getItem("role");
      if (token && role == 'Admin'){
        return true;
      }
      this.router.navigate(["/"]);
      return false;
    }
  
}
