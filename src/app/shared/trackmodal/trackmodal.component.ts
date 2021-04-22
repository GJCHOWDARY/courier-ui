import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-trackmodal',
  templateUrl: './trackmodal.component.html',
  styleUrls: ['./trackmodal.component.css']
})
export class TrackmodalComponent implements OnInit {

  isLoading = false;
  role: any = []; disablerole = true;
  data: any = [];
  roleId: string;
  mode: string;
  isEdit = true;
  userId = null;

  constructor(private dialogRef: MatDialogRef<TrackmodalComponent>,
    public route: ActivatedRoute,
    private router: Router, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
    console.log(data, "0000000")
    this.data = data;
    this.role = { _id: '', role_name: '', role_desc: '', role_id: '' };
  }

  ngOnInit() {
  }

  onSaveRole(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
  }

  close() {
    this.dialogRef.close();
  }
}
