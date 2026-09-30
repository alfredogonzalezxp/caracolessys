import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { login } from '@/api/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/api/api', () => ({
  login: jest.fn(),
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockAuthLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ login: mockAuthLogin });
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/comms email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/access code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter pit/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/comms email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/access code/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits the form and calls login API', async () => {
    (login as jest.Mock).mockResolvedValue({ accessToken: 'fake-token' });
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/comms email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/access code/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /enter pit/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockAuthLogin).toHaveBeenCalledWith('fake-token');
      // The component renders an Access Granted state instead of standard success
      expect(screen.getByText(/success!/i)).toBeInTheDocument();
    });
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (login as jest.Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { message: errorMessage }
      }
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/comms email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/access code/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /enter pit/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    (login as jest.Mock).mockReturnValue(new Promise((resolve) => setTimeout(() => resolve({ accessToken: 'token' }), 100)));
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/comms email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/access code/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /enter pit/i }));

    expect(screen.getByText(/decrypting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrypting/i })).toBeDisabled();
  });
});
