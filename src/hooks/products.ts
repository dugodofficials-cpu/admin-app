import { AlbumCover, AlbumCoverResponse, createProduct, CreateProductDto, deleteAlbumCover, deleteProduct, getAlbumCovers, getDigitalAlbums, getProductById, getProducts, getProductsByAlbum, PaginatedDigitalProducts, PaginatedProducts, ProductById, ProductsQueryParams, updateAlbumCover, updateProduct, uploadAlbumCover } from '@/lib/api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

export const useDigitalProducts = (params: ProductsQueryParams = {}) => {
  return useQuery<PaginatedDigitalProducts, Error>({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        return await getDigitalAlbums(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch digital products', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useProducts = (params: ProductsQueryParams = {}) => {
  return useQuery<PaginatedProducts, Error>({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        return await getProducts(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch products', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useProductsByAlbum = (albumName: string) => {
  return useQuery({
    queryKey: ['products', 'album', albumName],
    queryFn: async () => {
      try {
        return await getProductsByAlbum(albumName);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch products by album', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!albumName,
  });
};

export const useProductById = (id: string) => {
  return useQuery<ProductById, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        return await getProductById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch product', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateProduct = (route: string) => {
  const queryClient = useQueryClient();
  return useMutation<ProductById, Error, CreateProductDto>({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Item created successfully', { variant: 'success' });
      window.location.href = route;
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
};

export const useDeleteProduct = (route: string) => {
  const router = useRouter();
  return useMutation<ProductById, Error, string>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      router.push(route);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductById, Error, { id: string; data: Partial<CreateProductDto> }>({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadAlbumCover = () => {
  const queryClient = useQueryClient();
  return useMutation<AlbumCover, Error, FormData>({
    mutationFn: (data) => uploadAlbumCover(data),
    onSuccess: () => {
      enqueueSnackbar('Album cover uploaded successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['album-covers'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
};

export const useGetAlbumCovers = () => {
  return useQuery<AlbumCoverResponse, Error>({
    queryKey: ['album-covers'],
    queryFn: async () => {
      try {
        return await getAlbumCovers();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch album covers', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useDeleteAlbumCover = () => {
  const queryClient = useQueryClient();
  return useMutation<AlbumCoverResponse, Error, string>({
    mutationFn: (id) => deleteAlbumCover(id),
    onSuccess: () => {
      enqueueSnackbar('Album cover deleted successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['album-covers'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
};

export const useUpdateAlbumCover = () => {
  const queryClient = useQueryClient();
  return useMutation<AlbumCoverResponse, Error, { id: string; data: Partial<AlbumCover> }>({
    mutationFn: ({ id, data }) => updateAlbumCover(id, data),
    onSuccess: () => {
      enqueueSnackbar('Album cover updated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['album-covers'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
};