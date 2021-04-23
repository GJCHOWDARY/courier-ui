import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { environment } from "../../../environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TrackmodalComponent } from '../trackmodal/trackmodal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  processingData: any = [];
  host_ip: string = environment.ip;
  private authListenerSubs: Subscription;
  private processListenerSubs: Subscription;
  userData: any = [];
  usersAnvData: any;
  userDetails: any = {};
  selectedFiles: any;
  sidenavWidth = 4;
  private toggelListener = new Subject<boolean>();

  constructor(private authService: AuthService, public dialog: MatDialog, private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userData = this.authService.getUserData()
    if (this.userIsAuthenticated) {
      this.getUserDetails();
      this.getEmpAnniversaries();
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userData = this.authService.getUserData()
        if (this.userIsAuthenticated) {
          this.getUserDetails();
          this.getEmpAnniversaries();
        }
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files[0];
    let name = this.selectedFiles.name
    let formData = new FormData();
    formData.append("file", this.selectedFiles);
    formData.append("filename", name);
    this.authService.updateProfileImg(formData)
  }

  getUserDetails() {
    this.authService.getUserDetails().subscribe((res: any) => {
      this.userDetails = res.user;
    },
      error => {
      });
  }

  getEmpAnniversaries() {
    if (this.userData.role !== 4) {
      this.authService.getEmpAnniversaries().subscribe((res: any) => {
        this.usersAnvData = res.data;
      },
        error => {
          console.log(error);
        });
    }
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent, { data: this.usersAnvData });
  }

  onLogout() {
    this.authService.logout();
  }

  Toggle() {
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

}
