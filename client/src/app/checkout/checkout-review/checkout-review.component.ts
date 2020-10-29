import { Component, Input, OnInit } from '@angular/core';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
    selector: 'app-checkout-review',
    templateUrl: './checkout-review.component.html',
    styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {

    @Input() basket: IBasket;

    constructor() { }

    ngOnInit(): void {
    }

}
