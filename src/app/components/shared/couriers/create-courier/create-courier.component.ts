import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { OrderService } from "../courier.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-courier-project',
  templateUrl: './create-courier.component.html',
  styleUrls: ['./create-courier.component.css']
})

export class CreateCouriersComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  isLoading = true;
  order: any = [];
  data: any = []; searchUser: any;
  horizontalPos: MatSnackBarHorizontalPosition = 'right';
  verticalPos: MatSnackBarVerticalPosition = 'top';
  sankBardata: any = {};
  assignedUsers: any = [];
  mode: string;
  isEdit = true;
  userId: string;
  services: string[] = ['Parcel', 'Luggage', 'Documents', 'Electronics', 'Others'];

  @ViewChild('assigneeInput') assigneeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public orderService: OrderService, private dialogRef: MatDialogRef<CreateCouriersComponent>,
    public route: ActivatedRoute, private _snackBar: MatSnackBar,
    private router: Router, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
    this.data = data;
    this.order = {
      _id: '', 
      name: '',
      desc: '',
      mobile: '',
      email: '', 
      type: '',
      qty: '',
      customerId: '',
      amount: '',
      from: {
        from_address: '', 
        from_city: '',
        from_state: '',
        from_country: '',
        from_zip_code: '',
      },
      to: {
        to_address: '', 
        to_city: '',
        to_state: '',
        to_country: '',
        to_zip_code: '',
      },
      location: [],
      assignedUsers: []
    };
  }

  ngOnInit() {
    if (this.data.id && this.data.mode == 'edit') {
      this.orderService.getOrderById(this.data.id).subscribe((resData: any) => {
        this.isLoading = false;
        this.isEdit = true;
        this.mode = "edit";
        console.log('ttt', resData)
        this.order = resData.data[0];
      });
    } else {
      this.isLoading = false;
      this.mode = "create";
      this.isEdit = false;
      this.userId = null;
    }
  }

  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.order,form.value)
    if (this.mode === "create") {
      this.orderService.addOrder(this.order, this.userId)
        .subscribe(responseData => {
          this.dialogRef.close();
        }, error => {
          this.isLoading = false;
        });
    } else {
      this.orderService.updateOrder(this.order, form.value)
        .subscribe(responseData => {
          this.dialogRef.close();
        }, error => {
          this.isLoading = false;
        });
    }
  }

  searchUsers(term: string) {
    if (term) {
      this.orderService.search(term).subscribe(
        data => {
          this.searchUser = data.users;
        })
    }
  }

  displayFn(user: any) {
    return user ? user.first_name + ' ' + user.last_name : '';
  }

  onSelection(event: MatAutocompleteSelectedEvent): void {
    const value: any = event.option.value;
    let index = this.order.assignedUsers.findIndex(option => option._id === value._id);
    console.log(index, value)
    if (index == -1) {
      // Add our fruit 
      this.order.assignedUsers.push(event.option.value);
      // this.assigneeInput.nativeElement.value = '';
      // this.fruitCtrl.setValue(null);
    } else {
      this.sankBardata.message = "User Allready Exist in this Project."
      this.openSnakBar();
      this.fruitCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.order.assignedUsers.push(event.option.viewValue);
    this.order.assignedUsers.nativeElement.value = '';
    this.order.assignedUsers.setValue(null);
  }

  remove(user: string): void {
    const index = this.order.assignedUsers.indexOf(user);

    if (index >= 0) {
      this.order.assignedUsers.splice(index, 1);
    }
  }

  close() {
    this.dialogRef.close();
  }

  openSnakBar() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration = 8000;
    this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }
}
