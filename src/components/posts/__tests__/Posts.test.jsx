import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Posts from '../Posts';
import { fetchPosts } from '../../../actions/post';

jest.mock('../../../actions/post', () => ({ fetchPosts: jest.fn() }));

const makePost = (id = 'post-1') => ({
  _id: id, head: `Headline ${id}`, body: 'Post content', name: 'Alice', avatar: '', user: 'user-1',
  likes: [], dislikes: [], comments: [], date: '2024-01-01T00:00:00Z',
});

const renderPosts = (posts, auth, loading = false) => {
  const store = createStore((state = { post: { posts, loading }, auth }) => state);
  return render(<Provider store={store}><MemoryRouter><Posts /></MemoryRouter></Provider>);
};

describe('Posts integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches the feed and renders spinner while loading', () => {
    renderPosts([], { isAuthenticated: false }, true);
    expect(fetchPosts).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.fa-spin')).toBeInTheDocument();
  });

  it('renders posts and create-post navigation for authenticated users', () => {
    renderPosts([makePost()], { isAuthenticated: true, loading: false, user: { _id: 'user-1' } });
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument();
    expect(screen.getByText('Headline post-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create a new post/i }).closest('a')).toHaveAttribute('href', '/newPost');
    expect(screen.getByRole('button', { name: 'View' }).closest('a')).toHaveAttribute('href', '/post/post-1');
  });

  it('does not show create action to guests and renders empty feed', () => {
    renderPosts([], { isAuthenticated: false, loading: false, user: null });
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create a new post/i })).not.toBeInTheDocument();
  });
});
