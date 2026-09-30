import * as userRepository from '../repositories/user.repository';

const getAllUsers = async () => {
  return await userRepository.findAll();
};

export { 
  getAllUsers,
 };
