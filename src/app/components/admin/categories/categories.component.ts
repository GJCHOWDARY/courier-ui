import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CategoryService } from "./category.service";
import { CreateCategoryComponent } from './create-category/create-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any= []
  isLoading = false;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Category Name','Description' ,'Action'];
  
  
  constructor(
    public categoryService: CategoryService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
   ) {}

ngOnInit(): void {
    this.isLoading = true;
        this.categoryService.getCategories(this.perPage, this.currentPage, this.search).subscribe((catData:any) => {
          this.categories=catData.data;
          this.isLoading = false;
          this.Count = catData.count;
        })
  }

onDeleteCategory(id: string){
    this.categoryService.deleteCategory(id).subscribe((resData :any) => { 
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
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateCategoryComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

}