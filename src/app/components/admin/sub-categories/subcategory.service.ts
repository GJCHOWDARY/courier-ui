import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_CAT = environment.apiUrl + "/subcategory";
 
@Injectable({ providedIn: "root" })
export class SubCategoryService { 
  constructor(private http: HttpClient, private router: Router) {}
  // TODO: Roles
  getCategories(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    console.log(search);
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_CAT+'/getsubcategories'+queryParams);
  }

  addCategory(sub_category_name: string, sub_category_desc: string,categoryId: string) {
    const jobCategory ={
      sub_category_name: sub_category_name,
      sub_category_desc: sub_category_desc,
      categoryId: categoryId
    }
    return this.http.post(BACKEND_URL_CAT+"/create", jobCategory)
  }

  getCategoryById(id: string) {
     return this.http.get(BACKEND_URL_CAT+'/'+ id);
  }

  updateCategory(id: string, sub_category_name: string, sub_category_desc: string, categoryId: string) {
    let categoryData = {
      id: id,
      sub_category_name: sub_category_name,
      sub_category_desc: sub_category_desc,
      categoryId: categoryId
     };
     return this.http.put(BACKEND_URL_CAT+"/"+id, categoryData) 
  }

  deleteCategory(id: string) {
    return this.http.delete(BACKEND_URL_CAT+"/"+ id);
  }
}
