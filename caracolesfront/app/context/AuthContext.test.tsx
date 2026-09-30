import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Simple mock for window.atob and decodeURIComponent to simulate getting role from JWT
// In a real JWT, the payload is the middle part of the string, base64 encoded.
const mockJwtTokenWithRole = (role: string) => {
  const payload = JSON.stringify({ role });
  const base64Payload = Buffer.from(payload).toString('base64');
  return `header.${base64Payload}.signature`;
};

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

// A test component to consume and display AuthContext
const ConsumerComponent = () => {
  const { isAuthenticated, role, loading, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
      <div data-testid="role-status">{role || 'NO_ROLE'}</div>
      <div data-testid="loading-status">{loading ? 'LOADING' : 'READY'}</div>
      <button onClick={() => login(mockJwtTokenWithRole('admin'))}>Do Login</button>
      <button onClick={() => logout()}>Do Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('provides default unauthenticated state initially', () => {
    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('role-status')).toHaveTextContent('NO_ROLE');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('READY');
  });

  it('restores session from localStorage if token exists on mount', () => {
    window.localStorage.setItem('accessToken', mockJwtTokenWithRole('user'));

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    // After mount effect executes, it should set authenticated to true and restore role
    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('role-status')).toHaveTextContent('user');
  });

  it('updates state and token upon login', () => {
    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');

    act(() => {
      screen.getByText('Do Login').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('role-status')).toHaveTextContent('admin');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('accessToken', expect.any(String));
  });

  it('clears state and token upon logout', () => {
    // Start with logged in state
    window.localStorage.setItem('accessToken', mockJwtTokenWithRole('manager'));

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    // Verify logged in
    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');

    // Trigger logout
    act(() => {
      screen.getByText('Do Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('role-status')).toHaveTextContent('NO_ROLE');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });
});
