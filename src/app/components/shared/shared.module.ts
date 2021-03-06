import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from "../../angular-material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { CreateTicketComponent } from './tickets/create-ticket/create-ticket.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { CommentsComponent } from './comments/comments/comments.component';
import { ProjectInfoComponent } from './projects/project-info/project-info.component';
import { TicketInfoComponent } from './tickets/ticket-info/ticket-info.component';
import { CommonPopupComponent } from './comments/common-popup/common-popup.component'
import { CouriersComponent } from './couriers/couriers/couriers.component';
import { CourierInfoComponent } from './couriers/courier-info/courier-info.component';
import { CreateCouriersComponent } from './couriers/create-courier/create-courier.component';

@NgModule({
  declarations: [
     CreateTicketComponent, 
     CreateProjectComponent, 
     ProjectsComponent, 
     TicketsComponent, 
     CommentsComponent, 
     ProjectInfoComponent, 
     TicketInfoComponent, 
     CommonPopupComponent,
     CouriersComponent,
     CreateCouriersComponent,
     CourierInfoComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
