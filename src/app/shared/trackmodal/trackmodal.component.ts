import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-trackmodal',
  templateUrl: './trackmodal.component.html',
  styleUrls: ['./trackmodal.component.css']
})
export class TrackmodalComponent implements OnInit {

  isLoading = false; disablerole = true;
  data: any = [];
  roleId: string;
  view: boolean = false;
  orders: any = [];
  mode: string;
  isEdit = true;
  userId = null;

  constructor(
    private dialogRef: MatDialogRef<TrackmodalComponent>,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
    this.data = data;
  }

  ngOnInit() {
  }

  onTract(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.trackOrders(form.value.orderIds).subscribe((res: any) => {
      this.orders = res.orders;
      this.view = true;
      this.isLoading = false;
    },
      error => {
        this.isLoading = false;
      });
  }

  close() {
    this.dialogRef.close();
  }
}
