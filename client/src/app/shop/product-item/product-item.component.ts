import { Component, Input, OnInit } from '@angular/core';
import { IProducts } from '../../shared/models/products';
import { BasketService } from '../../basket/basket.service';

@Component({
    selector: 'app-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {


    @Input() product: IProducts;

    constructor(private basketService: BasketService) { }

    ngOnInit(): void {
    }

    addItemToBasket(): void{
        this.basketService.addItemBasket(this.product);
    }
}
