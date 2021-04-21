import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignedUsersComponent } from './assigned-users/assigned-users.component';
import { ApproveUserLeaveComponent } from './approve-user-leaves/approve-user-leaves.component';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';
import { ManagerRoutingModule } from './manager-routing.module'
import { AngularMaterialModule } from "../../angular-material.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
  declarations: [AssignedUsersComponent, ApproveUserLeaveComponent,LeaveDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
