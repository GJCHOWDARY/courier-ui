import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountRoutingModule } from './account-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AngularMaterialModule } from "../../angular-material.module";
import { ChartsModule } from 'ng2-charts';
import { EmpDirectoryComponent } from './emp-directory/emp-directory.component';

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent,DashboardComponent, EmpDirectoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AccountRoutingModule,
    ChartsModule
  ]
})

export class AccountModule { }
