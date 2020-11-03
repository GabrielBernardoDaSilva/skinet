import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';


declare var Stripe;

@Component({
    selector: 'app-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {


    @Input() checkOutForm: FormGroup;
    @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
    @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
    @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
    stripe: any;
    cardNumber: any;
    cardCvc: any;
    cardExpiry: any;
    cardErrors: any;
    cardHandler = this.onChange.bind(this);
    loading = false;
    cardNumberValid = false;
    cardExpiryValid = false;
    cardCvcValid = false;

    constructor(
        private basketService: BasketService,
        private checkoutService: CheckoutService,
        private toastr: ToastrService,
        private router: Router) { }




    ngOnDestroy(): void {
        this.cardNumber.destroy();
        this.cardExpiry.destroy();
        this.cardCvc.destroy();
    }


    ngAfterViewInit(): void {

        this.stripe = Stripe('pk_test_51HhgaYF8Ljr7LQfv6zl3p0WPPpiqX8Pzo5lWNA3tC6Btb0jf4NBF3wNp5eWuh5DF7uUrhVRKq0qRZDwn4xfB3InA004XO5lLA1');
        const elements = this.stripe.elements();


        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement.nativeElement);
        this.cardNumber.addEventListener('change', this.cardHandler);

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
        this.cardExpiry.addEventListener('change', this.cardHandler);

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement.nativeElement);
        this.cardCvc.addEventListener('change', this.cardHandler);


    }

    onChange(event): void {
        if (event.error) {
            this.cardErrors = event.error.message;
        } else {
            this.cardErrors = null;
        }


        switch (event.elementType) {
            case 'cardNumber':
                this.cardNumberValid = event.complete;
                break;

            case 'cardExpiry':
                this.cardExpiryValid = event.complete;
                break;
            case 'cardCvc':
                this.cardCvcValid = event.complete;
                break;
        }
    }



    async submitOrder(): Promise<any> {
        this.loading = true;
        const basket = this.basketService.getCurrentBasketValue();
        try {
            const createOrder = await this.createOrder(basket);
            const paymentResult = await this.confirmPaymentWithStripe(basket);

            if (paymentResult.paymentIntent) {
                this.basketService.deleteBasket(basket);
                const navigateExtras: NavigationExtras = { state: createOrder };
                this.router.navigate(['checkout/success'], navigateExtras);
            } else {
                this.toastr.error('Payment Failed');
            }
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
        }


    }
    private async confirmPaymentWithStripe(basket: IBasket): Promise<any> {
        return this.stripe.confirmCardPayment(basket.clientSecret, {
            payment_method: {
                card: this.cardNumber,
                billing_details: {
                    name: this.checkOutForm.get('paymentForm').get('nameOnCard').value
                }
            }
        });
    }

    private async createOrder(basket: IBasket): Promise<any> {
        const orderToCreate = this.getOrderToCreate(basket);
        return this.checkoutService.createOrder(orderToCreate).toPromise();
    }

    getOrderToCreate(basket: IBasket): IOrderToCreate {
        return {
            basketId: basket.id,
            deliveryMethodId: +this.checkOutForm.get('deliveryForm').get('deliveryMethod').value,
            shipToAddress: this.checkOutForm.get('addressForm').value
        };
    }

}
