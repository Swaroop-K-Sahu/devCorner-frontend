import axios from 'axios';
import { loadUser, register, login, logout } from '../auth';
import { USER_LOADED, AUTH_ERROR, REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, CLEAR_PROFILE } from '../constants';

jest.mock('axios');

describe('auth actions', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  it('loads user successfully and applies stored token', async () => {
    localStorage.setItem('token', 'stored');
    axios.get.mockResolvedValue({ data: { name: 'Alice' } });
    const dispatch = jest.fn();
    await loadUser()(dispatch);
    expect(axios.defaults.headers.common['auth-token']).toBe('stored');
    expect(dispatch).toHaveBeenCalledWith({ type: USER_LOADED, payload: { name: 'Alice' } });
  });

  it('dispatches auth error when user load fails', async () => {
    axios.get.mockRejectedValue(new Error('offline'));
    const dispatch = jest.fn();
    await loadUser()(dispatch);
    expect(dispatch).toHaveBeenCalledWith({ type: AUTH_ERROR });
  });

  it('registers user and schedules user loading', async () => {
    const user = { name: 'Alice', email: 'alice@example.com', password: 'secret123' };
    axios.post.mockResolvedValue({ data: { token: 't' } });
    const dispatch = jest.fn();
    await register(user)(dispatch);
    expect(axios.post).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/users', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
    expect(dispatch).toHaveBeenCalledWith({ type: REGISTER_SUCCESS, payload: { token: 't' } });
    expect(dispatch.mock.calls.some(([action]) => typeof action === 'function')).toBe(true);
  });

  it('dispatches validation alerts and register failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { errors: [{ msg: 'Bad email' }, { msg: 'Weak password' }] } } });
    const dispatch = jest.fn();
    await register({ name: 'A', email: 'bad', password: 'x' })(dispatch);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: REGISTER_FAILURE }));
    expect(dispatch.mock.calls.filter(([action]) => typeof action === 'function')).toHaveLength(2);
  });

  it('logs in and schedules user loading', async () => {
    const credentials = { email: 'alice@example.com', password: 'secret' };
    axios.post.mockResolvedValue({ data: { token: 't' } });
    const dispatch = jest.fn();
    await login(credentials)(dispatch);
    expect(axios.post).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/auth', JSON.stringify(credentials), { headers: { 'Content-Type': 'application/json' } });
    expect(dispatch).toHaveBeenCalledWith({ type: LOGIN_SUCCESS, payload: { token: 't' } });
    expect(dispatch.mock.calls.some(([action]) => typeof action === 'function')).toBe(true);
  });

  it('dispatches an error alert and login failure', async () => {
    axios.post.mockRejectedValue({ response: { data: 'Invalid credentials' } });
    const dispatch = jest.fn();
    await login({ email: 'x', password: 'x' })(dispatch);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: LOGIN_FAILED }));
    expect(dispatch.mock.calls.some(([action]) => typeof action === 'function')).toBe(true);
  });

  it('dispatches clear profile then logout', () => {
    const dispatch = jest.fn();
    logout()(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: CLEAR_PROFILE });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: LOGOUT });
  });
});
