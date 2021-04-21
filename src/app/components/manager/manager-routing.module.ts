import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignedUsersComponent } from './assigned-users/assigned-users.component';
import { ApproveUserLeaveComponent } from './approve-user-leaves/approve-user-leaves.component';

const routes: Routes = [
  { path: 'assigned_users', component: AssignedUsersComponent },
  { path: 'assigned_users/:userId', component: AssignedUsersComponent }, 
  { path: 'approve_leave', component: ApproveUserLeaveComponent}, 
  { path: 'approve_leave/:assignUserId', component: ApproveUserLeaveComponent}, 
   {
    path: '', redirectTo: 'assigned_userss', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
