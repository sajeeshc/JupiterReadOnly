import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }


    getProfileDetails (userid: String, token: String) {
        let header = new HttpHeaders().set(
            "Authorization",
            'Bearer ' + token
        );
        return this.http.get<any>(this.baseUrl + "users/" + userid, { headers: header });
    }

    updateProfileDetails (model: any, token: any) {
        let header = new HttpHeaders().set(
            "Authorization",
            'Bearer ' + token
        );
        return this.http.put(this.baseUrl+'users', model, { headers: header });
    }

    createUser (model: any) {
        return this.http.post(`${this.baseUrl}users`, model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    verifyUser (model: any) {
        return this.http.post(`${this.baseUrl}users/account/activate`, model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    getInstitutions () {
        return this.http.get(this.baseUrl + 'v1/teamstore/institutions').pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    getStores (institutionName: any) {
        return this.http.get(this.baseUrl + 'v1/teamstore/institution/' + institutionName + '/stores').pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    forgotPassword (model: any) {
        return this.http.post(`${this.baseUrl}users/password/forgot`, model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    restPassword (model: any) {
        return this.http.put(this.baseUrl + 'users/password/reset', model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );

    }

    resendOtp (email: any) {
        return this.http.put(this.baseUrl + 'users/' + email + "/otp/send", {}).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    verifyUserAccount (userId, model: any) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/verify', model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    userCredit(formData){
        return this.http.post(this.baseUrl + 'users/credits', formData).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    getUserCreditInfo(userId){
        return this.http.get(this.baseUrl + 'users/credits?userId=' + userId).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

    getCreditOrganizations(params){
        return this.http.get(this.baseUrl + `users/credits/organizations?isApproved=${params.isApproved||false}&isNotApplied=${params.isNotApplied||false}`).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    return response;
                }
            })
        );
    }

}
