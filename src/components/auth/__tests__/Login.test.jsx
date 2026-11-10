import axios from 'axios';
import {
  fetchPosts,
  addLike,
  removeLike,
  removePost,
  addPost,
  fetchPost,
  addComment,
  removeComment,
} from '../post';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  UPDATE_DISLIKES,
  ADD_POSTS,
  GET_POST,
  UPDATE_COMMENTS,
} from '../constants';

jest.mock('axios');

describe('post actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches posts successfully', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1', head: 'Hello' }] });
    const dispatch = jest.fn();

    await fetchPosts()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: GET_POSTS,
      payload: [{ _id: '1', head: 'Hello' }],
    });
  });

  it('dispatches POST_ERROR when fetching posts fails', async () => {
    axios.get.mockRejectedValue({ response: { statusText: 'Server Error', status: 500 } });
    const dispatch = jest.fn();

    await fetchPosts()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: POST_ERROR,
      payload: { msg: 'Server Error', status: 500 },
    });
  });

  it('adds a like to a post', async () => {
    axios.put.mockResolvedValue({ data: 4 });
    const dispatch = jest.fn();

    await addLike('post-1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_LIKES,
      payload: { postId: 'post-1', likes: 4 },
    });
  });

  it('removes a like from a post', async () => {
    axios.put.mockResolvedValue({ data: 2 });
    const dispatch = jest.fn();

    await removeLike('post-1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_DISLIKES,
      payload: { postId: 'post-1', dislikes: 2 },
    });
  });

  it('creates a post successfully', async () => {
    axios.post.mockResolvedValue({ data: { _id: 'new', head: 'Fresh' } });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });
    const history = { push: jest.fn() };

    await addPost({ head: 'Fresh', body: 'Text' }, history)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: ADD_POSTS }));
    expect(history.push).toHaveBeenCalledWith('/posts');
  });

  it('dispatches POST_ERROR when creating a post fails', async () => {
    axios.post.mockRejectedValue({ response: { statusText: 'Bad Request', status: 400 } });
    const dispatch = jest.fn();

    await addPost({ head: 'Bad', body: 'Text' }, { push: jest.fn() })(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: POST_ERROR,
      payload: { msg: 'Bad Request', status: 400 },
    });
  });

  it('fetches a particular post successfully', async () => {
    axios.get.mockResolvedValue({ data: { _id: '1', comments: [] } });
    const dispatch = jest.fn();

    await fetchPost('1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: GET_POST,
      payload: { _id: '1', comments: [] },
    });
  });

  it('adds a comment successfully', async () => {
    axios.post.mockResolvedValue({ data: ['new-comment'] });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await addComment({ text: 'Nice' }, 'post-1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_COMMENTS, payload: ['new-comment'] }));
  });

  it('removes a comment successfully', async () => {
    axios.delete.mockResolvedValue({ data: ['remaining'] });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await removeComment('post-1', 'comment-1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: UPDATE_COMMENTS, payload: ['remaining'] }));
  });

  it('removes a post successfully', async () => {
    axios.delete.mockResolvedValue({ data: [{ _id: '1', head: 'Fetched after delete' }] });
    const dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch);
      return action;
    });

    await removePost('1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: GET_POSTS,
      payload: [{ _id: '1', head: 'Fetched after delete' }],
    });
  });
});
