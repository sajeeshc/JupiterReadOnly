import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

constructor(private http: HttpClient) { }

validate(url: string) {
  return this.http.get(url).pipe(
    map((response: any) => {
      const result = response;
      if (result) {
        return response;
      }
    })
  );
}

}
