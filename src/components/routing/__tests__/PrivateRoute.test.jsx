import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

const renderProtected = (auth, initialEntry = '/dashboard') => {
  const store = createStore((state = { auth }) => state);
  return render(<Provider store={store}><MemoryRouter initialEntries={[initialEntry]}><Switch>
    <PrivateRoute exact path="/dashboard" component={() => <div>Dashboard Page</div>} />
    <Route path="/login" render={() => <div>Login Page</div>} />
  </Switch></MemoryRouter></Provider>);
};

describe('PrivateRoute integration', () => {
  it('redirects unauthenticated users after auth loading is complete', () => {
    renderProtected({ isAuthenticated: false, loading: false });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
  });

  it('renders protected route for authenticated users', () => {
    renderProtected({ isAuthenticated: true, loading: false });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('does not redirect while authentication is loading', () => {
    renderProtected({ isAuthenticated: false, loading: true });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
