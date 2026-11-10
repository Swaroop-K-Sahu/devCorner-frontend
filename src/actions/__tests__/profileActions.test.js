import axios from 'axios';
import {
  getProfiles, getProfileById, getGithubRepos, getCurrentProfile, makeProfile,
  addExperience, addEducation, delExperience, delEducation, delAccount,
} from '../profile';
import { GET_ALL_PROFILES, PROFILE_ERROR, GET_PROFILE, GET_REPOS, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_PROFILE } from '../constants';

jest.mock('axios');

describe('profile actions', () => {
  let originalConfirm;
  beforeEach(() => { jest.clearAllMocks(); originalConfirm = window.confirm; });
  afterEach(() => { window.confirm = originalConfirm; });
  const dispatch = () => jest.fn();

  it('fetches profiles, individual profile, repos, and current profile', async () => {
    const send = dispatch();
    axios.get.mockResolvedValueOnce({ data: [{ _id: 'p' }] })
      .mockResolvedValueOnce({ data: { user: { _id: 'u' } } })
      .mockResolvedValueOnce({ data: [{ name: 'repo' }] })
      .mockResolvedValueOnce({ data: { user: { name: 'Alice' } } });
    await getProfiles()(send);
    await getProfileById('u')(send);
    await getGithubRepos('alice')(send);
    await getCurrentProfile()(send);
    expect(send).toHaveBeenCalledWith({ type: GET_ALL_PROFILES, payload: [{ _id: 'p' }] });
    expect(send).toHaveBeenCalledWith({ type: GET_PROFILE, payload: { user: { _id: 'u' } } });
    expect(send).toHaveBeenCalledWith({ type: GET_REPOS, payload: [{ name: 'repo' }] });
    expect(axios.get).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/profile/gitRepo/alice');
  });

  it.each([
    ['getProfiles', () => getProfiles()],
    ['getProfileById', () => getProfileById('u')],
    ['getGithubRepos', () => getGithubRepos('alice')],
    ['getCurrentProfile', () => getCurrentProfile()],
  ])('%s dispatches profile error on API failure', async (_label, action) => {
    axios.get.mockRejectedValue({ response: { statusText: 'Not Found', status: 404 } });
    const send = dispatch();
    await action()(send);
    expect(send).toHaveBeenCalledWith({ type: PROFILE_ERROR, payload: { msg: 'Not Found', status: 404 } });
  });

  it('creates a profile, alerts, and redirects only for create', async () => {
    axios.post.mockResolvedValue({ data: { _id: 'profile' } });
    const send = dispatch();
    const history = { push: jest.fn() };
    await makeProfile({ skills: 'React' }, history)(send);
    expect(send).toHaveBeenCalledWith({ type: GET_PROFILE, payload: { _id: 'profile' } });
    expect(history.push).toHaveBeenCalledWith('/dashboard');
    history.push.mockClear();
    await makeProfile({ skills: 'React' }, history, true)(send);
    expect(history.push).not.toHaveBeenCalled();
  });

  it('handles profile validation failure', async () => {
    axios.post.mockRejectedValue({ response: { statusText: 'Bad Request', status: 400, data: { errors: [{ msg: 'Required' }] } } });
    const send = dispatch();
    await makeProfile({}, { push: jest.fn() })(send);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: PROFILE_ERROR }));
  });

  it('adds experience and education successfully', async () => {
    axios.put.mockResolvedValueOnce({ data: { experience: [{ id: 'e' }] } }).mockResolvedValueOnce({ data: { education: [{ id: 'd' }] } });
    const send = dispatch();
    const history = { push: jest.fn() };
    await addExperience({ title: 'Dev' }, history)(send);
    await addEducation({ school: 'Uni' }, history)(send);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_PROFILE, payload: { experience: [{ id: 'e' }] } }));
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_PROFILE, payload: { education: [{ id: 'd' }] } }));
    expect(history.push).toHaveBeenCalledTimes(2);
  });

  it.each([['experience', addExperience], ['education', addEducation]])('handles %s validation failure', async (_label, action) => {
    axios.put.mockRejectedValue({ response: { statusText: 'Bad Request', status: 400, data: { errors: [{ msg: 'Invalid input' }] } } });
    const send = dispatch();
    await action({}, { push: jest.fn() })(send);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: PROFILE_ERROR }));
  });

  it('deletes experience and education entries', async () => {
    axios.delete.mockResolvedValue({ data: { updated: true } });
    const send = dispatch();
    await delExperience('e1', {})(send);
    await delEducation('d1', {})(send);
    expect(axios.delete).toHaveBeenCalledWith('https://devcorner-api.onrender.com/api/profile/experience/del/e1');
    expect(send).toHaveBeenCalledWith({ type: UPDATE_PROFILE, payload: { updated: true } });
  });

  it.each([['experience', delExperience], ['education', delEducation]])('dispatches error deleting %s', async (_label, action) => {
    axios.delete.mockRejectedValue({ response: { statusText: 'Forbidden', status: 403 } });
    const send = dispatch();
    await action('id', {})(send);
    expect(send).toHaveBeenCalledWith({ type: PROFILE_ERROR, payload: { msg: 'Forbidden', status: 403 } });
  });

  it('does not delete account when confirmation is declined', async () => {
    window.confirm = jest.fn(() => false);
    const send = dispatch();
    await delAccount('u')(send);
    expect(axios.delete).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('deletes account after confirmation and dispatches cleanup', async () => {
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValue({ data: {} });
    const send = dispatch();
    await delAccount('u')(send);
    expect(send).toHaveBeenCalledWith({ type: CLEAR_PROFILE });
    expect(send).toHaveBeenCalledWith({ type: DELETE_PROFILE });
  });
});
