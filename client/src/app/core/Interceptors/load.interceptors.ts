import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BusyService } from '../services/busy.service';


@Injectable()
export class LoadInterceptor implements HttpInterceptor {


    constructor(private busyService: BusyService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.method === 'POST' && req.url.includes('orders')){
            return next.handle(req);
        }

        if (req.url.includes('emailexists')) {
            return next.handle(req);
        }

        this.busyService.busy();
        return next.handle(req).pipe(
            delay(1000),
            finalize(
                () => this.busyService.idle()
            )
        );
    }



}
