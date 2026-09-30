import React from 'react';
import { render, screen } from '@testing-library/react';
import MainDashboard from './dashboard';
import { useAuth } from '@/app/context/AuthContext';

jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('MainDashboard Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      role: 'ADMIN',
    });
  });

  it('renders all statistic cards correctly', () => {
    render(<MainDashboard />);
    
    // Check Welcome Title
    expect(screen.getByText(/Welcome, Bettor/i)).toBeInTheDocument();

    // Check Balance
    expect(screen.getByText(/Available Balance/i)).toBeInTheDocument();
    
    // Check main button
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });
});
