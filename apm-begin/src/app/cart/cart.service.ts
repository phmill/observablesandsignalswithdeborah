import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + item.quantity, 0));

  subTotal = computed(() => this.cartItems()
    .reduce((accTotal, item) => accTotal + (item.product.price * item.quantity), 0)
  );

  deliveryFee = computed(() => this.subTotal() < 50 ? 5.99 : 0);
  tax = computed(() => Math.round(this.subTotal()* 10.75) / 100);
  totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());


  eLength = effect(() => console.log('Cart Array length:', this.cartItems().length));

  addToCart(product: Product): void {
    // check if the product is already in the cart
    // if yes increase quantity
    // if no add the product
    const index = this.cartItems().findIndex(item =>
      item.product.id === product.id);

    if (index === -1) {
      // Not already in the cart, so add with default quantity of 1
      this.cartItems.update(items => [...items, { product, quantity: 1 }]);
    }
    else
      {
        // Already in the cart, so increase the quantity by 1
        // increase quantity by 1 until reaching the available quantity

        // console.log('we are at index:', index);

        const availableQty = this.cartItems()[index].product.quantityInStock || 0;
        // console.log('available quantity:', availableQty);

        const qty = (this.cartItems()[index].quantity +1) <= availableQty ?
        this.cartItems()[index].quantity +1 : this.cartItems()[index].quantity;
        // console.log('set quantity to:', qty);


        this.cartItems.update(items =>
          [
            ...items.slice(0, index),
            { ...items[index], quantity: qty },
            ...items.slice(index+1)
          ]
        );
      }

  }

  removeFromCart(cartItem: CartItem):void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== cartItem.product.id));
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item => item.product.id === cartItem.product.id ?
        { ...item, quantity } : item
      )
    );
  }

}
