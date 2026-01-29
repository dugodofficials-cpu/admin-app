import {
  addToCart,
  AddToCartParams,
  applyCouponCode,
  CartItemResponse,
  CartStatus,
  getCart,
  removeFromCart,
  updateCartStatus,
} from '@/lib/api/cart';
import { Product } from '@/lib/api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

export const useCart = () => {
  return useQuery<CartItemResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        return await getCart();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch cart', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddToCartParams) => {
      return addToCart(params);
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to add item to cart', { variant: 'error' });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      cartId,
      selectedOptions,
    }: {
      productId: string;
      cartId: string;
      selectedOptions?: Record<string, string>;
    }) => {
      return removeFromCart(productId, cartId, selectedOptions);
    },

    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar('Failed to remove item from cart', { variant: 'error' });
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      product,
      quantity,
      selectedOptions,
    }: {
      product: Product;
      quantity: number;
      selectedOptions?: Record<string, string>;
    }) => {
      return addToCart({
        item: {
          product: product._id,
          quantity,
          selectedOptions,
        },
      });
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update cart item quantity', { variant: 'error' });
    },
  });
};

export const useUpdateCartStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, status }: { cartId: string; status: CartStatus }) => {
      return updateCartStatus(cartId, status);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update cart status', { variant: 'error' });
    },
  });
};

export const useCartDrawer = () => {
  const { data: cart } = useCart();
  const isOpen = cart?.data.items.length && cart.data.items.length > 0;
  const open = () => {
  };
  const close = () => {
  };
  const toggle = () => {
  };
  return { isOpen, open, close, toggle };
};

export const useApplyCouponCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, cartId }: { code: string; cartId: string }) => {
      return applyCouponCode(code, cartId);
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to apply coupon code: ${error.message}`, { variant: 'error' });
    },
  });
};
