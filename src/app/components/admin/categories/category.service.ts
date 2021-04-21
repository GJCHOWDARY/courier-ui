import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_CAT = environment.apiUrl + "/category";
 
@Injectable({ providedIn: "root" })
export class CategoryService { 
  
  constructor(private http: HttpClient, private router: Router) {}

  getCategories(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_CAT+'/getcategories'+queryParams);
  }

  addCategory(category_name: string, category_desc: string) {
    const jobCategory ={
      category_name: category_name,
      category_desc: category_desc
    }
    return this.http.post(BACKEND_URL_CAT+"/create", jobCategory)
  }

  getCategoryById(id: string) {
     return this.http.get(BACKEND_URL_CAT+'/'+ id);
  }

  updateCategory(id: string, category_name: string, category_desc: string) {
    let categoryData = {
      id: id,
      category_name: category_name,
      category_desc: category_desc,
     };
     return this.http.put(BACKEND_URL_CAT+"/"+id, categoryData) 
  }

  deleteCategory(id: string) {
    return this.http.delete(BACKEND_URL_CAT+"/"+ id);
  }
}
