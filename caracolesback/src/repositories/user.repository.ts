import User from '../models/user.model';

const findAll = async () => {
  // Mock data
  return [
    new User(1, 'John Doe', 'john@example.com'),
    new User(2, 'Jane Doe', 'jane@example.com')
  ];
};

export { 
  findAll,
 };
