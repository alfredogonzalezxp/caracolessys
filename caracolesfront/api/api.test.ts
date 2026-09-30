import axios from 'axios';
import { login, signup, getAllUsers, deleteUser, updateUser } from './api';

// Mock axios completely
jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      put: jest.fn(),
    }),
  };
});

let mockAxiosInstance: { post: jest.Mock; get: jest.Mock; delete: jest.Mock; put: jest.Mock };

// Mock localStorage globally
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Setup and Methods', () => {
  beforeAll(() => {
    // Retrieve the instance created when api.ts was imported
    mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  describe('login', () => {
    it('should send a POST request to /auth/login with credentials and return data', async () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const expectedResponse = { token: 'mock-jwt-token', user: { id: 1, email: 'test@test.com' } };
      
      mockAxiosInstance.post.mockResolvedValueOnce({ data: expectedResponse });

      const result = await login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('signup', () => {
    it('should send a POST request to /auth/register with user data and return data', async () => {
      const userData = { name: 'Test User', email: 'test@test.com', password: 'password123', confirm_password: 'password123' };
      const expectedResponse = { message: 'User created' };
      
      mockAxiosInstance.post.mockResolvedValueOnce({ data: expectedResponse });

      const result = await signup(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllUsers', () => {
    it('should send a GET request to /users with Authorization header using local token', async () => {
      window.localStorage.setItem('accessToken', 'mock-token-123');
      const expectedResponse = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      
      mockAxiosInstance.get.mockResolvedValueOnce({ data: expectedResponse });

      const result = await getAllUsers();

      expect(window.localStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
        headers: { Authorization: 'Bearer mock-token-123' },
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteUser', () => {
    it('should send a DELETE request to /users/:id with Authorization header', async () => {
      window.localStorage.setItem('accessToken', 'mock-token-456');
      const expectedResponse = { message: 'User deleted' };
      
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: expectedResponse });

      const result = await deleteUser(1);

      expect(window.localStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', {
        headers: { Authorization: 'Bearer mock-token-456' },
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateUser', () => {
    it('should send a PUT request to /users/:id with payload and Authorization header', async () => {
      window.localStorage.setItem('accessToken', 'mock-token-789');
      const updatePayload = { name: 'New Name' };
      const expectedResponse = { id: 1, name: 'New Name' };
      
      mockAxiosInstance.put.mockResolvedValueOnce({ data: expectedResponse });

      const result = await updateUser(1, updatePayload);

      expect(window.localStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updatePayload, {
        headers: { Authorization: 'Bearer mock-token-789' },
      });
      expect(result).toEqual(expectedResponse);
    });
  });
});
