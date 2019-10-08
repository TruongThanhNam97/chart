import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

// defines an inteface is a good practice in Angular, and in types called apps to define the types of data.
// with Angular, we could not use a Session.

// Another solution to storage: using cookies or local storage expose by browser.
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  // optional.
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private key: string = 'AIzaSyCCi1xHkpb2t7ke0xqQw9S2lsT16b2g8R4';

  // Subject will inform all places the app about when user changes.
  // option 1:
  // user = new Subject<User>();
  // token: string = null;

  // option 2:
  // means: when fetch data when need that token at this point of time even if the user logged in before that point of time.
  // which we get access to that latest user.
  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCCi1xHkpb2t7ke0xqQw9S2lsT16b2g8R4', 
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    // option 2:
    .pipe(catchError(this.handleError), tap((resData) => {
      // option 1:
      // const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
      // const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);

      // this.user.next(user);

      // option 2:
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));

    // option 1: 
    // .pipe(catchError(errorRes => {
    //   // error handling.
    //   let errorMessage = 'UNKOWN';
    //   if (!errorRes.error || !errorRes.error.error) {
    //     return throwError(errorMessage);
    //   }
    //   switch (errorRes.error.error.message) {
    //     case 'EMAIL_EXISTS':
    //         errorMessage = 'EMAIL_EXISTS!';
    //       break;
      
    //     default:
    //       break;
    //   }
    //   return throwError(errorMessage);
    // }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCCi1xHkpb2t7ke0xqQw9S2lsT16b2g8R4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap((resData) => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    // error handling.
    let errorMessage = 'UNKOWN';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'EMAIL_EXISTS!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'INVALID_PASSWORD';
        break;
      default:
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, localId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, token, expirationDate);

    this.user.next(user);

    // handle autoLogout.
    this.autoLogout(expiresIn * 1000);

    // using local storage.
    // JSON.stringify due to convert to string.
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    // sync method.
    // convert back to Javascript Object.
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);

      // handle autoLogout.
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
    
  }

  logout() {
    this.user.next(null);
    // clear all data in the local storage.
    // localStorage.clear();

    // clear a part of data. For example: only clear userData.
    localStorage.removeItem('userData');

    // clear tokenExpirationTimer.
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    this.router.navigate(['/auth']);
  }

  // need to clean expirationDuration in case do a logout manually.
  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}