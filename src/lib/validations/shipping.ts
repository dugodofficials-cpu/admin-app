import { z } from 'zod';

export const shippingSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be less than 100 characters'),
  zipCode: z
    .string()
    .regex(/^\d+$/, 'ZIP code must contain only numbers')
    .min(5, 'ZIP code must be at least 5 digits')
    .max(10, 'ZIP code must be less than 10 digits'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
