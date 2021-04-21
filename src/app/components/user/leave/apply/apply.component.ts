import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LeaveService } from "../leave.service";
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {

  isLoading = true;
  leaveTypeData: any=[]; validation=true;
  leaveId: string;  leaveType: string;
  mode : string; leaveTypes:any;
  isEdit =true; startTime; endTime;
  specific_time =0.0;
  startDate: Date; endDate: Date; dayDiffer: any; weekDays: any;
  sankBardata: any={};
  minDate: Date;  maxDate: Date; minforEndDate: Date;
  userId : string;leaveBalance: any;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  showDuration: boolean=false;
  isDisabled: boolean=false;
  leave = { _id: '', leaveId: '', start_time:'', time_taken:'' , end_time:'', duration: 'Full Day', shift:'Morning', leave_desc:'', start_date:'', end_date:""};
  durationData: any=[{name:'Full Day',id:1},{name:'Half Day',id:2},{name:'Specify Time',id:3}]
  halfDay: any=[{name:'Morning',id:1},{name:'Afternoon',id:2}]
 
  constructor(public leaveService: LeaveService, public activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar, private route: Router ){
              const currentYear = new Date().getFullYear();
              this.minDate = new Date();
              this.maxDate = new Date(currentYear + 0, 11, 31);

              this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
                this.leaveId= paramMap.get("leaveId");
                this.leaveType= paramMap.get("leaveType");
              })
            }

ngOnInit() {
    if (this.leaveId  && this.leaveType=='update') {          
          this.isLoading = false;
          this.leaveService.getLeaveById(this.leaveId).subscribe( (resData: any) => {
            this.isEdit =true;
            this.mode = "update";
            this.leave = resData.data[0];
          });
        }else {          
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
        this.getLeaveTypes();
        this.userId=this.leaveService.getUserId(); 
    }

onApplyLeave(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isDisabled = true;
    if(this.validation){
     this.dayDiffer=this.dayDifference();
     this.weekDays=this.getWeekEnds();
     var data: any=form.value;
     data.day_differ=this.dayDiffer;
     data.week_days= this.weekDays;
     data.specific_time=this.specific_time;
     data.userId=this.userId;
     data.leave_type_id=this.leaveTypeData.leave_type_id;
     console.log(data)
     if (this.mode === "create") {
       this.leaveService.addLeave(form.value).subscribe(responseData => { 
           this.route.navigate(["/authorized/emp/myleave"]);
         },error => {          
          this.isDisabled = false;
      });
     } else {
       var data: any= form.value; 
       data.leave_type_id=this.leaveTypeData.leave_type_id;
       this.leaveService.updateLeave(this.leave._id, data).subscribe(responseData => { 
          this.route.navigate(["/authorized/emp/myleave"]);
        },error => {          
          this.isDisabled = false;
      });
    }
  }else{
    this.sankBardata.message=this.leaveTypeData.message;
    this.openSnakBar()
    this.isDisabled = false;
  }
 }

 getLeaveTypes(){
   this.leaveService.getLeaveTypes().subscribe((resData:any)=>{
     this.leaveTypes=resData.data
   })
 }

 getLeaveBalance(data: any){
  this.leaveService.getLeaveBalance(this.userId,data.leave_type_id).subscribe((leaveData:any)=>{
    this.leaveBalance=leaveData.data;            
    this.isLoading = false;
  })
}

 //TODO : get date formate
 
 getDateFormate(date){
  var today =date;
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  return today = dd+'/'+mm+'/'+yyyy;
 }

//TODO : get week days b/w two days

getWeekEnds(){
  var date1 = new Date(this.startDate);
  var date2 = new Date(this.endDate);
  var weekendDays = 0;
  var dayMilliseconds = 1000 * 60 * 60 * 24;
  
  while (date1 <= date2) {
  var day = date1.getDay();
  if (day == 0 || day == 6) {
  weekendDays++;
  }
  date1 = new Date(+date1 + dayMilliseconds);
  }
  console.log(weekendDays,"-----")
  return weekendDays;
}

//TODO : get Day difference b/w two dates

dayDifference() {  
  let MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  let startDate= new Date(this.startDate);
  let endDate=new Date(this.endDate);
   var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
   var diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY)+1;
   console.log(diffDays,"total days")
   return diffDays;
}

 //TODO : Check Changes in Leave type

 onChangeLeaveType(value: string){
  this.leaveTypeData = this.leaveTypes.find(element => element._id == value);
  console.log(this.leaveTypeData);
  this.getLeaveBalance(this.leaveTypeData);    
  this.showDuration=false;
  this.leave = { _id: '', leaveId: '', start_time:'', time_taken:'' , end_time:'', duration: 'Full Day', shift:'Morning', leave_desc:'', start_date:'', end_date:""};
 }

 //TODO : On change Validations

snackBarOpen(data:any){
  let config = new MatSnackBarConfig();
  config.verticalPosition = this.verticalPos;
  config.horizontalPosition = this.horizontalPos;
  config.duration=800000;
     this._snackBar.open(data, 'Ok', config);
}

//TODO : Check Changes in dates(Start and End dates)

checkChangeInDates(){
  let sDate=new Date(this.startDate);
  let eDate=new Date(this.endDate);
  this.minforEndDate= new Date(sDate); 
  this.validation=true;
   if (sDate.getTime() === eDate.getTime()) {
     this.showDuration=true;
 }else{
     this.showDuration=false;
     this.leave.duration='';
      if(this.leaveTypeData.any_validation){
        console.log("back-end_date validation");
         this.dayDiffer=this.dayDifference();
       if(this.dayDiffer>this.leaveTypeData.allowed_days){  
        console.log("check day difference");    
         this.validation=false;
        this.sankBardata.message=this.leaveTypeData.message;
        this.openSnakBar()
      }
     }
    //  if(this.dayDiffer>this.leaveBalance.balance){
    //   this.sankBardata.message=`You have ${this.leaveBalance.balance} days.`;
    //   this.openSnakBar()
    //  }
  }
}

//TODO : Changes in start data and end_date date

checkChangesDates(type: string, event) {
  if(type=='startDate'){
    this.startDate= event.value;
    this.endDate=this.leave.end_date= event.value;
    this.checkChangeInDates(); 
  }
  if(type=='endDate'){
   this.endDate= event.value; 
   this.checkChangeInDates();
  } 
}

//TODO : Changes in start time and end_date time

checkChangeTime(type,value){
  console.log(type,value)
  if(type=='start'){
    this.startTime=value; 
  }else if(type=='end'){
  this.endTime=value; 
  }
  console.log(this.startTime, this.endTime,"+++++")
  if(this.startTime&&this.endTime){
    this.getTimeDiff();
  }
 }

 //TODO : get Time differnece b/w two dates

getTimeDiff(){
  let data: any={};
  var hrs,mins,timeDiff;
  let d=new Date(this.startDate);
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  var newDate = month +'/'+ date +'/'+ year;
  var date1 = new Date(newDate + " " + this.startTime).getTime();
  var date2 = new Date(newDate + " " + this.endTime).getTime(); 
    timeDiff=date2 - date1;
    mins = Math.floor(timeDiff / 60000);   
  //  console.log(this.leave.time_taken,'hrs',Math.floor(mins / 60),mins%60)
  //  var a=Math.floor(mins / 60)+'.'+mins%60;
  hrs= Math.floor(mins / 60); 

  // if(hrs>0){
    if(hrs>=1&&hrs<=4){
    hrs = hrs < 10 ? '0'+hrs :hrs;  
    mins=mins%60;
    // console.log(newDate,this.startTime,this.endTime,hrs,mins,"----000----")
      var calmins=mins < 10 ? '0'+mins:mins; 
      this.specific_time=Number(hrs+'.'+calmins); 
      this.leave.time_taken=String(hrs+':'+calmins)
    }else{
      this.leave.time_taken='';
      this.sankBardata.message="Your allowed to take 1 hrs to 4 hrs only."
      this.openSnakBar();
    }
  // }else{
  //   this.leave.time_taken='';
  //   this.sankBardata.message="End Time Should be Greater Then (>) Start Time."
  //   this.openSnakBar();
  // }
}

openSnakBar(){
  let config = new MatSnackBarConfig();
  config.verticalPosition = this.verticalPos;
  config.horizontalPosition = this.horizontalPos;
  config.duration=8000; 
   this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }

close() {

   }

calHours(n:number){
    let s:any=Math.abs(n);
    let s1=s-Math.floor(s);
    let s2:any=s1*9.5*60
    let hours = Math.floor(s2/60);  
    let minutes = Math.round(s2%60);
    // let num:any = (s1*9.5*60).toFixed(2);
    // var hours = (num / 60);
    // var rhours = Math.floor(hours);
    // var minutes = (hours - rhours) * 60;
    // var rminutes = Math.round(minutes);
    // console.log(Math.floor(s),n,num + ',,,'+ hours+ " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).");
    return Math.floor(s)+" days "+ hours + " hour(s) and " + minutes + " minute(s)."
  }
}
