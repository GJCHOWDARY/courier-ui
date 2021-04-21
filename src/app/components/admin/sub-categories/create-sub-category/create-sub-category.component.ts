import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SubCategoryService } from "../subcategory.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_CAT = environment.apiUrl + "/category";

@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html',
  styleUrls: ['./create-sub-category.component.css']
})
export class CreateSubCategoryComponent implements OnInit {

  isLoading = true;
  category: any=[]; 
  disablerole = true;
  data: any= [];
  dropDownCategories: any=[];
  categoryId: string;
  mode : string;
  isEdit =true;
  userId = null;

  constructor(public categoryService: SubCategoryService,
              private dialogRef: MatDialogRef<CreateSubCategoryComponent>,
              public route: ActivatedRoute,private http: HttpClient,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                 this.data = data;
                this.category = { _id: '', sub_category_name: '', sub_category_desc:'', categoryId: ''};
            }

  ngOnInit() {
    if (this.data.id  && this.data.mode=='edit') {
          this.categoryService.getCategoryById(this.data.id).subscribe( (catData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            console.log('ttt',catData)
            this.category = {
              _id: catData.data[0]._id,
              sub_category_name: catData.data[0].sub_category_name,
              sub_category_desc: catData.data[0].sub_category_desc,
              categoryId:catData.data[0].categoryId._id
             };
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
        
    this.getCategories();
      }

onSaveRole(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.categoryService.addCategory(form.value.sub_category_name,form.value.sub_category_desc,form.value.categoryId)
          .subscribe(responseData => { 
            this.dialogRef.close();
        },
        error => {
          this.isLoading=false;
       });
      } else {
       this.categoryService.updateCategory(this.category._id,this.category.sub_category_name,form.value.sub_category_desc, form.value.categoryId)
           .subscribe(responseData => { 
              this.dialogRef.close();
         },error => {
          this.isLoading=false;
      });
    }
 }

 close() {
   this.dialogRef.close();
  }

getCategories() {
   this.http.get(BACKEND_URL_CAT+'/getcategories').subscribe((res:any) =>{
       this.dropDownCategories=res.data;
     });
  }

}
