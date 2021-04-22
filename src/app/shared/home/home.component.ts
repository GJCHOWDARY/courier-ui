import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

 @Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  host_ip: string=environment.ip;

  constructor() { }

  ngOnInit(): void {
  }

}

/*
@Component({selector: 'ngbd-carousel-basic', templateUrl: './carousel-basic.html'})
export class NgbdCarouselBasic {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
} */