import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Navbar from '../Navbar';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../actions/auth', () => ({ logout: jest.fn() }));

describe('Navbar auth state', () => {
  it('does not render a profile link if authenticated user is not loaded yet', () => {
    const store = createStore((state = {
      auth: { isAuthenticated: true, loading: false, user: null },
    }) => state);

    render(<Provider store={store}><MemoryRouter><Navbar /></MemoryRouter></Provider>);
    expect(screen.getByText('Profile')).toHaveAttribute('href', '#');
  });
});
