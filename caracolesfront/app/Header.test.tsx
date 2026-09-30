import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders Sign In button when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
      role: null,
    });

    render(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders correctly for authenticated USER without management link', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      role: 'USER',
    });

    render(<Header />);

    expect(screen.getByText('SnailSite')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('calls logout function when Log Out button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      role: 'USER',
    });

    render(<Header />);

    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
