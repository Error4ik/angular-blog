import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FirebaseAuthResponse, User} from '../../../shared/interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
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
      .pipe(tap(this.setToken));
  }

  logOut() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
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
