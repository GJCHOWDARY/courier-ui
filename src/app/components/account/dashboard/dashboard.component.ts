import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../account.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as _ from 'underscore';
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  day: string; date: number;
  year: number; month: string;
  orderDetatils: any; isLoading: boolean = true;
  leaves: any; userData: any;
  displayedColumns1: string[] = ['Leave Type', 'Applied Date', 'Start Date', 'End Date', 'No of Days Taken', 'Loss of Pay', 'Status', 'Action'];
  public lineChartData: Array<any> = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    label: 'Leave Taken',
    lineTension: 0,
    pointRadius: [4, 4, 4, 4],
    borderWidth: 4,
  }];

  public lineChartLabels: Array<any> = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  public lineChartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false, drawBorder: true,
          borderDash: [6, 3], zeroLineBorderDash: [6, 3],
          zeroLineColor: '#c5c0bc', color: '#c5c0bc'
        },
      }],
      yAxes: [{
        display: false,
        gridLines: { display: false, drawBorder: false, lineWidth: 0, },
        ticks: { min: 0, max: 50 }
      }]
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
  public lineChartColors: Array<any> = [
    {
      borderColor: '#f5bd89',
      backgroundColor: '#f5bd89',
      pointBackgroundColor: '#f5bd89',
      pointBorderColor: 'white',
      pointHoverBackgroundColor: '#1e88e5',
      pointHoverBorderColor: '#42a5f5'
    }
  ];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  constructor(private accountService: AccountService, private authService: AuthService) {
    let d = new Date();
    this.date = d.getDate();
    this.year = d.getFullYear();
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.month = month[d.getMonth()];
    var getday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    this.day = getday[d.getDay()];
  }

  ngOnInit(): void {
    this.userData = this.authService.getUserData();
    if (this.userData.role !== 4) {
      let a: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.accountService.getChartData().subscribe((data: any) => {
        let chartData: any = data.data
        for (let i = 0; i <= 11; i++) {
          if (chartData[i] != undefined) {
            let temp = chartData[i]._id.month - 1;
            a[temp] = (chartData[i].days + chartData[i].time / 9.5).toFixed(2)
          }
        }
        this.lineChartData[0].data = a;
        let d = new Date(), year = d.getFullYear(),
          start_date = new Date(`${year}/01/01`), end_date = new Date(`${year}/12/31`);

        this.accountService.getAppliedLeaves(start_date, end_date).subscribe((catData: any) => {
          this.leaves = catData.data;
          this.isLoading = false;
        })
      })
    }
    
    this.accountService.getOrderDetails().subscribe((data: any) => {
      this.orderDetatils = data.data
      this.isLoading = false;
    })
  }

  calHours(n: number) {
    var num: any = (n * 60).toFixed(2);
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    console.log(n, num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).");
    return `${rhours}:${rminutes}`
  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);
  }

}
