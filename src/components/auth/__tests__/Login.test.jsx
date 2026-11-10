import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import Login from '../Login';
import { login } from '../../../actions/auth';

jest.mock('../../../actions/auth', () => ({ login: jest.fn() }));

const renderLogin = (isAuthenticated = false) => {
  const store = createStore((state = { auth: { isAuthenticated } }) => state);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
      </MemoryRouter>
    </Provider>
  );
};

describe('Login component', () => {
  beforeEach(() => jest.clearAllMocks());

  it('submits entered email and password', () => {
    renderLogin();
    fireEvent.change(document.querySelector('input[name="email"]'), {
      target: { name: 'email', value: 'user@example.com' },
    });
    fireEvent.change(document.querySelector('input[name="password"]'), {
      target: { name: 'password', value: 'secret123' },
    });
    fireEvent.submit(document.querySelector('form'));

    expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'secret123' });
  });

  it('redirects authenticated users to dashboard', () => {
    renderLogin(true);
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
