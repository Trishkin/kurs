import { UserForRegistration } from '../interfaces/user-for-registration'; 
import { AuthenticatedResponse } from '../interfaces/authenticated-response'
import { RegistrationResponse } from '../interfaces/registration-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;
  baseUrl:string = '';
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    this.baseUrl = baseUrl;
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('jwt'));
          this.currentUser = this.currentUserSubject.asObservable();
  }
  
  
  public get currentUserValue(): string {
    return localStorage.getItem('jwt');
}   

  public registerUser = (route: string, body: UserForRegistration) => {
    return this.http.post<RegistrationResponse> (this.baseUrl + route, body); //Переделать ссылку
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
}