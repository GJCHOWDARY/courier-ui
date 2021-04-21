import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { LeaveService } from "../leave.service";


@Component({
  selector: 'app-leave-calendar',
  templateUrl: './leave-calendar.component.html',
  styleUrls: ['./leave-calendar.component.css']
})
export class LeaveCalendarComponent implements OnInit {
  userId: String;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin];
  calendarWeekends = true;
  start_date; end_date; isLoading:boolean=true;
  calendarEvents: EventInput[] = [];

   constructor(private activatedRoute: ActivatedRoute, private leaveService:LeaveService) {
     this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
       this.userId= paramMap.get("userId");
      })
      
      let d= new Date(), month = d.getMonth(),
      year = d.getFullYear(), day = d.getDate();
      this.start_date=new Date(`${year}/01/01`);
      this.end_date=new Date(`${year}/12/31`);
    }

 @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  ngOnInit(): void {
    this.isLoading = true;
   if(!this.userId||this.userId==null){
    this.userId=this.leaveService.getUserId();
  }

  this.leaveService.getCalendarLeaves(this.start_date, this.end_date).subscribe((catData:any) => {
          this.calendarEvents=catData.data;
          this.isLoading = false; 
      })
  }

  
  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'New Event',
        start_date: arg.date,
        allDay: arg.allDay
      })
    }
  }

}
