export interface Product {
    id?: string;
    name: string;
    type: string;
    price: number;
    rating: number;
    warranty_years: number;
    available: boolean;
}

export interface CreateProductDto {
    name: string;
    type: string;
    price: number;
    rating: number;
    warranty_years: number;
    available: boolean;
}

export interface ProductsResponse {
    data: Product[];
    total: number;
    limit: number;
    skip: number;
}