import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProducts } from 'src/app/shared/models/products';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

  product: IProducts;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
      product => this.product = product,
      error => console.log(error)
    );
  }

}
