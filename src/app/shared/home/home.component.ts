import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { NgForm, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../auth/auth.service";

 @Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  host_ip: string=environment.ip;
  isLoading:Boolean=false;
  gridList = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  slides = [
    {img: "https://www.solodev.com/assets/carousel/image1.png"},
    {img: "https://www.solodev.com/assets/carousel/image2.png"},
    {img: "https://www.solodev.com/assets/carousel/image3.png"},
    {img: "https://www.solodev.com/assets/carousel/image4.png"},
    {img: "https://www.solodev.com/assets/carousel/image5.png"},
    {img: "https://www.solodev.com/assets/carousel/image6.png"},
    {img: "https://www.solodev.com/assets/carousel/image7.png"},
    {img: "https://www.solodev.com/assets/carousel/image7.png"}
  ];
  slideConfig = {
    slidesToShow: 4, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    dots: false,
    adaptiveHeight: false,
    pauseOnHover: false,
    responsive: [{
    breakpoint: 768,
    settings: {
      slidesToShow: 3
    }
  }, {
    breakpoint: 520,
    settings: {
      slidesToShow: 2
    }
  }]
  };
  
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  email :string;
  role  :string;
  verifyEmail:string;

constructor(public authService: AuthService,
  private activatedRoute: ActivatedRoute,
   private router: Router) {
 }

ngOnInit() {
  this.authService.autoAuthUser();  
  localStorage.removeItem("ProcessingData"); 
  this.userIsAuthenticated = this.authService.getIsAuth();
  console.log(this.userIsAuthenticated);
  if (!this.userIsAuthenticated) {
    this.router.navigate(['/']);
  }else{
  this.router.navigate(['/dashboard']);
  }
}

sendMessage(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading=true; 
  }

onLogout() {
 this.authService.logout();
}
}