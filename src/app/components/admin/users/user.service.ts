import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { User } from "./user.model";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_ROLES = environment.apiUrl + "/roles";
const BACKEND_URL_CAT = environment.apiUrl + "/category";
const BACKEND_URL_SUB_CAT = environment.apiUrl + "/subcategory";
const BACKEND_URL_JOBS = environment.apiUrl + "/job";

@Injectable({ providedIn: "root" })
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getUsers(usersPerPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    if (search) {
      queryParams += `&search=${search}`
    }
    this.http
      .get<{ message: string; users: any; userCount: number }>(
        BACKEND_URL + '/listusers' + queryParams
      )
      .pipe(
        map(userData => {
          return {
            users: userData.users,
            userCount: userData.userCount
          };
        })
      )
      .subscribe(transformedPostData => {
        this.users = transformedPostData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedPostData.userCount
        });
      });
  }

  getUser(id: string) {
    return this.http.get(BACKEND_URL + '/' + id);
  }

  search(search) {
    var queryParams = '?'
    if (search) {
      queryParams += `search=${search}`
    }
    var listOfBooks = this.http.get(BACKEND_URL + '/search' + queryParams)
      .pipe(
        debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return data;
          }
        ));
    return listOfBooks;
  }

  addUser(form: NgForm) {
    const user = {
      email: form.value.email,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      role: form.value.role,
      mobile: form.value.mobile,
      categoryId: form.value.categoryId,
      subcategoryId: form.value.subcategoryId,
      work_shift: form.value.work_shift,
      employment_status: form.value.employment_status,
      job_specification: form.value.job_specification,
      job_location: form.value.job_location,
      leave_balance: form.value.leave_balance,
      join_date: form.value.join_date,
      jobId: form.value.jobId,
      personal_email: form.value.personal_email,
      address1: form.value.address1,
      address2: form.value.address2,
      city: form.value.city,
      state: form.value.state,
      country: form.value.country,
      zip_code: form.value.zip_code,
      assignee: form.value.assignee,
      assigneeId: form.value.assignee._id,
    }
    return this.http.post<{ message: string; users: any }>(BACKEND_URL + "/", user)

  }

  updateUser(id: string, form: NgForm, jobDetailsId, userAddressId) {
    console.log(form.value)
    const user = {
      id: id,
      email: form.value.email,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      role: form.value.role,
      mobile: form.value.mobile,
      categoryId: form.value.categoryId,
      subcategoryId: form.value.subcategoryId,
      work_shift: form.value.work_shift,
      employment_status: form.value.employment_status,
      job_specification: form.value.job_specification,
      job_location: form.value.job_location,
      leave_balance: form.value.leave_balance,
      join_date: form.value.join_date,
      jobId: form.value.jobId,
      personal_email: form.value.personal_email,
      address1: form.value.address1,
      address2: form.value.address2,
      city: form.value.city,
      jobDetailsId: jobDetailsId,
      userAddressId: userAddressId,
      state: form.value.state,
      country: form.value.country,
      zip_code: form.value.zip_code,
      assignee: form.value.assignee,
      assigneeId: form.value.assignee?._id,
    };
    return this.http.put(BACKEND_URL + "/" + id, user)
  }

  deleteUser(id: string) {
    return this.http.delete(BACKEND_URL + "/" + id);
  }

  activeUserAccount(user: any) {
    return this.http.put(BACKEND_URL + "/activeuseraccount/" + user._id, user);
  }

  deactiveUserAccount(user: any) {
    return this.http.put(BACKEND_URL + "/deactiveuseraccount/" + user._id, user);
  }
  // TODO: get roles
  getRoles() {
    return this.http.get(BACKEND_URL_ROLES + '/getroles');
  }

  // TODO: get categories
  getCategories() {
    return this.http.get(BACKEND_URL_CAT + '/getcategories');
  }

  // TODO: get subcategories
  getSubcatByCatId(id: string) {
    return this.http.get(BACKEND_URL_SUB_CAT + '/categories/' + id);
  }

  // TODO: get jobs
  getJobs() {
    return this.http.get(BACKEND_URL_JOBS + '/getjobs');
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

}
