import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_ORDER = environment.apiUrl + "/courierOrders";
 
@Injectable({ providedIn: "root" })

export class OrderService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}
  // TODO: Roles
  getOrders(perPage: number, currentPage: number, filter: string, start_date: Date, end_date: Date) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}&start_date=${start_date}&end_date=${end_date}`;
     if(filter){
      queryParams+=`&filter=${filter}`
    }
    return this.http.get(BACKEND_URL_ORDER+'/getOrders'+queryParams);
  } 

  addOrder(data: any, userId: string) { 
    return this.http.post(BACKEND_URL_ORDER+"/create", data)
  }

  getOrderById(id: string) {
     return this.http.get(BACKEND_URL_ORDER+'/'+ id);
  }

  updateOrder(data: any, formData: any) { 
     return this.http.put(BACKEND_URL_ORDER+"/"+data._id, data) 
  }

  deleteOrder(id: string) {
    return this.http.delete(BACKEND_URL_ORDER+"/"+ id);
  }

  search(search) {
    var queryParams='?'
      if(search){
        queryParams+=`search=${search}`
      }
      var listOfBooks = this.http.get(BACKEND_URL+'/search'+ queryParams)
      .pipe(
          debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
          map(
              (data: any) => {
                  return data; 
              }
      ));
      return listOfBooks;  
  } 
}
