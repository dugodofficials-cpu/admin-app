'use client';

import { useCreateProduct, useProducts } from '@/hooks/products';
import {
  BundleItem,
  CreateProductDto,
  Product,
  ProductStatus,
  ProductType,
} from '@/lib/api/products';
import { productCategories } from '@/lib/utils/categories';
import { ROUTES } from '@/utils/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const bundleSchema = z.object({
  name: z.string().min(3, 'Bundle name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sku: z.string().min(1, 'SKU is required'),
  bundlePrice: z.string().min(1, 'Bundle price is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  status: z.nativeEnum(ProductStatus),
  bundleItems: z
    .array(
      z.object({
        productId: z.string().optional(),
        quantity: z.number().optional(),
        title: z.string().min(1, 'Title is required'),
      }),
    )
    .min(1, 'At least one bundle item is required'),
  bundleTier: z.string().min(1, 'Bundle tier is required'),
  isActive: z.boolean().optional(),
});

type BundleFormData = z.infer<typeof bundleSchema>;

const bundleTiers = ['platinum', 'diamond', 'gold'];

export function CreateBundleForm() {
  const [selectedProducts, setSelectedProducts] = useState<BundleItem[]>([]);
  const { data: availableProducts } = useProducts({ limit: 10000 });

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct(ROUTES.DASHBOARD.SHOP.HOME);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BundleFormData>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      bundlePrice: '',
      categories: [],
      status: ProductStatus.DRAFT,
      bundleItems: [],
      bundleTier: '',
      isActive: true,
    },
  });

  const handleAddBundleItem = () => {
    const newItem: BundleItem = {
      productId: '',
      quantity: 1,
      title: '',
    };
    setSelectedProducts([...selectedProducts, newItem]);
    setValue('bundleItems', [...selectedProducts, newItem]);
  };

  const handleRemoveBundleItem = (index: number) => {
    const updatedItems = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedItems);
    setValue('bundleItems', updatedItems);
  };

  const handleBundleItemChange = (
    index: number,
    field: keyof BundleItem,
    value: string | number,
  ) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSelectedProducts(updatedItems);
    setValue('bundleItems', updatedItems);
  };

  const onSubmit = (data: BundleFormData) => {
    createProduct({
      ...data,
      type: ProductType.BUNDLE,
      price: Number(data.bundlePrice),
    } as unknown as CreateProductDto);
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 3, fontFamily: 'ClashDisplay', fontWeight: 600 }}
      >
        Create Bundle Product
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Bundle Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="SKU"
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="bundlePrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Bundle Price (NGN)"
                  type="number"
                  error={!!errors.bundlePrice}
                  helperText={errors.bundlePrice?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status} sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    {Object.values(ProductStatus).map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.categories}
                  sx={{ mb: 2 }}
                >
                  <InputLabel>Categories</InputLabel>
                  <Select
                    {...field}
                    multiple
                    label="Categories"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {productCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categories && (
                    <FormHelperText>{errors.categories.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Controller
              name="bundleTier"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.bundleTier}
                  sx={{ mb: 2 }}
                >
                  <InputLabel>Bundle Tier</InputLabel>
                  <Select {...field} label="Bundle Tier">
                    {bundleTiers.map((bundleTier) => (
                      <MenuItem key={bundleTier} value={bundleTier}>
                        {bundleTier}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.bundleTier && (
                    <FormHelperText>{errors.bundleTier.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bundle Items
            </Typography>
            {!!errors?.bundleItems?.length && (
              <Alert severity="error">
                <Typography variant="body1">
                  {errors.bundleItems?.[0]?.productId?.message}
                </Typography>
              </Alert>
            )}

            {selectedProducts.map((item, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                      <FormControl fullWidth>
                        <InputLabel>Product</InputLabel>
                        <Select
                          value={item.productId}
                          onChange={(e) =>
                            handleBundleItemChange(
                              index,
                              'productId',
                              e.target.value,
                            )
                          }
                          label="Product"
                        >
                          {availableProducts?.data.map((product: Product) => (
                            <MenuItem
                              key={product._id}
                              value={product._id}
                              selected={item.productId === product._id}
                            >
                              {product.name} - {product.price} NGN
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        type="number"
                        label="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleBundleItemChange(
                            index,
                            'quantity',
                            parseInt(e.target.value),
                          )
                        }
                        inputProps={{ min: 1 }}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(e) =>
                          handleBundleItemChange(index, 'title', e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 1 }}>
                      <IconButton
                        onClick={() => handleRemoveBundleItem(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddBundleItem}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Bundle Item
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isCreatingProduct}
              sx={{
                backgroundColor: '#2FD65D',
                '&:hover': {
                  backgroundColor: '#28B850',
                },
              }}
            >
              {isCreatingProduct ? 'Creating Bundle...' : 'Create Bundle'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
