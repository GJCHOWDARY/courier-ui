import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service'
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-emp-directory',
  templateUrl: './emp-directory.component.html',
  styleUrls: ['./emp-directory.component.css']
})
export class EmpDirectoryComponent implements OnInit {
  users:any;
  count:any;
  host_ip: string=environment.ip;
  isLoading:boolean=false;
  isLoadmore:boolean=false;
  loadItems=20;
  currentPage=1;
  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.accountService.getUsers(this.currentPage,this.loadItems).subscribe((resData:any) => {
      this.users=resData.users;
      this.count=resData.userCount;
      this.isLoading=false;
    })
  }
  
  loadMore(){
    this.isLoadmore=true;
    this.currentPage= this.currentPage+1;
    this.accountService.getUsers(this.currentPage,this.loadItems).subscribe((res:any) => {
      if(res.users.length>0){
      this.users=[...this.users, ...res.users]
      }
     this.isLoadmore=false;
    })
  }
}
