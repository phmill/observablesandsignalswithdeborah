import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy{
  pageTitle = 'Products';
  errorMessage = '';
  sub!:Subscription;

  private productService = inject(ProductService);

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }

  ngOnInit(): void {
      this.sub = this.productService.getProducts().pipe(
        // tap(() => console.log('In ProductListComponent pipeline')),
        tap(products => {
          this.products = products
          console.log(products);})
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
