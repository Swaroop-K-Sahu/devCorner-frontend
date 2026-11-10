import axios from 'axios';
import {
  getProfiles,
  getProfileById,
  getGithubRepos,
  getCurrentProfile,
  makeProfile,
  addExperience,
  addEducation,
  delExperience,
  delEducation,
  delAccount,
} from '../profile';
import {
  GET_ALL_PROFILES,
  PROFILE_ERROR,
  GET_PROFILE,
  GET_REPOS,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  DELETE_PROFILE,
} from '../constants';

jest.mock('axios');

describe('profile actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets all profiles successfully', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1', user: { name: 'Alice' } }] });
    const dispatch = jest.fn();

    await getProfiles()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: GET_ALL_PROFILES,
      payload: [{ _id: '1', user: { name: 'Alice' } }],
    });
  });

  it('dispatches PROFILE_ERROR when getProfiles fails', async () => {
    axios.get.mockRejectedValue({ response: { statusText: 'Bad Request', status: 400 } });
    const dispatch = jest.fn();

    await getProfiles()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: PROFILE_ERROR,
      payload: { msg: 'Bad Request', status: 400 },
    });
  });

  it('gets a profile by userId successfully', async () => {
    axios.get.mockResolvedValue({ data: { user: { _id: 'abc' } } });
    const dispatch = jest.fn();

    await getProfileById('abc')(dispatch);

    expect(axios.get).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/profile/user/abc');
    expect(dispatch).toHaveBeenCalledWith({ type: GET_PROFILE, payload: { user: { _id: 'abc' } } });
  });

  it('gets GitHub repos successfully', async () => {
    axios.get.mockResolvedValue({ data: [{ name: 'repo-1' }] });
    const dispatch = jest.fn();

    await getGithubRepos('alice')(dispatch);

    expect(axios.get).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/profile/gitRepo/alice');
    expect(dispatch).toHaveBeenCalledWith({ type: GET_REPOS, payload: [{ name: 'repo-1' }] });
  });

  it('gets the current profile successfully', async () => {
    axios.get.mockResolvedValue({ data: { user: { name: 'Current User' } } });
    const dispatch = jest.fn();

    await getCurrentProfile()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: GET_PROFILE,
      payload: { user: { name: 'Current User' } },
    });
  });

  it('creates a profile and redirects to dashboard', async () => {
    axios.post.mockResolvedValue({ data: { profile: 'created' } });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });
    const history = { push: jest.fn() };

    await makeProfile({ company: 'Test Co', skills: 'React' }, history)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: GET_PROFILE, payload: { profile: 'created' } }));
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('dispatches PROFILE_ERROR when makeProfile fails', async () => {
    axios.post.mockRejectedValue({
      response: {
        statusText: 'Bad Request',
        status: 400,
        data: { errors: [{ msg: 'Skills are required' }] },
      },
    });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await makeProfile({ company: 'Bad Co' }, { push: jest.fn() })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: PROFILE_ERROR }));
  });

  it('adds experience successfully and redirects to dashboard', async () => {
    axios.put.mockResolvedValue({ data: { experience: ['job'] } });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });
    const history = { push: jest.fn() };

    await addExperience({ title: 'Front-end dev', company: 'X' }, history)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_PROFILE, payload: { experience: ['job'] } }));
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('adds education successfully and redirects to dashboard', async () => {
    axios.put.mockResolvedValue({ data: { education: ['school'] } });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });
    const history = { push: jest.fn() };

    await addEducation({ school: 'Uni', degree: 'BSc' }, history)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_PROFILE, payload: { education: ['school'] } }));
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('deletes experience and education without crashing', async () => {
    axios.delete.mockResolvedValue({ data: { ok: true } });
    const dispatch = jest.fn();

    await delExperience('exp-1', { push: jest.fn() })(dispatch);
    await delEducation('edu-1', { push: jest.fn() })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_PROFILE, payload: { ok: true } }));
  });

  it('deletes account when the user confirms', async () => {
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValue({ data: {} });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await delAccount('user-1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PROFILE });
    expect(dispatch).toHaveBeenCalledWith({ type: DELETE_PROFILE });
  });
});
