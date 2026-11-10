import axios from 'axios';
import { fetchPosts, addLike, removeLike, removePost, addPost, fetchPost, addComment, removeComment } from '../post';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, UPDATE_DISLIKES, ADD_POSTS, GET_POST, UPDATE_COMMENTS } from '../constants';

jest.mock('axios');

describe('post actions', () => {
  beforeEach(() => jest.clearAllMocks());
  const dispatch = () => jest.fn();
  const error = { response: { statusText: 'Server Error', status: 500 } };

  it('fetches feed and single post', async () => {
    const send = dispatch();
    axios.get.mockResolvedValueOnce({ data: [{ _id: 'p1' }] }).mockResolvedValueOnce({ data: { _id: 'p1', comments: [] } });
    await fetchPosts()(send);
    await fetchPost('p1')(send);
    expect(send).toHaveBeenCalledWith({ type: GET_POSTS, payload: [{ _id: 'p1' }] });
    expect(send).toHaveBeenCalledWith({ type: GET_POST, payload: { _id: 'p1', comments: [] } });
  });

  it.each([['feed', fetchPosts], ['single post', () => fetchPost('p1')]])('reports fetch %s errors', async (_label, action) => {
    axios.get.mockRejectedValue(error);
    const send = dispatch();
    await action()(send);
    expect(send).toHaveBeenCalledWith({ type: POST_ERROR, payload: { msg: 'Server Error', status: 500 } });
  });

  it('updates likes and dislikes', async () => {
    const send = dispatch();
    axios.put.mockResolvedValueOnce({ data: [{ user: 'u1' }] }).mockResolvedValueOnce({ data: [{ user: 'u2' }] });
    await addLike('p1')(send);
    await removeLike('p1')(send);
    expect(send).toHaveBeenCalledWith({ type: UPDATE_LIKES, payload: { postId: 'p1', likes: [{ user: 'u1' }] } });
    expect(send).toHaveBeenCalledWith({ type: UPDATE_DISLIKES, payload: { postId: 'p1', dislikes: [{ user: 'u2' }] } });
  });

  it.each([['like', addLike], ['dislike', removeLike]])('reports %s failures', async (_label, action) => {
    axios.put.mockRejectedValue(error);
    const send = dispatch();
    await action('p1')(send);
    expect(send).toHaveBeenCalledWith({ type: POST_ERROR, payload: { msg: 'Server Error', status: 500 } });
  });

  it('creates a post, dispatches success, and redirects', async () => {
    axios.post.mockResolvedValue({ data: { _id: 'new', head: 'Hello' } });
    const send = dispatch();
    const history = { push: jest.fn() };
    await addPost({ head: 'Hello', body: 'World' }, history)(send);
    expect(send).toHaveBeenCalledWith({ type: ADD_POSTS, payload: { _id: 'new', head: 'Hello' } });
    expect(history.push).toHaveBeenCalledWith('/posts');
  });

  it('reports post creation errors without redirecting', async () => {
    axios.post.mockRejectedValue(error);
    const send = dispatch();
    const history = { push: jest.fn() };
    await addPost({}, history)(send);
    expect(send).toHaveBeenCalledWith({ type: POST_ERROR, payload: { msg: 'Server Error', status: 500 } });
    expect(history.push).not.toHaveBeenCalled();
  });

  it('deletes post and dispatches refreshed feed', async () => {
    axios.delete.mockResolvedValue({ data: [] });
    const send = dispatch();
    await removePost('p1')(send);
    expect(send).toHaveBeenCalledWith({ type: GET_POSTS, payload: [] });
  });

  it('reports post deletion errors', async () => {
    axios.delete.mockRejectedValue(error);
    const send = dispatch();
    await removePost('p1')(send);
    expect(send).toHaveBeenCalledWith({ type: POST_ERROR, payload: { msg: 'Server Error', status: 500 } });
  });

  it('adds and deletes comments', async () => {
    const send = dispatch();
    axios.post.mockResolvedValue({ data: [{ _id: 'c1' }] });
    axios.delete.mockResolvedValue({ data: [] });
    await addComment({ body: 'Nice' }, 'p1')(send);
    await removeComment('p1', 'c1')(send);
    expect(send).toHaveBeenCalledWith({ type: UPDATE_COMMENTS, payload: [{ _id: 'c1' }] });
    expect(send).toHaveBeenCalledWith({ type: UPDATE_COMMENTS, payload: [] });
  });

  it.each([['comment creation', addComment], ['comment deletion', (data, id) => removeComment(id, 'c1')]])('reports %s errors', async (_label, action) => {
    axios.post.mockRejectedValue(error);
    axios.delete.mockRejectedValue(error);
    const send = dispatch();
    await action({ body: 'x' }, 'p1')(send);
    expect(send).toHaveBeenCalledWith({ type: POST_ERROR, payload: { msg: 'Server Error', status: 500 } });
  });
});
