import { z } from 'zod';
import { ProductStatus, ProductType } from '@/lib/api/products';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  stockQuantity: z.string(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  status: z.nativeEnum(ProductStatus),
  sku: z.string().min(1, 'SKU is required'),
  sizes: z.array(z.string()),
  color: z.string().min(1, 'Color is required'),
  type: z.nativeEnum(ProductType),
  images: z.array(z.string()),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
  bundleItems: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    title: z.string().min(1, 'Title is required'),
  })).optional(),
  bundlePrice: z.string().min(1, 'Bundle price is required').optional(),
  bundleTier: z.string().min(1, 'Bundle tier is required').optional(),
});

export const editProductSchema = productSchema.partial();

export const createProductSchema = productSchema.extend({
  tags: z.string().min(1, 'Shipping category is required'),
  isFeatured: z.boolean().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;
