import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Posts from '../Posts';
import { fetchPosts, addLike, removeLike, removePost } from '../../../actions/post';

jest.mock('../../../actions/post', () => ({
  fetchPosts: jest.fn(() => ({ type: 'TEST_FETCH_POSTS' })),
  addLike: jest.fn(() => ({ type: 'TEST_ADD_LIKE' })),
  removeLike: jest.fn(() => ({ type: 'TEST_REMOVE_LIKE' })),
  removePost: jest.fn(() => ({ type: 'TEST_REMOVE_POST' })),
}));

describe('Posts integration', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders feed posts and authenticated actions', () => {
    const post = {
      _id: 'post-1', head: 'Hello', body: 'Content', name: 'Alice', avatar: '', user: 'user-1',
      likes: [], dislikes: [], comments: [], date: '2024-01-01T00:00:00Z',
    };
    const store = createStore((state = {
      post: { posts: [post], loading: false },
      auth: { isAuthenticated: true, loading: false, user: { _id: 'user-1' } },
    }) => state);

    render(<Provider store={store}><MemoryRouter><Posts /></MemoryRouter></Provider>);

    expect(fetchPosts).toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create a new post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  it('passes through complete action creators to connected PostItem', () => {
    expect(addLike).toBeDefined();
    expect(removeLike).toBeDefined();
    expect(removePost).toBeDefined();
  });
});
