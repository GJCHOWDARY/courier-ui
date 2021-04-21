import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TicketsService } from "../tickets.service";
import { CreateTicketComponent } from '../create-ticket/create-ticket.component';
import { TicketInfoComponent } from '../ticket-info/ticket-info.component'
import { CommentsComponent } from '../../comments/comments/comments.component'
import { ProjectsService } from "../../projects/projects.service";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  tickets: any= []
  userData:any;
  isLoading = false;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  pid: string; projectData: any=[];
  sizeOptions = [10, 20, 50];
  ticket_priority:any=['High', 'Medium','Low']
  ticket_status=['Open', 'Pending', 'Done', 'Closed'];
  displayedColumns1: string[] = [ 'Ticket', 'Created At', 'Status' ,'Action'];
  ChartData:Array<any> = [{
    data: [0,0,0,0,0], 
    label: 'Tages',
    lineTension: 6,
    pointRadius: [4, 4, 4, 4],
    borderWidth: 2,
  }];
  Labels:any=['Frontend','Backend','API','Issue','Mobile', 'Future', 'Other']
  ChartOptions:any = {
    responsive: true, 
    tooltips: {
      enabled: true
    }, 
    plugins: {
      datalabels: {
        anchor: 'top',
        align: 'top',
        font: { size: 12, }
      }
    }
  };
  public barChartPlugins = [pluginDataLabels];
  public ChartLegend:boolean = true;
  public ChartType:string = 'doughnut';
 
  constructor(
    public ticketsService: TicketsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private projectsService:ProjectsService,
    private router: Router,) { 
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
    this.pid= paramMap.get("pid");
  })
}

ngOnInit(): void {
    this.isLoading = true;
    this.userData=this.ticketsService.getUserData()
    this.projectsService.getProjectById(this.pid).subscribe((proData:any) => {
      this.projectData=proData.data[0];
        this.ticketsService.getTicketsByProjectId(this.perPage, this.currentPage, this.search, this.pid).subscribe((resData:any) => {
          this.tickets=resData.data;
          this.Count = resData.count;
          this.ticketsService.getTicketTages(this.pid).subscribe((tagesData:any) => {
             this.ChartData[0].data=tagesData.data;
             this.isLoading = false;
          })
        })
     })
  }

onDelete(id: string){
    this.ticketsService.deleteTicket(id)
        .subscribe((resData :any) => { 
            this.ngOnInit();
      })
}

onSearch(){
  this.ngOnInit();
  }
  
onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.perPage = pageData.pageSize; 
  this.ngOnInit();
 }

 onChangeStatus(type: string,value: string,id: string,constant: string){
   let data: any={ id: id };
   if(type=='priority'){
      data.status=constant;
      data.ticket_priority=value;
        this.ticketsService.updateTicketStatus(data).subscribe((resData :any) => { 
          this.ngOnInit();
      })
    } else if(type=='status'){
          data.ticket_priority=constant;
          data.status=value;
          this.ticketsService.updateTicketStatus(data).subscribe((resData :any) => { 
          this.ngOnInit();
        })
    }
 }

 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {id: id, pid: this.pid,mode: mode};
      const dialogRef = this.dialog.open(CreateTicketComponent, dialogConfig);
      //------After close the dialog dataset Description will be changed
      dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
  });
}

ticketInfoDialog(pid: number) {
  const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width='598px';
      dialogConfig.data = {id: pid};
      const dialogRef = this.dialog.open(TicketInfoComponent, dialogConfig);
      //------After close the dialog dataset Description will be changed
      dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  
  commentsDialog(pid: string,tid: string) {
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width='962px';
        dialogConfig.minHeight='563px';
        dialogConfig.data = {pid: pid, tid: tid};
        const dialogRef = this.dialog.open(CommentsComponent, dialogConfig);
        //------After close the dialog dataset Description will be changed
        dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }

}