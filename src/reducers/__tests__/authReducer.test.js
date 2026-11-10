import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import SignUp from '../SignUp';
import { setAlert } from '../../../actions/alert';
import { register } from '../../../actions/auth';

jest.mock('../../../actions/alert', () => ({
  setAlert: jest.fn(),
}));

jest.mock('../../../actions/auth', () => ({
  register: jest.fn(),
}));

describe('SignUp component', () => {
  const renderSignUp = (isAuthenticated = false) => {
    const store = createStore((state = { auth: { isAuthenticated } }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/register']}>
          <Route path="/register" component={SignUp} />
          <Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows an alert when passwords do not match', () => {
    renderSignUp(false);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { name: 'name', value: 'Alice' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'alice@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password1', value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { name: 'password2', value: 'secret456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(setAlert).toHaveBeenCalledWith('Password do not match', 'danger');
  });

  it('registers the user when passwords match', () => {
    renderSignUp(false);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { name: 'name', value: 'Alice' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'alice@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password1', value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { name: 'password2', value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(register).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      password: 'secret123',
    });
  });

  it('redirects to the dashboard when the user is authenticated', () => {
    renderSignUp(true);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
