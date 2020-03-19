import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
    selector:'app-auth',
    templateUrl:'authComponent.html'
})
export class authComponent{
isLoginMode=true;
isLoading=false;
error : string=null;
authObs:Observable<any>;
constructor(private authService :AuthService , private route : Router){}
switchMode(){
    this.isLoginMode=!this.isLoginMode;
}

onSubmit(form : NgForm){
    if(!form.valid){
        return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading=true;
    if(this.isLoginMode){
        console.log('hi');
        this.authObs=this.authService.logIn(email,password);
        
    }
    else{
        this.authObs=this.authService.signUp(email,password);
    }
    this.authObs.subscribe(
        resData =>{
        console.log(resData);
        this.isLoading=false;
        this.route.navigate(['/managePosts']);
    },
    errorMessage=>{
        this.isLoading=false;
       this.error=errorMessage;
        
    }
    );
    form.reset();
}
}