import postReducer from '../post';
import { GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, UPDATE_DISLIKES, ADD_POSTS, UPDATE_COMMENTS } from '../../actions/constants';

describe('post reducer', () => {
  it('returns initial state and preserves it for unknown actions', () => {
    const initial = postReducer(undefined, { type: '@@INIT' });
    expect(initial).toEqual({ posts: [], post: null, loading: true, error: {} });
    expect(postReducer(initial, { type: 'UNKNOWN' })).toBe(initial);
  });

  it('loads posts, creates post at front, and loads a single post', () => {
    const state = postReducer(undefined, { type: GET_POSTS, payload: [{ _id: 'a' }] });
    expect(state).toMatchObject({ posts: [{ _id: 'a' }], loading: false });
    const added = postReducer(state, { type: ADD_POSTS, payload: { _id: 'b' } });
    expect(added.posts.map(({ _id }) => _id)).toEqual(['b', 'a']);
    expect(postReducer(added, { type: GET_POST, payload: { _id: 'a' } })).toMatchObject({ post: { _id: 'a' }, loading: false });
  });

  it('stores errors and updates only the matching post likes/dislikes', () => {
    const posts = [{ _id: 'one', likes: [], dislikes: [] }, { _id: 'two', likes: [], dislikes: [] }];
    const initial = { posts, post: null, loading: true, error: {} };
    const likes = postReducer(initial, { type: UPDATE_LIKES, payload: { postId: 'one', likes: ['u'] } });
    expect(likes.posts[0].likes).toEqual(['u']);
    expect(likes.posts[1]).toEqual(posts[1]);
    const dislikes = postReducer(likes, { type: UPDATE_DISLIKES, payload: { postId: 'one', dislikes: ['v'] } });
    expect(dislikes.posts[0].dislikes).toEqual(['v']);
    expect(postReducer(initial, { type: POST_ERROR, payload: { status: 500 } })).toMatchObject({ error: { status: 500 }, loading: false });
  });

  it('updates comments on the current post', () => {
    const state = postReducer({ posts: [], post: { _id: 'a', comments: [] }, loading: true, error: {} }, {
      type: UPDATE_COMMENTS, payload: [{ _id: 'c' }],
    });
    expect(state).toMatchObject({ post: { _id: 'a', comments: [{ _id: 'c' }] }, loading: false });
  });
});
