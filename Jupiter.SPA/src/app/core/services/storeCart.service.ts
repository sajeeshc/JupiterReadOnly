import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreCartService {
  private baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getTeamStoreProducts(teamStoreId: number, optionalParams: string =""){
  var keyword = "";

  if(optionalParams!=null && optionalParams!=undefined&& optionalParams!="")
    keyword = optionalParams;

  return this.http.get(this.baseUrl + "v1/cart/"+teamStoreId+"/products?Keyword="+keyword).pipe(
    map((response: any) => {
        return response;
    })
  );
}
}
