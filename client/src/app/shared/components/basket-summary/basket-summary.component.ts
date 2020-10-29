import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from '../../models/basket';
import { IBasketItem } from '../../models/basketItem';

@Component({
    selector: 'app-basket-summary',
    templateUrl: './basket-summary.component.html',
    styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
    basket$: Observable<IBasket>;
    @Input() isBasket = true;
    @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
    @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
    @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();


    constructor(private basketService: BasketService) { }

    ngOnInit(): void {
        this.basket$ = this.basketService.basket$;
    }

    dencrementItemQuantity(item: IBasketItem): void {
        this.decrement.emit(item);
    }
    incrementItemQuantity(item: IBasketItem): void {
        this.increment.emit(item);
    }
    removeBasketItems(item: IBasketItem): void {
        this.remove.emit(item);
    }

}
