import authReducer from '../auth';
import {
  REGISTER_SUCCESS, REGISTER_FAILURE, USER_LOADED, AUTH_ERROR,
  LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, DELETE_PROFILE,
} from '../../actions/constants';

const loadAuthReducer = () => require('../auth').default;

describe('auth reducer', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  it('initializes from token present when the reducer module loads', () => {
    localStorage.setItem('token', 'stored-token');
    const reducer = loadAuthReducer();

    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      token: 'stored-token', isAuthenticated: null, loading: true, user: null,
    });
  });

  it.each([REGISTER_SUCCESS, LOGIN_SUCCESS])('%s stores token and authenticates', (type) => {
    const reducer = loadAuthReducer();
    const payload = { token: 'fresh-token', user: { name: 'Alice' } };
    const state = reducer(undefined, { type, payload });

    expect(localStorage.getItem('token')).toBe('fresh-token');
    expect(state).toMatchObject({ ...payload, isAuthenticated: true, loading: false });
  });

  it('marks user authenticated after loading', () => {
    const reducer = loadAuthReducer();
    expect(reducer(undefined, { type: USER_LOADED, payload: { name: 'Bob' } }))
      .toMatchObject({ isAuthenticated: true, loading: false, user: { name: 'Bob' } });
  });

  it.each([REGISTER_FAILURE, AUTH_ERROR, LOGIN_FAILED, LOGOUT, DELETE_PROFILE])('%s clears auth', (type) => {
    const reducer = loadAuthReducer();
    localStorage.setItem('token', 'old-token');

    expect(reducer(undefined, { type })).toMatchObject({
      token: null, isAuthenticated: false, loading: false, user: '',
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('returns the original state for an unknown action', () => {
    const reducer = loadAuthReducer();
    const current = { token: 'x', isAuthenticated: true, loading: false, user: {} };
    expect(reducer(current, { type: 'UNKNOWN' })).toBe(current);
  });
});
