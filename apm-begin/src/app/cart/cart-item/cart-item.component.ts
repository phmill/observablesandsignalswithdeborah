import { Component, Input, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {


  @Input({ required: true }) set cartItem(ci: CartItem){
    this.item.set(ci);
  }

  private cartService = inject(CartService);

  item = signal<CartItem>(undefined!);

  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  // qtyArr = [...Array(8).keys()].map(x => x + 1);
  // use the quantity that is recorded in the product
  // Build an array of numbers from 1 to qty available
  qtyArr = computed<Number[]>(() =>
    [...Array(this.item().product.quantityInStock).keys()].map(x => x + 1));
    
  // Calculate the extended price
  exPrice = computed(() => this.item().product.price * this.item().quantity);

  onQuantitySelected(quantity: number): void {
    this.cartService.updateQuantity(this.item(), Number(quantity));
  }

  removeFromCart(): void {
    this.cartService.removeFromCart(this.item());
  }
}
