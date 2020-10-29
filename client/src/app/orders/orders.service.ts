import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }


    getOrderForUsers(): Observable<any>{
        return this.http.get(`${this.baseUrl}orders`);
    }

    getOrderDetailed(id: number): Observable<any>{
        return this.http.get(`${this.baseUrl}orders/${id}`);
    }
}
