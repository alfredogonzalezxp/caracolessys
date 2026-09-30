import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ManageUsers from './manage_usr';
import { getAllUsers, deleteUser, signup, updateUser } from '@/api/api';

jest.mock('@/api/api', () => ({
  getAllUsers: jest.fn(),
  deleteUser: jest.fn(),
  signup: jest.fn(),
  updateUser: jest.fn(),
}));

describe('ManageUsers Component', () => {
  const mockOnClose = jest.fn();
  
  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@test.com', role: 'ADMIN', password: '' },
    { id: 2, name: 'Bob', email: 'bob@test.com', role: 'USER', password: '' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true); // Mock window.confirm to always return true for deletion
  });

  it('renders loading state then fetches and displays users', async () => {
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    await act(async () => {
      render(<ManageUsers onClose={mockOnClose} />);
    });

    // Should fetch users on mount
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();

      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('bob@test.com')).toBeInTheDocument();
    });
  });

  it('handles user creation', async () => {
    (getAllUsers as jest.Mock).mockResolvedValue([]);
    (signup as jest.Mock).mockResolvedValue({ message: 'Success' });

    await act(async () => {
      render(<ManageUsers onClose={mockOnClose} />);
    });

    await waitFor(() => {
      expect(getAllUsers).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText('Speedy Snail'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('snail@garden.com'), { target: { value: 'new@test.com' } });
    // Assuming there are two password fields for password and confirm_password, both placeholder "••••••••"
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create snail/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@test.com',
        password: 'password123',
        confirm_password: 'password123'
      });
    });
  });

  it('handles user deletion', async () => {
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    (deleteUser as jest.Mock).mockResolvedValue({ message: 'Deleted' });

    await act(async () => {
      render(<ManageUsers onClose={mockOnClose} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete User');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
      expect(deleteUser).toHaveBeenCalledWith(1); // Alice has id 1
    });
  });
  
  it('calls onClose when close button is clicked', async () => {
    (getAllUsers as jest.Mock).mockResolvedValue([]);
    await act(async () => {
      render(<ManageUsers onClose={mockOnClose} />);
    });
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
