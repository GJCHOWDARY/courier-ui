import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  isLoading: Boolean = false;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
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

}
