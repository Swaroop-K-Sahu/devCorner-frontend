import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import Navbar from '../Navbar';
import { logout } from '../../../actions/auth';

jest.mock('../../../actions/auth', () => ({ logout: jest.fn() }));

describe('Navbar', () => {
  const renderNavbar = (auth) => {
    const store = createStore((state = { auth }) => state);
    return render(<Provider store={store}><MemoryRouter><Navbar /></MemoryRouter></Provider>);
  };

  it('hides navigation links during auth loading', () => {
    renderNavbar({ isAuthenticated: false, loading: true, user: null });
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
  });

  it('renders guest links', () => {
    renderNavbar({ isAuthenticated: false, loading: false, user: null });
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });

  it('renders user links and invokes logout', () => {
    renderNavbar({ isAuthenticated: true, loading: false, user: { _id: 'u1' } });
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile/u1');
    fireEvent.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalled();
  });
});
