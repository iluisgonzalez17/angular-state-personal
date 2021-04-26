import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/catch';
import { tap, map, switchMap, mergeMap, catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import {
    AuthActionTypes,
    LogIn, LogInSuccess, LogInFailure,
} from '../actions/auth.actions';


@Injectable()
export class AuthEffects {
    constructor(
        private actions: Actions,
        private authService: AuthService,
        private router: Router,
    ) { }

    // effects go here
    LogIn: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.LOGIN),
        map((action: LogIn) => action.payload),
        switchMap(payload => {
            console.log('payload', payload);
            return this.authService.logIn(payload.email, payload.password).pipe(
                map((user) => {
                    console.log('response',user);
                    return new LogInSuccess({ token: user.token, email: user.email });
                }),
                catchError((error) => {
                    console.log(error)
                    return Observable.of(new LogInFailure({ error: error }));
                })
            );
        })
    )

    );

    LogInSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user) => {
            console.log('entre');
            localStorage.setItem('token', user);
            this.router.navigateByUrl('/');
        })
    );

    LogInFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE)
    );
}