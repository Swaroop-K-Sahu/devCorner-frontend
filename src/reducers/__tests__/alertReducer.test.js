import postReducer from '../post';
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  UPDATE_DISLIKES,
  ADD_POSTS,
  UPDATE_COMMENTS,
} from '../../actions/constants';

describe('post reducer', () => {
  it('returns the default state', () => {
    const state = postReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      posts: [],
      post: null,
      loading: true,
      error: {},
    });
  });

  it('loads posts, adds a new post, and fetches a single post', () => {
    const postsState = postReducer(undefined, {
      type: GET_POSTS,
      payload: [{ _id: '1', text: 'hello' }],
    });

    const addState = postReducer(postsState, {
      type: ADD_POSTS,
      payload: { _id: '2', text: 'new post' },
    });

    const singleState = postReducer(addState, {
      type: GET_POST,
      payload: { _id: '1', text: 'hello', comments: [] },
    });

    expect(postsState).toMatchObject({ posts: [{ _id: '1', text: 'hello' }], loading: false });
    expect(addState.posts[0]).toMatchObject({ _id: '2', text: 'new post' });
    expect(singleState).toMatchObject({ post: { _id: '1', text: 'hello', comments: [] }, loading: false });
  });

  it('handles post errors and updates likes and dislikes', () => {
    const errorState = postReducer(undefined, {
      type: POST_ERROR,
      payload: { msg: 'Server error', status: 500 },
    });

    const likesState = postReducer(
      {
        posts: [{ _id: '1', likes: 1, dislikes: 0 }],
        post: null,
        loading: true,
        error: {},
      },
      { type: UPDATE_LIKES, payload: { postId: '1', likes: 5 } }
    );

    const dislikesState = postReducer(
      likesState,
      { type: UPDATE_DISLIKES, payload: { postId: '1', dislikes: 3 } }
    );

    expect(errorState).toMatchObject({ loading: false, error: { msg: 'Server error', status: 500 } });
    expect(likesState.posts[0]).toMatchObject({ _id: '1', likes: 5, dislikes: 0 });
    expect(dislikesState.posts[0]).toMatchObject({ _id: '1', likes: 5, dislikes: 3 });
  });

  it('updates the current post comments', () => {
    const state = postReducer(
      { posts: [], post: { _id: '1', comments: ['old'] }, loading: false, error: {} },
      { type: UPDATE_COMMENTS, payload: ['new'] }
    );

    expect(state.post.comments).toEqual(['new']);
    expect(state.loading).toBe(false);
  });
});
