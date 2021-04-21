import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components.component'; 
import { UserGuard } from "./user/user.guard";
import { ManagerGuard } from "./manager/manager.guard"
import { AdminGuard } from "./admin/admin.guard"

const routes: Routes = [
      { 
        path: '', component: ComponentsComponent, 
        children: [
            { 
              path: 'emp', 
              loadChildren: () => 
              import(`./account/account.module`).then(m => m.AccountModule) 
            },
            { 
              path: 'emp', 
              loadChildren: () => 
              import(`./user/user.module`).then(m => m.UserModule) ,
              canActivateChild: [UserGuard],
            },
            { 
              path: 'admin', 
              loadChildren: () => 
              import(`./admin/admin.module`).then(m => m.AdminModule),
              canActivateChild: [AdminGuard], 
            },
            { 
              path: 'manager', 
              loadChildren: () => 
              import(`./manager/manager.module`).then(m => m.ManagerModule),
              canActivateChild: [ManagerGuard], 
            },
            { 
              path: '', 
              loadChildren: () => 
              import(`./shared/shared.module`).then(m => m.SharedModule)
            },
            { 
              path: '', redirectTo: 'emp', pathMatch: 'full' 
            },
          ]
      },
      { 
        path: '', redirectTo: '', pathMatch: 'full' 
      },
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserGuard,ManagerGuard]
})
export class ComponentsRoutingModule { }
