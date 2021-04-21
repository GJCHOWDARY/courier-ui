import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { User } from "./user.model";
import { UsersService } from "./user.service";
import { AuthService } from "../../../auth/auth.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CreateUsersComponent } from './create-users/create-users.component';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = []; 
  isLoading = false; 
  host_ip: string=environment.ip;
  usersearch: string; 
  currentPage = 1;
  userCount = 0;
  usersPerPage = 10;
  userSizeOptions = [10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  userData:any =[];
  displayedColumns: string[] = [ 'Name','Email','Role', 'Mobile', 'Status','Action']; 
 
  private userSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public usersService: UsersService,
              private authService: AuthService,
              public route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,
            ) {}

ngOnInit(): void {
        this.isLoading = true;
        this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
        this.userId = this.authService.getUserId();
        this.userData = this.authService.getUserData();
        this.userSub = this.usersService.getUserUpdateListener()
        .subscribe((userData: { users: User[]; userCount: number }) => {
          this.isLoading = false;
          this.userCount = userData.userCount;
          this.users = userData.users;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
     });
  }
  
onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
  }

onDelete(id: string){ 
  this.usersService.deleteUser(id)
      .subscribe((resData :any) => {
        this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
    }) 
}

activeAccount(user: any){ 
    this.usersService.activeUserAccount(user)
        .subscribe((resData :any) => {
        this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
     }) 
}

deactiveAccount(user: any){ 
  this.usersService.deactiveUserAccount(user)
      .subscribe((resData :any) => {
      this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
   }) 
}

userChangeValue(data: string) {
  this.currentPage=1;
  this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
 }
 
 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.maxWidth = '962px';
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateUsersComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.usersService.getUsers(this.usersPerPage, this.currentPage, this.usersearch);
  });
}

ngOnDestroy() {
     this.userSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  
}
