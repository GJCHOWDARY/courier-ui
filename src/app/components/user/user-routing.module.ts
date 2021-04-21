import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MyleaveComponent } from './leave/myleave/myleave.component';
import { ApplyComponent } from './leave/apply/apply.component';
import { MyAttachmentsComponent } from './attachments/my-attachments/my-attachments.component';
import { LeaveCalendarComponent } from './leave/leave-calendar/leave-calendar.component';
import { QualificationsComponent } from './qualification/qualifications/qualifications.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AdminGuard } from "../admin/admin.guard";


const routes: Routes = [
  { path: 'myleave', component: MyleaveComponent },
  { path: 'myleave/:userId', component: MyleaveComponent, canActivateChild: [AdminGuard] },
  { path: 'apply/:leaveType/:leaveId', component: ApplyComponent}, 
  { path: 'calendar', component: LeaveCalendarComponent},
  { path: 'myattachments', component: MyAttachmentsComponent }, 
  { path: 'myattachments/:userId', component: MyAttachmentsComponent, canActivateChild: [AdminGuard] }, 
  { path: 'qualifications', component: QualificationsComponent },
  { path: 'qualifications/:userId', component: QualificationsComponent, canActivateChild: [AdminGuard]  },
  {
    path: '', redirectTo: 'myleave', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminGuard]
})
export class UserRoutingModule { }
