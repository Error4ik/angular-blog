import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FirebaseAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  get token(): string {
    const expiresDate = new Date(localStorage.getItem('tokenExpires'));
    if (new Date() > expiresDate) {
      this.logOut();
      return null;
    }
    return localStorage.getItem('firebaseToken');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logOut() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    if (message === 'EMAIL_NOT_FOUND') {
      this.error$.next('There is no user record corresponding to this email.');
    } else if (message === 'INVALID_PASSWORD') {
      this.error$.next('The password is invalid or the user does not have a password.');
    } else if (message === 'USER_DISABLED') {
      this.error$.next('The user account has been disabled by an administrator.');
    }
    return throwError(error);
  }

  private setToken(response: FirebaseAuthResponse | null) {
    if (response) {
      const expiresDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('firebaseToken', response.idToken);
      localStorage.setItem('tokenExpires', expiresDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
