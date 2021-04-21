import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthService } from "./auth/auth.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  sankBardata: any={};
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  connectionStatus: string;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  title = 'Courier';
  userData: any=[]; 

  constructor(public authService: AuthService, private router: Router,private _snackBar: MatSnackBar,
     private activatedRoute: ActivatedRoute) {
     this.authService.autoAuthUser();  
      this.activatedRoute.queryParams.subscribe(params => {
        if(params.email){ 
        this.authService.verifyUserEmail(params.email).subscribe(
            (response : any) => {
              if(response.status){
                this.router.navigate(['/auth/login'])
              }
            })
          }else if(params.token){
          this.router.navigate(['/auth/reset'],{ queryParams: { token: params.token}})
        }
    });
  }

ngOnInit(): void {
   // TODO: check internet connection
   this.onlineEvent = fromEvent(window, 'online');
   this.offlineEvent = fromEvent(window, 'offline');

   this.subscriptions.push(this.onlineEvent.subscribe(e => {
     this.connectionStatus = 'online'; 
     this.sankBardata.message='Back to online.';
     this.openSnakBar()
     console.log('Online...');
   }));

   this.subscriptions.push(this.offlineEvent.subscribe(e => {
    this.connectionStatus = 'offline' 
     this.sankBardata.message='Connection lost! You are not connected to internet.';
     this.openSnakBar()
     console.log('Offline...');
   }));

  this.userIsAuthenticated = this.authService.getIsAuth();
    // if(!this.userIsAuthenticated){
    //     this.router.navigate(['/auth/login']);
    //   }
    //   if(this.userIsAuthenticated){
    //     this.router.navigate(["/authorized/emp"]);
    //     }
      this.userData = this.authService.getUserData();
      this.authListenerSubs = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {  
            this.userData = this.authService.getUserData();
            this.userIsAuthenticated = isAuthenticated;
      });
}

openSnakBar(){
  let config = new MatSnackBarConfig();
  config.verticalPosition = this.verticalPos;
  config.horizontalPosition = this.horizontalPos;
  config.duration=8000; 
   this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }

ngOnDestroy(): void {
  /** Unsubscribe all subscriptions to avoid memory leak */
 } 
}
