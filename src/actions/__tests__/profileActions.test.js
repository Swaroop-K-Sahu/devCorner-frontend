import axios from 'axios';
import { loadUser, register, login, logout } from '../auth';
import {
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  CLEAR_PROFILE,
} from '../constants';

jest.mock('axios');

describe('auth actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('loads the current user successfully', async () => {
    localStorage.setItem('token', 'abc123');
    axios.get.mockResolvedValue({ data: { name: 'Alice' } });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await loadUser()(dispatch);

    expect(axios.get).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/auth');
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: USER_LOADED, payload: { name: 'Alice' } }));
  });

  it('dispatches AUTH_ERROR when loading the user fails', async () => {
    localStorage.setItem('token', 'abc123');
    axios.get.mockRejectedValue({ response: { statusText: 'Unauthorized', status: 401 } });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await loadUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: AUTH_ERROR });
  });

  it('registers the user successfully', async () => {
    axios.post.mockResolvedValue({ data: { token: 'token-123' } });
    axios.get.mockResolvedValue({ data: { name: 'Alice' } });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await register({ name: 'Alice', email: 'alice@test.com', password: 'secret123' })(dispatch);

    expect(axios.post).toHaveBeenCalledWith(
      'https://devcorner-api.onrender.com/api/users',
      JSON.stringify({ name: 'Alice', email: 'alice@test.com', password: 'secret123' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: REGISTER_SUCCESS }));
  });

  it('dispatches REGISTER_FAILURE when registration fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: { errors: [{ msg: 'User already exists' }] } },
    });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await register({ name: 'Alice', email: 'alice@test.com', password: 'bad' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: REGISTER_FAILURE }));
  });

  it('logs in successfully', async () => {
    axios.post.mockResolvedValue({ data: { token: 'login-token' } });
    axios.get.mockResolvedValue({ data: { name: 'Logged User' } });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await login({ email: 'user@test.com', password: 'secret' })(dispatch);

    expect(axios.post).toHaveBeenCalledWith(
      'https://devcorner-api.onrender.com/api/auth',
      JSON.stringify({ email: 'user@test.com', password: 'secret' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: LOGIN_SUCCESS }));
  });

  it('dispatches LOGIN_FAILED when login fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: 'Invalid credentials' },
    });

    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await login({ email: 'user@test.com', password: 'wrong' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: LOGIN_FAILED }));
  });

  it('clears profile and logout state', () => {
    const dispatch = jest.fn();

    logout()(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: CLEAR_PROFILE });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: LOGOUT });
  });
});
