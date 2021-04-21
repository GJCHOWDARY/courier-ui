import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AttachmentService } from "../attachment.service";
import { CreateAttachmentComponent } from '../create-attachment/create-attachment.component';


@Component({
  selector: 'app-my-attachments',
  templateUrl: './my-attachments.component.html',
  styleUrls: ['./my-attachments.component.css']
})
export class MyAttachmentsComponent implements OnInit {

  attachments: any= []
  isLoading = true;
  search:string;
  type: string= 'attachment';
  perPage = 10;
  currentPage = 1;
  Count = 0; userId: string;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Attachment Name','Description', 'Attachment' ,'Action'];
  
  
  constructor(
    public attachmentService: AttachmentService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
   ) { 
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
    this.userId= paramMap.get("userId");
  })
   }

ngOnInit(): void {
    this.isLoading = true;
    if(!this.userId||this.userId==null){
     this.userId=this.attachmentService.getUserId();
   }
        this.attachmentService.getAttachments(this.perPage, this.currentPage, this.search,this.userId, this.type).subscribe((attData:any) => {
          this.attachments=attData.data;
          this.isLoading = false;
          this.Count = attData.count;
            console.log("role-",this.attachments);
        })
  }

onDeleteCategory(id: string){
    this.attachmentService.deleteAttachment(id)
        .subscribe((resData :any) => { 
            this.ngOnInit();
      })
}

onChangeAtt() {
  this.isLoading = true; 
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
  const dialogRef = this.dialog.open(CreateAttachmentComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

}