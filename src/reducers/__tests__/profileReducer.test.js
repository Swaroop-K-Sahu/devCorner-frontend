import authReducer from '../auth';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  DELETE_PROFILE,
} from '../../actions/constants';

describe('auth reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial state', () => {
    localStorage.setItem('token', 'stored-token');

    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      token: 'stored-token',
      isAuthenticated: null,
      loading: true,
      user: null,
    });
  });

  it('stores the token and marks the user as authenticated on register/login success', () => {
    const action = { type: REGISTER_SUCCESS, payload: { token: 'new-token', user: { name: 'Alice' } } };

    const state = authReducer(undefined, action);

    expect(localStorage.getItem('token')).toBe('new-token');
    expect(state).toMatchObject({
      token: 'new-token',
      isAuthenticated: true,
      loading: false,
      user: { name: 'Alice' },
    });
  });

  it('stores the user after loadUser success', () => {
    const state = authReducer(
      { token: 'abc', isAuthenticated: false, loading: true, user: null },
      { type: USER_LOADED, payload: { name: 'Bob', email: 'bob@test.com' } }
    );

    expect(state).toMatchObject({
      isAuthenticated: true,
      loading: false,
      user: { name: 'Bob', email: 'bob@test.com' },
    });
  });

  it('clears auth state on error and logout events', () => {
    const states = [
      authReducer(undefined, { type: REGISTER_FAILURE }),
      authReducer(undefined, { type: AUTH_ERROR }),
      authReducer(undefined, { type: LOGIN_FAILED }),
      authReducer(undefined, { type: LOGOUT }),
      authReducer(undefined, { type: DELETE_PROFILE }),
    ];

    states.forEach((state) => {
      expect(state).toMatchObject({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: '',
      });
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
