import profileReducer from '../profile';
import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_ALL_PROFILES, GET_REPOS } from '../../actions/constants';

describe('profile reducer', () => {
  it('returns the initial state and preserves it for unknown actions', () => {
    const initial = profileReducer(undefined, { type: '@@INIT' });
    expect(initial).toEqual({ profile: null, profiles: [], repos: [], loading: true, error: {} });
    expect(profileReducer(initial, { type: 'UNKNOWN' })).toBe(initial);
  });

  it.each([GET_PROFILE, UPDATE_PROFILE])('%s updates current profile', (type) => {
    const profile = { user: { name: 'Alice' } };
    expect(profileReducer(undefined, { type, payload: profile })).toMatchObject({ profile, loading: false });
  });

  it('stores community profiles and repositories', () => {
    const profiles = [{ _id: 'p1' }];
    const repos = [{ name: 'repo' }];
    const state = profileReducer(undefined, { type: GET_ALL_PROFILES, payload: profiles });
    expect(state).toMatchObject({ profiles, loading: false });
    expect(profileReducer(state, { type: GET_REPOS, payload: repos })).toMatchObject({ profiles, repos, loading: false });
  });

  it('stores API error and ends loading', () => {
    expect(profileReducer(undefined, { type: PROFILE_ERROR, payload: { status: 500 } }))
      .toMatchObject({ error: { status: 500 }, loading: false });
  });

  it('clears profile state', () => {
    expect(profileReducer({ profile: { id: 1 } }, { type: CLEAR_PROFILE })).toEqual({});
  });
});
