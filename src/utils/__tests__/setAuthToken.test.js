import axios from 'axios';
import setAuthToken from '../setAuthToken';

jest.mock('axios');

describe('setAuthToken', () => {
  beforeEach(() => { axios.defaults.headers.common = {}; });

  it('sets the auth-token header when a token is provided', () => {
    setAuthToken('secret');
    expect(axios.defaults.headers.common['auth-token']).toBe('secret');
  });

  it('removes the auth-token header when token is empty', () => {
    axios.defaults.headers.common['auth-token'] = 'old';
    setAuthToken(null);
    expect(axios.defaults.headers.common).not.toHaveProperty('auth-token');
  });
});
