import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import Login from '../Login';
import { login } from '../../../actions/auth';

jest.mock('../../../actions/auth', () => ({
  login: jest.fn(),
}));

describe('Login component', () => {
  const renderLogin = (isAuthenticated = false) => {
    const store = createStore((state = { auth: { isAuthenticated } }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login" component={Login} />
          <Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits valid email and password', () => {
    renderLogin(false);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'secret123' });
  });

  it('redirects to the dashboard when the user is authenticated', () => {
    renderLogin(true);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
