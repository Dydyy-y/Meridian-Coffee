import { BaseService } from './base.service';
import { getHeaders } from './api';
import type { Cart } from '../types/cart.types';

class CartService extends BaseService<Cart> {
  constructor() {
    super('/carts');
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    try {
      console.log(`Chargement du panier pour l'utilisateur ${userId}`);

      // Chemin spécial : /carts/user/{id} → utiliser buildUrl('/user/' + userId)
      const response = await fetch(this.buildUrl(`/user/${userId}`), {
        method: 'GET',
        headers: getHeaders({
          includeAuth: true,   // JWT obligatoire
          contentType: 'none', // GET → pas de body
        }),
      });

      return await this.handleResponse<Cart>(response);
    } catch (error) {
      console.error(`Erreur chargement panier utilisateur ${userId}:`, error);
      throw error;
    }
  }

  async getCartItemCount(userId: number): Promise<number> {
    try {
      const response = await fetch(this.buildUrl(`/user/${userId}/count`), {
        method: 'GET',
        headers: getHeaders({
          includeAuth: true,
          contentType: 'none',
        }),
      });

      return await this.handleResponse<number>(response);
    } catch (error) {
      console.error(`Erreur comptage panier utilisateur ${userId}:`, error);
      throw error;
    }
  }

  /**
   * @param cartId    l'id du panier (depuis Cart.id)
   * @param productId l'id du produit à ajouter
   */
  async addProduct(cartId: number, productId: number): Promise<Cart> {
    try {
      console.log(`Ajout produit ${productId} au panier ${cartId}`);

      const response = await fetch(
        this.buildUrl(`/${cartId}/products/${productId}`),
        {
          method: 'POST',
          headers: getHeaders({ includeAuth: true, contentType: 'none' }),
        }
      );

      return await this.handleResponse<Cart>(response);
    } catch (error) {
      console.error(`Erreur ajout produit ${productId} au panier:`, error);
      throw error;
    }
  }

  /**
   * @param cartId    l'id du panier
   * @param productId l'id du produit à retirer
   */
  async removeProduct(cartId: number, productId: number): Promise<Cart> {
    try {
      console.log(`Retrait produit ${productId} du panier ${cartId}`);

      const response = await fetch(
        this.buildUrl(`/${cartId}/products/${productId}`),
        {
          method: 'DELETE',
          headers: getHeaders({ includeAuth: true, contentType: 'none' }),
        }
      );

      return await this.handleResponse<Cart>(response);
    } catch (error) {
      console.error(`Erreur retrait produit ${productId} du panier:`, error);
      throw error;
    }
  }
}

// Export en singleton — une seule instance pour toute l'app
export const cartService = new CartService();
