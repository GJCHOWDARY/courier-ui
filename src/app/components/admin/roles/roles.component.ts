import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { RolesService } from "./roles.service";
import { CreateRolesComponent } from './create-roles/create-roles.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
roles: any= []
isLoading = false;
rolesearch:string;
rolesPerPage = 10;
currentPage = 1;
roleCount = 0;
roleSizeOptions = [10, 20, 50];
displayedColumns1: string[] = [ 'Role Name','Description' ,'RoleID','Action'];

  constructor(
    public rolesService: RolesService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
   ) {}

ngOnInit(): void {
    this.isLoading = true;
        this.rolesService.getRoles(this.rolesPerPage, this.currentPage, this.rolesearch).subscribe((roleData:any) => {
          this.roles=roleData.data;
          this.isLoading = false;
          this.roleCount = roleData.count;
            console.log("role-",this.roleCount);
        })
  }

onDeleteRole(id: string){
    this.rolesService.deleteRole(id)
        .subscribe((resData :any) => { 
            this.rolesService.getRoles(this.rolesPerPage, this.currentPage, this.rolesearch).subscribe((roleData:any) => {
              this.roles=roleData.data;
            }) 
      })
}
 
onSearch(){
this.ngOnInit();
}

onChangedPage(pageData: PageEvent) {
   this.currentPage = pageData.pageIndex + 1;
  this.rolesPerPage = pageData.pageSize; 
  this.ngOnInit();
 }

 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateRolesComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.rolesService.getRoles(this.rolesPerPage, this.currentPage, this.rolesearch).subscribe((roleData:any) => {
      this.roles=roleData.data;
    })
  });
}

}
