import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
    selector: 'app-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {

    @Input() checkOutForm: FormGroup;

    constructor(private basketService: BasketService,
                private checkoutService: CheckoutService,
                private toastr: ToastrService,
                private router: Router) { }

    ngOnInit(): void {
    }

    submitOrder(): void {
        const basket = this.basketService.getCurrentBasketValue();
        const orderToCreate = this.getOrderToCreate(basket);
        this.checkoutService.createOrder(orderToCreate).subscribe(
            (order: IOrder) => {
                this.toastr.success('Order create successfully');
                this.basketService.deleteLocalBasket(basket.id);
                const navigateExtras: NavigationExtras = { state: order };
                this.router.navigate(['checkout/success'], navigateExtras);
            }, error => {
                this.toastr.error(error.message);
                console.log(error);
            }
        );
    }

    getOrderToCreate(basket: IBasket): IOrderToCreate {
        return {
            basketId: basket.id,
            deliveryMethodId: +this.checkOutForm.get('deliveryForm').get('deliveryMethod').value,
            shipToAddress: this.checkOutForm.get('addressForm').value
        };
    }

}
