import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyleaveComponent } from './leave/myleave/myleave.component';
import { ApplyComponent } from './leave/apply/apply.component';
import { LeaveCalendarComponent } from './leave/leave-calendar/leave-calendar.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MyAttachmentsComponent } from './attachments/my-attachments/my-attachments.component';
import { CreateAttachmentComponent } from './attachments/create-attachment/create-attachment.component';
import { AngularMaterialModule } from "../../angular-material.module";
import { UserRoutingModule } from '../user/user-routing.module';
import { LeaveDetailsComponent } from './leave/leave-details/leave-details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { QualificationsComponent } from './qualification/qualifications/qualifications.component';
import { CreateQualificationComponent } from './qualification/create-qualification/create-qualification.component'; // for FullCalendar!


@NgModule({
  declarations: [MyleaveComponent,
     ApplyComponent,
     LeaveCalendarComponent,
     MyAttachmentsComponent,
     CreateAttachmentComponent,
     LeaveDetailsComponent,
     QualificationsComponent,
     CreateQualificationComponent
    ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    FullCalendarModule,
    UserRoutingModule,
  ]
})

export class UserModule { }
