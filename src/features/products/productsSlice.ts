import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import { CreateProductDto, Product, ProductsResponse } from '../../types/product';

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
    socketConnected: boolean;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    socketConnected: false,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await productService.getProducts();
    return response;
});

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId: string) => {
        await productService.deleteProduct(productId);
        return productId;
    }
);

export const startSocketConnection = createAsyncThunk(
    'products/startSocket',
    async (_, { dispatch }) => {
        productService.initializeSocket();
        productService.onUpdatedProducts((products) => {
            dispatch(updateProductsFromSocket(products));
        });
        return true;
    }
);

export const stopSocketConnection = createAsyncThunk(
    'products/stopSocket',
    async () => {
        productService.disconnectSocket();
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (productData: CreateProductDto) => {
        const response = await productService.addProduct(productData);
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(id, data);
            return response;
        } catch (error) {
            console.error('Update error:', error);
            return rejectWithValue(error);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateProductsFromSocket: (state, action: PayloadAction<ProductsResponse>) => {
            console.log('Socket update received:', action.payload);
            state.products = action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                if (Array.isArray(state.products)) {
                    state.products = state.products.filter(
                        product => product.id !== action.payload
                    );
                }
            })
            .addCase(addProduct.fulfilled, () => {
                console.log('Product added, waiting for socket update');
            })
            .addCase(updateProduct.fulfilled, () => {
                console.log('Product updated, waiting for socket update');
            })
            .addCase(updateProduct.rejected, (state, action) => {
                console.error('Update failed:', action.payload);
                state.error = 'Failed to update product';
            })
            .addCase(startSocketConnection.fulfilled, (state) => {
                state.socketConnected = true;
            })
            .addCase(stopSocketConnection.fulfilled, (state) => {
                state.socketConnected = false;
            });
    },
});

export const { updateProductsFromSocket } = productsSlice.actions;
export default productsSlice.reducer;