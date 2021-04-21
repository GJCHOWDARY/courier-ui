import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  processingData:any =[];
  host_ip: string=environment.ip;
  private authListenerSubs: Subscription;
  private processListenerSubs: Subscription;
  userData: any=[];
  usersAnvData:any;
  userDetails: any={};
  selectedFiles: any;
  sidenavWidth=4;
  private toggelListener = new Subject<boolean>();
 
  constructor(private authService: AuthService,private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userData = this.authService.getUserData()
    if(this.userIsAuthenticated){
    this.getUserDetails();
    this.getEmpAnniversaries();
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userData = this.authService.getUserData()
        if(this.userIsAuthenticated){
          this.getUserDetails();
          this.getEmpAnniversaries();
          }
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files[0];
    let name=this.selectedFiles.name
    let formData = new FormData();
    formData.append("file", this.selectedFiles);
    formData.append("filename", name);
    this.authService.updateProfileImg(formData)
  }
  
  getUserDetails(){
    this.authService.getUserDetails().subscribe((res: any) => {
       this.userDetails=res.user;
      },
      error => {
    });
  }

  getEmpAnniversaries(){
    this.authService.getEmpAnniversaries().subscribe((res: any) => {
      this.usersAnvData=res.data;
     },
     error => {
   });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent,{data:this.usersAnvData});
  }

  onLogout() {
    this.authService.logout();
   }

  Toggle(){
   }

}
