import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from '../shared/models/basket';
import { IBasketItem } from '../shared/models/basketItem';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
    basket$: Observable<IBasket>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
      this.basket$ = this.basketService.basket$;
  }

  removeBasketItems(item: IBasketItem): void{
      this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem): void{
      this.basketService.incrementItemQuantity(item);
  }

  dencrementItemQuantity(item: IBasketItem): void{
      this.basketService.dencrementItemQuantity(item);
  }

}
