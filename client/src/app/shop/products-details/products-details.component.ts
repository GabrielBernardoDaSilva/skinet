import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProducts } from 'src/app/shared/models/products';
import { ShopService } from '../shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
    selector: 'app-products-details',
    templateUrl: './products-details.component.html',
    styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

    product: IProducts;
    quantity = 1;

    constructor(
        private shopService: ShopService,
        private activatedRoute: ActivatedRoute,
        private bcService: BreadcrumbService,
        private basketService: BasketService
    ) {
        bcService.set('@productDetails', '');
    }

    ngOnInit(): void {
        this.loadProducts();
    }
    addItemToBasket(): void {
        this.basketService.addItemBasket(this.product, this.quantity)
    }

    incrementQuantity(): void {
        this.quantity++;
    }

    dencrementQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    loadProducts(): void {
        this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
            product => {
                this.product = product;
                this.bcService.set('@productDetails', product.name);
            },
            error => console.log(error)
        );
    }

}
