import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';
  sub!: Subscription;

  private productService = inject(ProductService);

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  addToCart(product: Product) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;

    if (id) {
      this.sub = this.productService.getProduct(id).pipe(
        // tap(() => console.log('In ProductDetailComponent pipeline')),
        tap(product => {
          this.product = product;
          console.log(product);
        }),
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    if(this.sub) {
     this.sub.unsubscribe();
    }
  }
}
