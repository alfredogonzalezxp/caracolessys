import * as productRepository from '../repositories/product.repository';

const getAllProducts = async () => {
  return await productRepository.findAll();
};

export { 
  getAllProducts,
 };
