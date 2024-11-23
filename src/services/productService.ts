import api from './api';
import { Product, CreateProductDto, ProductsResponse } from '../types/product';
import { io, Socket } from 'socket.io-client';

const baseURL = 'http://localhost:3000';
let socket: Socket;

export const productService = {
    initializeSocket: () => {
        const token = localStorage.getItem('token');
        socket = io(baseURL, {
            auth: {
                token
            },
            transports: ['websocket'],
            path: '/socket.io/'
        });

        socket.on('connect', () => {
            console.log('Connected to socket.io server');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return true;
    },

    getProducts: async (): Promise<ProductsResponse> => {
        const response = await api.get('/produits');
        console.log('Produits reçus:', response.data);
        return response.data;
    },

    onUpdatedProducts: (callback: (products: ProductsResponse) => void) => {
        socket.on('updatedProduits', (products: ProductsResponse) => {
            console.log('WebSocket update received:', products);
            if (products && products.data) {
                callback(products);
            } else {
                console.error('Invalid data received from WebSocket:', products);
            }
        });
    },

    disconnectSocket: () => {
        socket.disconnect();
    },

    addProduct: async (product: CreateProductDto): Promise<ProductsResponse> => {
        const response = await api.post('/produits', product);
        return response.data;
    },

    updateProduct: async (id: string, data: Partial<Product>): Promise<ProductsResponse> => {
        console.log('Updating product:', id, data);
        const response = await api.patch(`/produits/${id}`, data);
        console.log('Update response:', response.data);
        return response.data;
    },

    deleteProduct: async (productId: string) => {
        await api.delete(`/produits/${productId}`);
    },
};

export default productService;