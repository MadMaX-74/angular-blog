import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResp, User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/Envenronment";

@Injectable()
export class AuthService {
  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {
  }

  get token():any {
    const expDate: any = new Date(localStorage.getItem('fb-token-exp') as any)
    if (new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}
`, user)
      .pipe(
        tap(this.setToken as any),
        catchError(this.handleError.bind(this) as any)
      )
  }
  logout() {
    this.setToken(null)
  }

  isAuth(): boolean {
    return !!this.token
  }
  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email не найден')
        break
      case 'INVALID_EMAIL':
        this.error$.next('Неверный Email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
    }
    return throwError(error)
  }
  private setToken(response: FbAuthResp | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn! * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
			localStorage.clear()
    }
  }
}
