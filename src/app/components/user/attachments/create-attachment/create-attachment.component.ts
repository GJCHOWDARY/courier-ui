import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AttachmentService } from "../attachment.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-attachment',
  templateUrl: './create-attachment.component.html',
  styleUrls: ['./create-attachment.component.css']
})

export class CreateAttachmentComponent implements OnInit {

  isLoading = true;
  attachment: any=[]; 
  disablerole = true;
  data: any= [];
  attachId: string;
  mode : string;
  isEdit =true;
  userId = null;
  selectedFileName: string;
  selectedFiles;

  constructor(public attachmentService: AttachmentService, private dialogRef: MatDialogRef<CreateAttachmentComponent>,
              public route: ActivatedRoute, private router: Router,
              private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
                console.log(data,"0000000")
                this.data = data;
                this.attachment = { _id: '', category_name: '', category_desc:'', attachment_url:''};
            }

  ngOnInit() {
    if (this.data.id  && this.data.mode=='edit') {
          this.attachmentService.getAttachmentById(this.data.id).subscribe( (attachmentData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            this.attachment = {
              _id: attachmentData.data[0]._id,
              attachment_name: attachmentData.data[0].attachment_name,
              attachment_desc: attachmentData.data[0].attachment_desc,
              attachment_url: attachmentData.data[0].attachment_url
             };
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
      }

onSaveRole(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.attachmentService.addAttachment(form.value.attachment_name,form.value.attachment_desc,this.selectedFiles,this.selectedFileName,'attachment')
          .subscribe(responseData => { 
            this.dialogRef.close();
        },error => {
          this.isLoading = false;
      });
     } else {
      this.attachmentService.updateAttachment(this.attachment._id,this.attachment.attachment_name,
         form.value.attachment_desc,this.selectedFiles, this.selectedFileName)
          .subscribe(responseData => { 
              this.dialogRef.close();
          },error => {
          this.isLoading = false;
       });
    }
 }

 selectFile(event) {
  this.selectedFiles = event.target.files[0];
  this.selectedFileName=this.selectedFiles.name
  this.attachment.attachment_url=this.selectedFiles.name
}

 close() {
  this.dialogRef.close();
 }

}
