import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects/projects.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { CouriersComponent } from './couriers/couriers/couriers.component';

const routes: Routes = [
    { path: 'projects', component: ProjectsComponent },
    { path: 'orders', component: CouriersComponent },
    { path: 'tickets/:pid', component: TicketsComponent}, 
    {
      path: '', redirectTo: 'projects', pathMatch: 'full'
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
