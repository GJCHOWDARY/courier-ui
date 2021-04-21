import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { AccountService } from '../account.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: String;
  user: any=[]
  maritalStatus:any =[{title:'Single'},{title:'Married'},{title:'Other'}]
  isLoading: boolean=false;
  isLoadingData: boolean=true;

  constructor(private activatedRoute: ActivatedRoute, private accountService:AccountService) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId= paramMap.get("userId");
     })
   }

ngOnInit(): void {
   if(!this.userId||this.userId==null){
    this.userId=this.accountService.getUserId();
  }
    this.accountService.getUserInfo(this.userId).subscribe((resData:any) => {
      this.user=resData.user[0];
      this.isLoadingData=false;
    })
  }

getUserDetails(){  
  this.isLoading = true;
  this.accountService.getUserInfo(this.userId).subscribe((resData:any) => {
    this.user=resData.user[0];
    this.isLoading = false;
  })
}

saveProfileInfo(form: NgForm){    
    this.accountService.updateProfileInfo(this.userId,form).subscribe((resData:any) => {
       this.getUserDetails();     
    },
    error => {
      this.isLoading = false;
  });
  }

saveContactInfo(form: NgForm){
    this.isLoading = true;
     this.accountService.updateContactInfo(this.user.userAddressId._id,form.value).subscribe((resData:any) => {
       this.getUserDetails();      
    },
    error => {
      this.isLoading = false;
  });
  }
}
