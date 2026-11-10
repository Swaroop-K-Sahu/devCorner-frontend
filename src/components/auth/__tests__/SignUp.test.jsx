import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import SignUp from '../SignUp';
import { setAlert } from '../../../actions/alert';
import { register } from '../../../actions/auth';

jest.mock('../../../actions/alert', () => ({ setAlert: jest.fn() }));
jest.mock('../../../actions/auth', () => ({ register: jest.fn() }));

const renderSignUp = (isAuthenticated = false) => {
  const store = createStore((state = { auth: { isAuthenticated } }) => state);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register']}>
        <Route path="/register" component={SignUp} />
        <Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
      </MemoryRouter>
    </Provider>
  );
};

const fillRequiredFields = (confirmation = 'secret123') => {
  fireEvent.change(document.querySelector('input[name="name"]'), {
    target: { name: 'name', value: 'Alice' },
  });
  fireEvent.change(document.querySelector('input[name="email"]'), {
    target: { name: 'email', value: 'alice@example.com' },
  });
  fireEvent.change(document.querySelector('input[name="password1"]'), {
    target: { name: 'password1', value: 'secret123' },
  });
  fireEvent.change(document.querySelector('input[name="password2"]'), {
    target: { name: 'password2', value: confirmation },
  });
};

describe('SignUp component', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows an alert when passwords do not match', () => {
    renderSignUp();
    fillRequiredFields('different123');
    fireEvent.submit(document.querySelector('form'));

    expect(setAlert).toHaveBeenCalledWith('Password do not match', 'danger');
    expect(register).not.toHaveBeenCalled();
  });

  it('registers user when passwords match', () => {
    renderSignUp();
    fillRequiredFields();
    fireEvent.submit(document.querySelector('form'));

    expect(register).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret123',
    });
  });

  it('redirects authenticated users to dashboard', () => {
    renderSignUp(true);
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
