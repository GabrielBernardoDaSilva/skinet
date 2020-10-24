import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProducts } from 'src/app/shared/models/products';
import { ShopService } from '../shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

  product: IProducts;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService
    ) {
      bcService.set('@productDetails', '');
    }

  ngOnInit(): void {
    this.loadProducts();
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
