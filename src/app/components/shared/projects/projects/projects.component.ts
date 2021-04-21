import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ProjectsService } from "../projects.service";
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { AuthService } from "../../../../auth/auth.service"

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: any= []
  userData:any;
  isLoading = false;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Project Name','Description' ,'Action'];
  
  
  constructor(
    public projectsService: ProjectsService,
    public route: ActivatedRoute,
    private authService:AuthService,
    public dialog: MatDialog,
    private router: Router,
   ) {}

ngOnInit(): void {
    this.isLoading = true;
        this.userData=this.authService.getUserData()
        this.projectsService.getProjects(this.perPage, this.currentPage, this.search).subscribe((resData:any) => {
          this.projects=resData.data;
          this.isLoading = false;
          this.Count = resData.count;
        })
  }

  onDelete(id: string){
    this.projectsService.deleteProject(id)
        .subscribe((resData :any) => { 
            this.ngOnInit();
      })
}

onSearch(){
  this.ngOnInit();
  }
  
onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.perPage = pageData.pageSize; 
  this.ngOnInit();
 }

 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width='598px';
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateProjectComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

projectInfoDialog(pid: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width='598px';
  dialogConfig.data = {id: pid};
  const dialogRef = this.dialog.open(ProjectInfoComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}
}