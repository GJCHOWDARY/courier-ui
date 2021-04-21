import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { ErrorComponent } from "./shared/error/error.component";
import { ErrorService } from "./shared/error/error.service"; 
import { AuthService } from "./auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog,
              public authService: AuthService,
              private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
            // console.log('event--->>>', event);
        }
        return event;
    }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An Unknown Error Occurred!";
        let errortitle = "Error";
        if (error.error.message) {
           errorMessage = error.error.message;
        }
        if(error.status==401){
          this.authService.logout();
        }
        
        this.dialog.open(ErrorComponent, {data: {message: errorMessage,title:errortitle}});
        // this.errorService.throwError(errorMessage);
        return throwError(error);
      })
    );
  }
}
