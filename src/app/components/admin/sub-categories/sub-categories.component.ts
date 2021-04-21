import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { SubCategoryService } from "./subcategory.service";
import { CreateSubCategoryComponent } from './create-sub-category/create-sub-category.component';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css']
})
export class SubCategoriesComponent implements OnInit {
  categories: any= []
  isLoading = false;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Sub Category Name','Description', 'Category Name' ,'Action'];
  
  
  constructor(
    public categoryService: SubCategoryService,
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
            console.log("role-",this.Count);
        })
  }

onDeleteCategory(id: string){
    this.categoryService.deleteCategory(id)
        .subscribe((resData :any) => { 
            this.ngOnInit();
      })
}
 
onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.perPage = pageData.pageSize; 
  this.ngOnInit();
 }

 onSearch(){
  this.ngOnInit();
  }
  
 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateSubCategoryComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

}
