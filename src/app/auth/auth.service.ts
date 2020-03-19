import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject} from 'rxjs';
import { userModel } from '../shared/user.model';
import { Router } from '@angular/router';

interface AuthResponseData{
    idToken : string;
    email : string;
    refreshToken : string ; 
    expiresIn : string ; 
    localId : string;   
    registered ?: string; 
}
@Injectable({providedIn:'root'})
export class AuthService{
    user=new BehaviorSubject<userModel>(null);
    private expiaratoinTimer : any;

    constructor(private http : HttpClient , private route:Router){}

    signUp(email : string , password : string ){
       return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD86ZPTdMbbUwxGmSxEWQR9LQGKhHVDotw',
            {
                "email" : email,
                "password" : password ,
                "returnSecureToken"  : true
            }
        ).pipe(catchError(this.handleError     
        ),tap(
            resData=>{
                this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
            }
        ));
    }

    logout(){
        this.user.next(null);
        this.route.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.expiaratoinTimer){
            clearTimeout(this.expiaratoinTimer);
        }
        this.expiaratoinTimer=null;
    }
    logIn(email : string , password : string ){
        console.log(email);
        return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD86ZPTdMbbUwxGmSxEWQR9LQGKhHVDotw',
                {
                    "email" : email,
                    "password" : password ,
                    "returnSecureToken"  : true
                }
            ).pipe(catchError(this.handleError     
        ),tap(
            resData=>{
                this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
            }
        )
        
    );
     }

     autoLogin(){
         const userData:{
             email:string;
             id:string;
             _tokenId:string;
             tokenExpirationDate : string;
         }=JSON.parse(localStorage.getItem('userData'));
         if(!userData){
             return
         }
         
         const loadedUser=new userModel(
             userData.email,
             userData.id,
             userData._tokenId,
             new Date(userData.tokenExpirationDate)
             );
             if(loadedUser.token){
                this.user.next(loadedUser);
                const expirationDuration=new Date(userData.tokenExpirationDate).getTime()-new Date().getTime();
                this.autoLogOut(expirationDuration);
            }
     }
     private handleAuthentication(email : string ,userId:string, idToken : string,expiresIn : number) {
        const expirationDate=new Date( new Date().getTime()+ expiresIn*1000)
        const user=new userModel(
            email,
            userId,
            idToken,
            expirationDate
            );
            localStorage.setItem('userData',JSON.stringify(user));
            this.autoLogOut(expiresIn*1000);
            this.user.next(user);
     }

     autoLogOut( expirationDuration :number){
         this.expiaratoinTimer=setTimeout(() => {
             this.logout();
         }, expirationDuration);
     }
     private handleError(errorRes: HttpErrorResponse) {
        
            let errorMessage='an unknown error occured';
            if(!errorRes.error || !errorRes.error.error){
                return throwError(errorMessage);
            }
            console.log(errorRes.error.error.message);
            console.log(errorRes.error);
            console.log(errorRes);
            switch(errorRes.error.error.message){
                case 'EMAIL_EXISTS' :
                    errorMessage='this email already exists';
            }
            return throwError(errorMessage);
    
     }
}