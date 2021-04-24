import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap, Params } from "@angular/router";
import { NgForm, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../auth/auth.service";
import { TrackmodalComponent } from '../trackmodal/trackmodal.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  isLoading: Boolean = false;
  latitude: number = 12.972442;
  longitude: number = 77.580643;
  zoom: number = 8;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  email: string;
  role: string;
  verifyEmail: string;

  constructor(public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit() {
    this.setCurrentLocation();
    this.authService.autoAuthUser();
    localStorage.removeItem("ProcessingData");
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (!this.userIsAuthenticated) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(["/authorized/emp/"]);
    }
  }

  //INFO: Get Current Location Coordinates
  setCurrentLocation() {
    console.log("maps...", navigator)
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 8;
      console.log(position);
    });
  }

  sendMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.sendEmail(form.value).subscribe((res: any) => {
      this.isLoading = false;
      form.reset();
      alert('Your support will connect you shortly.');
    },
      error => {
        this.isLoading = false;
      });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '962px';
    dialogConfig.width = '740px';
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(TrackmodalComponent, dialogConfig);
    //------After close the dialog dataset Description will be changed
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onLogout() {
    this.authService.logout();
  }
}