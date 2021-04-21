import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ManagerService } from "../manager.service";
import { AuthService } from "../../../auth/auth.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


@Component({
  selector: 'app-assigned-users',
  templateUrl: './assigned-users.component.html',
  styleUrls: ['./assigned-users.component.css']
})
export class AssignedUsersComponent implements OnInit {
  users:any = []; 
  isLoading = false; 
  usersearch: string; 
  currentPage = 1;
  userCount = 0;
  usersPerPage = 10;
  userSizeOptions = [10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  userData:any =[];
  displayedColumns: string[] = [ 'Name','Email', 'Location','Role', 'Mobile', 'Status', 'Action']; 
 
  private userSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public managerService: ManagerService,
              private authService: AuthService,
              public activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router) {
              this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
              this.userId= paramMap.get("userId");
            })
          }

ngOnInit(): void {   
  if(!this.userId||this.userId==null){
    this.userId = this.authService.getUserId();        
  }     
  this.userIsAuthenticated = this.authService.getIsAuth(); 
       this.isLoading = true;
        this.managerService.getAssignedUsers(this.usersPerPage, this.currentPage, this.usersearch,this.userId)
        .subscribe((resData :any) => {
          this.users=resData.users
          this.isLoading = false; 
      })
  }
  
onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.ngOnInit();
  }

userChangeValue(data: string) {
  this.currentPage=1;
  this.ngOnInit();
 }

}
