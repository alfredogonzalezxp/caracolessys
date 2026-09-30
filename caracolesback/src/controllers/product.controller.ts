import {  sendSuccess  } from '../utils/response';
import * as productService from '../services/product.service';

const getProducts = async (req: any, res: any, next: any) => {
  try {
    const products = await productService.getAllProducts();
    sendSuccess(res, products, 'Products retrieved successfully');
  } catch (error: any) {
    next(error);
  }
};

export { 
  getProducts,
 };
