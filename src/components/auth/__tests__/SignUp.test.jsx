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
  return render(<Provider store={store}><MemoryRouter initialEntries={['/register']}>
    <Route path="/register" component={SignUp} /><Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
  </MemoryRouter></Provider>);
};

describe('SignUp component', () => {
  beforeEach(() => jest.clearAllMocks());

  const fillRequiredFields = (passwordConfirmation = 'secret123') => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { name: 'name', value: 'Alice' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password1', value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { name: 'password2', value: passwordConfirmation } });
  };

  it('alerts if passwords do not match', () => {
    renderSignUp();
    fillRequiredFields('different123');
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(setAlert).toHaveBeenCalledWith('Password do not match', 'danger');
    expect(register).not.toHaveBeenCalled();
  });

  it('registers matching credentials', () => {
    renderSignUp();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(register).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
  });

  it('redirects authenticated users', () => {
    renderSignUp(true);
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
