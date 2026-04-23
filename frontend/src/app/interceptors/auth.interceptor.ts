import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.tokenValue;
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '发生错误';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `错误: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 401:
              errorMessage = '未授权，请登录';
              this.authService.logout();
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = '没有权限访问';
              break;
            case 404:
              errorMessage = '资源不存在';
              break;
            case 500:
              errorMessage = '服务器错误';
              break;
            default:
              errorMessage = error.error?.message || `错误代码: ${error.status}`;
          }
        }
        
        this.snackBar.open(errorMessage, '关闭', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
