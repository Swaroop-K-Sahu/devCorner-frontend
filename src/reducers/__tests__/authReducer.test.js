import authReducer from '../auth';
import {
  REGISTER_SUCCESS, REGISTER_FAILURE, USER_LOADED, AUTH_ERROR,
  LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, DELETE_PROFILE,
} from '../../actions/constants';

describe('auth reducer', () => {
  beforeEach(() => localStorage.clear());

  it('initializes from localStorage token', () => {
    localStorage.setItem('token', 'stored-token');
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual({
      token: 'stored-token', isAuthenticated: null, loading: true, user: null,
    });
  });

  it.each([REGISTER_SUCCESS, LOGIN_SUCCESS])('%s stores token and authenticates', (type) => {
    const payload = { token: 'fresh-token', user: { name: 'Alice' } };
    const state = authReducer(undefined, { type, payload });
    expect(localStorage.getItem('token')).toBe('fresh-token');
    expect(state).toMatchObject({ ...payload, isAuthenticated: true, loading: false });
  });

  it('marks user authenticated after loading', () => {
    expect(authReducer(undefined, { type: USER_LOADED, payload: { name: 'Bob' } }))
      .toMatchObject({ isAuthenticated: true, loading: false, user: { name: 'Bob' } });
  });

  it.each([REGISTER_FAILURE, AUTH_ERROR, LOGIN_FAILED, LOGOUT, DELETE_PROFILE])('%s clears auth', (type) => {
    localStorage.setItem('token', 'old-token');
    expect(authReducer(undefined, { type })).toMatchObject({
      token: null, isAuthenticated: false, loading: false, user: '',
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('returns the original state for an unknown action', () => {
    const current = { token: 'x', isAuthenticated: true, loading: false, user: {} };
    expect(authReducer(current, { type: 'UNKNOWN' })).toBe(current);
  });
});
