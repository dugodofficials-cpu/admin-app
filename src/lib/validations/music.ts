import * as z from 'zod';

export const singleFormSchema = z.object({
  name: z.string().min(1, 'Song title is required'),
  albumId: z.string().min(1, 'Album is required'),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().min(1, 'Description is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  categories: z.string().min(1, 'Categories are required'),
  tags: z.string().optional(),
  order: z.string().min(1, 'Order is required'),
  isActive: z.boolean().optional(),
  audioFile: z.string().min(1, 'Audio file is required')
});

export type SingleFormData = z.infer<typeof singleFormSchema>; 