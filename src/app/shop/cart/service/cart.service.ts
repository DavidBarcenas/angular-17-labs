import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../cart';
import { Product } from '../../products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Manage state with signals
  cartItems = signal<CartItem[]>([]);
  // Number of items in the cart
  cartCount = computed(() => this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0));
  // Total up the extended price for each item
  subTotal = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );
  // Delivery is free if spending more than $100
  deliveryFee = computed<number>(() =>
    this.cartItems().length > 0 && this.subTotal() < 100 ? 17.87 : 0
  );
  // Tax could be based on shipping address zip code
  tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);
  total = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  // Add the vehicle to the cart
  // If the item is already in the cart, increase the quantity
  addToCart(product: Product) {
    const index = this.cartItems().findIndex((item) => item.product.id === product.id);
    if (index === -1) {
      // Not already in the cart, so add with default quantity of 1
      this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
    } else {
      // Already in the cart, so increase the quantity by 1
      this.cartItems.update((items) => [
        ...items.slice(0, index),
        { ...items[index], quantity: items[index].quantity + 1 },
        ...items.slice(index + 1),
      ]);
    }
  }

  // Remove the item from the cart
  removeFromCart(cartItem: CartItem): void {
    // Update the cart with a new array containing
    // all but the filtered out deleted item
    this.cartItems.update((items) =>
      items.filter((item) => item.product.id !== cartItem.product.id)
    );
  }

  // Update the cart quantity
  updateQuantity(cartItem: CartItem, quantity: number): void {
    // Update the cart with a new array containing
    // the updated item and all other original items
    this.cartItems.update((items) =>
      items.map((item) => (item.product.id === cartItem.product.id ? { ...item, quantity } : item))
    );
  }
}
