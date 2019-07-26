import { Product } from '../models/products';
export interface Category{
    id: string;
    name: string;
    products:Product[];
}