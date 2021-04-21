import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CategoryService } from "../category.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  isLoading = true;
  category: any=[]; 
  disablerole = true;
  data: any= [];
  categoryId: string;
  mode : string;
  isEdit =true;
  userId = null;

  constructor(public categoryService: CategoryService,
              private dialogRef: MatDialogRef<CreateCategoryComponent>,
              public route: ActivatedRoute,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                console.log(data,"0000000")
                this.data = data;
                this.category = { _id: '', category_name: '', category_desc:''};
            }

  ngOnInit() {
    this.isLoading = true;
    if (this.data.id  && this.data.mode=='edit') {
          this.categoryService.getCategoryById(this.data.id).subscribe( (catData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            this.category = {
              _id: catData.data[0]._id,
              category_name: catData.data[0].category_name,
              category_desc: catData.data[0].category_desc,
             };
         },error => {
            this.isLoading = false;
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
      }

onSave(form: NgForm) {
  if (form.invalid) {
      return;
    }
  this.isLoading = true;
    if (this.mode === "create") {
      this.categoryService.addCategory(form.value.category_name,form.value.category_desc)
          .subscribe(responseData => { 
            this.isLoading = false;
            this.dialogRef.close();
          },error => {
            this.isLoading = false;
        });
     } else {
       this.categoryService.updateCategory(this.category._id, this.category.category_name,form.value.category_desc)
           .subscribe(responseData => { 
              this.dialogRef.close();
              this.isLoading = false;
         },error => {
          this.isLoading = false;
       });
    }
 }

 close() {
        this.dialogRef.close();
    }

}
