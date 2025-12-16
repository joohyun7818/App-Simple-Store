import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import type { CartItem, Order, Product } from "../types";
import { useAuth } from "./AuthContext";
import {
  addToCart,
  clearCart,
  fetchCart,
  fetchOrders,
  fetchProducts,
  placeOrder,
  removeFromCart,
  updateCartItem,
} from "../services/api";

type StoreContextType = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isRefreshing: boolean;
  refreshAll: (query?: string) => Promise<void>;
  resetProducts: () => Promise<void>;
  addItemToCart: (product: Product) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
  changeQuantity: (productId: string, delta: number) => Promise<void>;
  checkout: () => Promise<void>;
  clearAllCart: () => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshCartAndOrders = async () => {
    if (!user) {
      setCart([]);
      setOrders([]);
      return;
    }
    const [serverCart, serverOrders] = await Promise.all([
      fetchCart(user.email),
      fetchOrders(user.email),
    ]);
    setCart(serverCart);
    setOrders(serverOrders);
  };

  const refreshAll = async (query?: string) => {
    setIsRefreshing(true);
    try {
      const nextProducts = await fetchProducts(query ?? "");
      setProducts(nextProducts);
      await refreshCartAndOrders();
    } catch (e: any) {
      Alert.alert("불러오기 실패", e?.message || "서버 연결을 확인해주세요.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetProducts = async () => {
    await refreshAll("");
  };

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setCart([]);
      setOrders([]);
      return;
    }
    refreshAll().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const addItemToCart = async (product: Product) => {
    if (!user) return;
    await addToCart(user.email, product.id);
    await refreshCartAndOrders();
  };

  const removeItemFromCart = async (productId: string) => {
    if (!user) return;
    await removeFromCart(user.email, productId);
    await refreshCartAndOrders();
  };

  const changeQuantity = async (productId: string, delta: number) => {
    if (!user) return;
    const item = cart.find((c) => c.id === productId);
    if (!item) return;
    const nextQuantity = item.quantity + delta;
    await updateCartItem(user.email, productId, nextQuantity);
    await refreshCartAndOrders();
  };

  const clearAllCart = async () => {
    if (!user) return;
    await clearCart(user.email);
    await refreshCartAndOrders();
  };

  const checkout = async () => {
    if (!user) return;
    if (cart.length === 0) return;

    try {
      await placeOrder(user.email);
      await refreshCartAndOrders();
    } catch (e: any) {
      Alert.alert("주문 실패", e?.message || "주문 처리에 실패했습니다.");
    }
  };

  const value = useMemo(
    () => ({
      products,
      cart,
      orders,
      isRefreshing,
      refreshAll,
      resetProducts,
      addItemToCart,
      removeItemFromCart,
      changeQuantity,
      checkout,
      clearAllCart,
    }),
    [products, cart, orders, isRefreshing]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
