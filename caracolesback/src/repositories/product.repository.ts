import Product from '../models/product.model';

const findAll = async () => {
  // Mock data
  return [
    new Product(1, 'Laptop', 999.99),
    new Product(2, 'Mouse', 49.99)
  ];
};

export { 
  findAll,
 };
