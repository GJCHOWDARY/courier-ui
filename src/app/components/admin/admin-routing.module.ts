import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { CreateUsersComponent } from './users/create-users/create-users.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { LeaveTypesListComponent } from './leave-types/leave-types-list/leave-types-list.component';
import { AllLeavesComponent } from './leaves/all-leaves/all-leaves.component'

const routes: Routes = [
  { path: 'roles', component: RolesComponent },
  { path: 'users', component: UsersComponent}, 
  { path: 'createuser', component: CreateUsersComponent}, 
  { path: 'categories', component: CategoriesComponent},
  { path: 'sub_categories', component: SubCategoriesComponent},
  { path: 'jobs', component: JobsListComponent},
  { path: 'leave_types', component: LeaveTypesListComponent},
  { path: 'applied_leaves', component: AllLeavesComponent},
   // {
  //   path: '', redirectTo: 'myleave', pathMatch: 'full'
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
