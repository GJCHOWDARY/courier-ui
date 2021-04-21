import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QualifcationService } from '../qualification.service';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "../../../../auth/auth.service";
import { AttachmentService } from "../../attachments/attachment.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CreateQualificationComponent } from '../create-qualification/create-qualification.component'; // for FullCalendar!
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.css']
})
export class QualificationsComponent implements OnInit {
  selectable = true;
  removable = true;
  host_ip: string=environment.ip;
  update:boolean=false;
  sankBardata: any={}; 
  isLoading: boolean=true;
  userId: string;
  perPage: number; currentPage:number; search: string; type: string='certificate';
  educations:any;
  skillsData:any=[];
  workData:any;
  viewpage: string='Skills';
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  selectedFileName: string;
  certificates:any;
  user:any={}
  selectedFiles;

constructor(private QService:QualifcationService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService:AuthService,
    private attachmentService:AttachmentService,
    private router: Router,) {
      this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId= paramMap.get("userId");
    }) }

ngOnInit(): void {
    if(!this.userId||this.userId==null){
     this.userId=this.authService.getUserId();
   } 
   this.getSkills(); 
  }

getSkills(){ 
  this.isLoading = true;
    this.authService.getUserSkills(this.userId).subscribe((resData:any) => {
     this.skillsData=resData.data.skills;
     this.user=resData.data;
     this.isLoading = false;
   })
  }

getEducations(){
  this.isLoading = true;
    this.QService.getEducations(this.userId).subscribe((resData:any) => {
      this.educations=resData.data;
      this.isLoading = false;
    })
  }

getWorks(){
  this.isLoading = true;
    this.QService.getWorks(this.userId).subscribe((resData:any) => {
      this.workData=resData.data;
      this.isLoading = false;
    })
  }

getAttachments(){
  this.isLoading = true;
  this.attachmentService.getAttachments(this.perPage, this.currentPage, this.search, this.userId, this.type).subscribe((res:any) => {
    this.certificates=res.data;
    this.isLoading = false;
  })
}

onDeleteEdu(id: string){
    this.QService.deleteEducation(id).subscribe((resData :any) => { 
       this.getEducations();
    })
 }

onDeleteAtt(id: string){
  this.attachmentService.deleteAttachment(id).subscribe((resData :any) => { 
      this.getAttachments();
   })
}

onDeleteWork(id: string){
  this.QService.deleteWork(id).subscribe((resData :any) => { 
      this.getWorks();
    })
 }

remove(skill: string): void {
    const index = this.skillsData.indexOf(skill);
    if (index >= 0) {
      this.update=true;
      this.skillsData.splice(index, 1);
    }
  }

addSkill(form: NgForm){
    this.isLoading = true;    
    let data: any=[form.value]; 
    if(this.skillsData&&this.skillsData.length>0){
      let index = this.skillsData.findIndex(option => (option.skill).toLowerCase() === (form.value.skill).toLowerCase());
        if (index == -1) { 
            this.QService.addSkill(this.userId, form.value).subscribe((resData:any) => {
              this.skillsData=resData.data.skills;
              this.isLoading = false;
              form.reset();
            },error => {
              this.isLoading = false;
           });
          } else{
            this.sankBardata.message="This Skill Allready Exist."
            this.openSnakBar();
       }
    }else{
      this.QService.addSkill(this.userId,form.value).subscribe((resData:any) => {
        this.skillsData=resData.data.skills;
        this.isLoading = false;
        form.reset();
      },error => {
        this.isLoading = false;
     });
   }
 }

 updateSocial(form:NgForm){
  this.isLoading = true;
  this.QService.updateSocial(this.userId,form.value).subscribe((resData:any) => {
      this.isLoading = false;
      this.sankBardata.message="Your Social Media Links Updated "
      this.openSnakBar();
      this.update=false;
    },error => {
      this.isLoading = false;
  });
 }

 addCertificate(form:NgForm){    
   this.isLoading = true;
   this.attachmentService.addAttachment(form.value.certificate,"certificate",this.selectedFiles,this.selectedFileName,'certificate')
      .subscribe((resData:any) => {
        this.isLoading = false;
        this.sankBardata.message="Your Certificate Added."
        this.openSnakBar();
        this.selectedFiles ='';
        this.selectedFileName='';
        this.getAttachments();
        form.reset();
      },error => {
        this.isLoading = false;
    });
 }

updateSkills(){
  this.isLoading = true;
  this.QService.updateSkills(this.userId,this.skillsData).subscribe((resData:any) => {
    this.isLoading = false;
    this.update=false;
  },error => {
    this.isLoading = false;
 });
 }

selectFile(event) {
  this.selectedFiles = event.target.files[0];
   this.selectedFileName=this.selectedFiles.name
 }

viewPage(value: string){
    this.viewpage=value;
  if(value=='Skills'){
    this.getSkills();
  }else if(value=='Education'){
    this.getEducations();
  }else if(value=='Work'){
    this.getWorks();
  }else if(value=='Certifications'){
    this.getAttachments();
  }
 }

openSnakBar(){
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration=8000; 
     this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }

openDialog(data: any, mode: string) {
    data.mode=mode;
    data.page=this.viewpage;
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.width='562px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        const dialogRef = this.dialog.open(CreateQualificationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
        if(this.viewpage=='Work'){
           this.getWorks();
        }else{
          this.getEducations()
        }
    });
  }

}
