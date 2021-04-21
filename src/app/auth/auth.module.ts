import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module'
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { AngularMaterialModule } from "../angular-material.module";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent, 
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
