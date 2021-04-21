import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { CreateRolesComponent } from './roles/create-roles/create-roles.component';
import { CreateUsersComponent } from './users/create-users/create-users.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CategoriesComponent } from './categories/categories.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { CreateSubCategoryComponent } from './sub-categories/create-sub-category/create-sub-category.component';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { AngularMaterialModule } from "../../angular-material.module";
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { CreateJobComponent } from './jobs/create-job/create-job.component';
import { LeaveTypesListComponent } from './leave-types/leave-types-list/leave-types-list.component';
import { CreateLeaveTypeComponent } from './leave-types/create-leave-type/create-leave-type.component';
import { AllLeavesComponent } from './leaves/all-leaves/all-leaves.component'
import { LeaveDetailsComponent } from './leaves/leave-details/leave-details.component';


@NgModule({
  declarations: [
    UsersComponent, 
    RolesComponent, 
    CreateRolesComponent, 
    CreateUsersComponent, 
    CategoriesComponent, 
    SubCategoriesComponent, 
    CreateSubCategoryComponent, 
    CreateCategoryComponent,
    CreateJobComponent,
    JobsListComponent,
    LeaveTypesListComponent,
    CreateLeaveTypeComponent,
    AllLeavesComponent,
    LeaveDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
