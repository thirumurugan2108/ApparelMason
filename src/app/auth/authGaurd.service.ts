import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot   , Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class authGaurd  implements CanActivate{

    constructor(private authservice : AuthService,private router :Router){}

    canActivate(route :ActivatedRouteSnapshot,Router : RouterStateSnapshot
        ): boolean | UrlTree |Promise<boolean| UrlTree> | Observable<boolean | UrlTree> 
    {
        return this.authservice.user.pipe(take(1),map(user=>{
            const isAuth=!!user;
            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
        // tap(isAuth =>
        //     if(!isAuth){
        //         this.router.navigate(['/auth'])
        //     }

        // ));
            

    }
}