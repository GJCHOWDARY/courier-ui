import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from "../admin/admin.guard";
import { EmpDirectoryComponent } from './emp-directory/emp-directory.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'directory', component: EmpDirectoryComponent },
  { path: 'profile/:userId', component: ProfileComponent, canActivateChild: [AdminGuard] },
  { path: 'changepassword', component: ChangePasswordComponent}, 
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminGuard]
})
export class AccountRoutingModule { }
