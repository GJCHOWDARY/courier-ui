import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { 
    path: '', component: HomeComponent 
  },
  { 
    path: 'auth', loadChildren: () => 
    import(`./auth/auth.module`).then(m => m.AuthModule) 
  },
  { 
    path: 'authorized', loadChildren: () => 
    import(`./components/components-routing.module`).then(m => m.ComponentsRoutingModule) , 
    canActivate: [AuthGuard] 
  },
  {
    path: '', redirectTo: '', pathMatch: 'full' 
  },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: false })],
  exports: [RouterModule],
  providers: [AuthGuard]

})
export class AppRoutingModule { }
