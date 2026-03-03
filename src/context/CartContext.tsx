import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { cartService } from '../services/cart.service';
import { useAuth } from './AuthContext';
import type { Cart } from '../types/cart.types';

interface CartContextType {
  cart: Cart | null;       
  isLoading: boolean;           
  loadingProductId: number | null;
  addToCart: (productId: number) => Promise<void>;   
  removeFromCart: (productId: number) => Promise<void>; 
  refreshCart: () => Promise<void>;                 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}
export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated, user } = useAuth(); //Lire auth depuis AuthContext

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const refreshCart = useCallback(async () => {
    // Garde : ne charger le panier que si l'utilisateur est connecté
    if (!isAuthenticated || !user) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.getCartByUserId(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      // On ne lance pas l'erreur pour ne pas bloquer l'app si le panier est indisponible
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null); // Vider le panier si déconnecté
    }
  }, [isAuthenticated, user, refreshCart]);

  const addToCart = useCallback(
    async (productId: number) => {
      if (!isAuthenticated || !user) return;

      try {
        setLoadingProductId(productId);

        // Si le panier n'est pas encore chargé, on le récupère d'abord
        let currentCart = cart;
        if (!currentCart) {
          currentCart = await cartService.getCartByUserId(user.id);
          setCart(currentCart);
        }

        if (!currentCart) throw new Error('Impossible de charger le panier');

        // POST /api/carts/{cart_id}/products/{product_id}
        const updatedCart = await cartService.addProduct(currentCart.id, productId);
        setCart(updatedCart);
      } catch (error) {
        console.error(`Erreur ajout produit ${productId}:`, error);
        throw error;
      } finally {
        setLoadingProductId(null);
      }
    },
    [cart, isAuthenticated, user]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!isAuthenticated || !user) return;

      try {
        setLoadingProductId(productId);

        let currentCart = cart;
        if (!currentCart) {
          currentCart = await cartService.getCartByUserId(user.id);
          setCart(currentCart);
        }

        if (!currentCart) throw new Error('Impossible de charger le panier');

        // DELETE /api/carts/{cart_id}/products/{product_id}
        const updatedCart = await cartService.removeProduct(currentCart.id, productId);
        setCart(updatedCart);
      } catch (error) {
        console.error(`Erreur retrait produit ${productId}:`, error);
        throw error;
      } finally {
        setLoadingProductId(null);
      }
    },
    [cart, isAuthenticated, user]
  );

  return (
    <CartContext.Provider
      value={{ cart, isLoading, loadingProductId, addToCart, removeFromCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart() doit être utilisé dans un <CartProvider>');
  }
  return context;
};
