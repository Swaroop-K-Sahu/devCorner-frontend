import profileReducer from '../profile';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_ALL_PROFILES,
  GET_REPOS,
} from '../../actions/constants';

describe('profile reducer', () => {
  it('returns the default state', () => {
    const state = profileReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      profile: null,
      profiles: [],
      repos: [],
      loading: true,
      error: {},
    });
  });

  it('stores the current profile for GET_PROFILE and UPDATE_PROFILE', () => {
    const payload = { user: { name: 'Alice' }, skills: ['React', 'Node'] };

    const state = profileReducer(undefined, { type: GET_PROFILE, payload });
    const updated = profileReducer(state, { type: UPDATE_PROFILE, payload: { ...payload, skills: ['React'] } });

    expect(state).toMatchObject({ profile: payload, loading: false });
    expect(updated).toMatchObject({ profile: { skills: ['React'] }, loading: false });
  });

  it('stores all profiles and repos', () => {
    const profilesState = profileReducer(undefined, {
      type: GET_ALL_PROFILES,
      payload: [{ _id: '1' }, { _id: '2' }],
    });

    const reposState = profileReducer(profilesState, {
      type: GET_REPOS,
      payload: [{ name: 'repo-1' }],
    });

    expect(profilesState).toMatchObject({ profiles: [{ _id: '1' }, { _id: '2' }], loading: false });
    expect(reposState).toMatchObject({ repos: [{ name: 'repo-1' }], loading: false });
  });

  it('stores the error payload and clears profile state', () => {
    const errorState = profileReducer(undefined, {
      type: PROFILE_ERROR,
      payload: { msg: 'Request failed', status: 500 },
    });

    expect(errorState).toMatchObject({
      loading: false,
      error: { msg: 'Request failed', status: 500 },
    });

    const cleared = profileReducer(undefined, { type: CLEAR_PROFILE });
    expect(cleared).toEqual({});
  });
});
