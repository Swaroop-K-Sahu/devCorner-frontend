import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PrivateRoute from '../PrivateRoute';

const buildStore = (authState) =>
  createStore((state = { auth: authState }) => state);

describe('PrivateRoute integration', () => {
  it('redirects unauthenticated users to login', () => {
    const store = buildStore({ isAuthenticated: false, loading: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={() => <div>Dashboard Page</div>} />
            <Route path="/login" render={() => <div>Login Page</div>} />
          </Switch>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders the protected component for authenticated users', () => {
    const store = buildStore({ isAuthenticated: true, loading: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={() => <div>Dashboard Page</div>} />
            <Route path="/login" render={() => <div>Login Page</div>} />
          </Switch>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
