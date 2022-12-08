import {EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, ReplaySubject, Subject, tap } from 'rxjs';
import { getLoggedIn } from './global-functions/global-functions.module';

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {
  private loggedIn = new Subject<any>();

  login(): any {
    // TODO: set up http request
    this.loggedIn.next(true)
  }

  logout(): any {
    this.loggedIn.next(false)
  }

  loginStatusChange(): Observable<any> {
    this.loggedIn.subscribe((loggedIn:any )=> {
      console.log('loggedIn',loggedIn)
    })
    return this.loggedIn.asObservable();
  }

}
