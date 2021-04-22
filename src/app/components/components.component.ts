import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service'
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  sidenavWidth = 4;
  userData: any=[];
  host_ip: string=environment.ip;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private toggleSubs: Subscription;
  email :string;
  role  :number;
  selectedFiles: File;
  userDetails:any={};
  isLoading = true; selectedfile=false;
  selectedFileName: string; 
  private userId: string; toggle: boolean=true;
  bufferValue=10;
  progressValue=0;brogressBar=false;
  constructor(private authService:AuthService) { }
 
  ngOnInit(): void {  
    this.userData = this.authService.getUserData();
    this.userIsAuthenticated= this.authService.getIsAuth();
    if(this.userIsAuthenticated){
    this.getUserDetails();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userData = this.authService.getUserData();
        if(this.userIsAuthenticated){
        this.getUserDetails();
        }
      });
    }
   } 

  getUserDetails(){
      this.authService.getUserDetails().subscribe((res: any) => {
         this.userDetails=res.user;
        },
        error => {
      });
    } 

  increase(){
    this.sidenavWidth = 15;
    // console.log("increase sidenav width");
  }
  decrease(){
    this.sidenavWidth = 4;
    // console.log("decrease sidenav width");
  }
  onLogout() {
   }
}
