import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  router: any;

  constructor(private auth:AuthService){}

  canActivate():boolean{ 
    if(this.auth.loggedIn()){
      return true
    }  
    this.router.navigate(['/registro'])
    return false;
  }
  
}
