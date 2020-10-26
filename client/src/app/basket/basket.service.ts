import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Basket, IBasket } from '../shared/models/basket';
import { IBasketItem } from '../shared/models/basketItem';
import { IBasketTotals } from '../shared/models/basketTotal';
import { IProducts } from '../shared/models/products';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
    providedIn: 'root'
})
export class BasketService {
    baseUrl = environment.apiUrl;
    private basketSource = new BehaviorSubject<IBasket>(null);
    basket$ = this.basketSource.asObservable();
    private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
    basketTotal$ = this.basketTotalSource.asObservable();

    constructor(private http: HttpClient) { }


    getBasket(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}basket?id=${id}`)
            .pipe(
                map((basket: IBasket) => {
                    this.basketSource.next(basket);
                    this.calcualteTotals();
                })
            );
    }
    setBasket(basket: IBasket): Subscription {
        return this.http.post(`${this.baseUrl}basket`, basket).subscribe(
            (response: IBasket) => {
                this.basketSource.next(response);
                this.calcualteTotals();
            },
            (error) => console.log(error)
        );
    }

    getCurrentBasketValue(): IBasket {
        return this.basketSource.value;
    }


    addItemBasket(item: IProducts, quantity = 1): void {
        const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
        const basket = this.getCurrentBasketValue() ?? this.createBasket();
        basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
        this.setBasket(basket);
    }

    incrementItemQuantity(item: IBasketItem): void {
        const basket = this.getCurrentBasketValue();
        const foundItemIndex = basket.items.findIndex(i => i.id === item.id);
        basket.items[foundItemIndex].quantity ++;
        this.setBasket(basket);
    }

    dencrementItemQuantity(item: IBasketItem): void {
        const basket = this.getCurrentBasketValue();
        const foundItemIndex = basket.items.findIndex(i => i.id === item.id);
        if (basket.items[foundItemIndex].quantity > 1) {
            basket.items[foundItemIndex].quantity--;
        }else{
            this.removeItemFromBasket(item);
        }
        this.setBasket(basket);
    }


    removeItemFromBasket(item: IBasketItem) {
        const basket = this.getCurrentBasketValue();
        if (basket.items.some(x => x.id === item.id)){
            basket.items = basket.items.filter(i => i.id !== item.id);
            if (basket.items.length > 0){
                this.setBasket(basket);
            }else{
                this.deleteBasket(basket);
            }
        }
    }

    deleteBasket(basket: IBasket) {
        return this.http.delete(`${this.baseUrl}basket?id=${basket.id}`).subscribe(
            () =>{
                this.basketSource.next(null);
                this.basketTotalSource.next(null);
                localStorage.removeItem('basket_id');
            }, error => console.log(error)
        );
    }

    private calcualteTotals(): void {
        const basket = this.getCurrentBasketValue();
        const shipping = 0;
        const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
        const total = shipping + subtotal;
        this.basketTotalSource.next({ shipping, total, subtotal });
    }

    private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
        const index = items.findIndex(i => i.id === itemToAdd.id);
        if (index === -1) {
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
        } else {
            items[index].quantity += quantity;
        }

        return items;
    }



    private createBasket(): IBasket {
        const basket = new Basket();
        localStorage.setItem('basket_id', basket.id);
        return basket;
    }

    private mapProductItemToBasketItem(item: IProducts, quantity: number): IBasketItem {
        return {
            id: item.id,
            productName: item.name,
            price: item.price,
            pictureUrl: item.pictureUrl,
            quantity,
            brand: item.productBrand,
            type: item.productType
        };
    }
}
