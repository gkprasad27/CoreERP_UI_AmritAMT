import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild,
  CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from './services/api-config.service';
import { AddOrEditService } from './components/dashboard/comp-list/add-or-edit.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  options;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private apiConfigService: ApiConfigService,
    private addOrEditService: AddOrEditService
  ) {
    this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // let obj = JSON.parse(localStorage.getItem("user"));
    // const getMenuUrl = String.Join('/', this.apiConfigService.getMenuUrl, obj.role);
    // return this.http.get(getMenuUrl, { headers: this.options, observe: 'response', params: obj })
    //   .pipe((map(res => {
    // console.log(res.body['response'], next.params.id)
    // if (this.authorizedUser(res.body.response)) {
    if (this.authService.isLoggedIn()) {
      if (state.url.includes('Edit') || state.url.includes('Add')) {
        if (!this.addOrEditService.editData) {
          let route;
          route = state.url.replace('/Edit', '');
          route = route.replace('/Add', '');
          this.router.navigate([ route ]);
        }
      }
      return true;
    }
    // }
    this.router.navigate(['/login']);
    return false;
    // })));
  }

}
