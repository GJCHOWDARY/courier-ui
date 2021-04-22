import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { NgForm, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../auth/auth.service";
import { TrackmodalComponent } from '../trackmodal/trackmodal.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

 @Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  isLoading:Boolean=false;  
  
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  email :string;
  role  :string;
  verifyEmail:string;

constructor(public authService: AuthService,
  private activatedRoute: ActivatedRoute,
  public dialog: MatDialog,
   private router: Router) {
 }

ngOnInit() {
  this.authService.autoAuthUser();  
  localStorage.removeItem("ProcessingData"); 
  this.userIsAuthenticated = this.authService.getIsAuth();
   if (!this.userIsAuthenticated) {
    this.router.navigate(['/']);
  }else{
    this.router.navigate(["/authorized/emp/"]);
  }
}

sendMessage(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading=true; 
  }


 openDialog() {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.maxWidth = '962px';
  dialogConfig.width = '740px';
  dialogConfig.data = {};
  const dialogRef = this.dialog.open(TrackmodalComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
  });
}

onLogout() {
 this.authService.logout();
}
}