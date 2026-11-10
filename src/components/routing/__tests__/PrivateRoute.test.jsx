import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Posts from '../Posts';

jest.mock('../../../actions/post', () => ({
  fetchPosts: jest.fn(),
}));

describe('Posts integration', () => {
  it('renders posts and shows the create-post action for authenticated users', () => {
    const store = createStore((state = {
      post: {
        posts: [{
          _id: 'post-1',
          head: 'Hello world',
          body: 'This is a post body',
          name: 'Alice',
          avatar: 'https://example.com/avatar.png',
          user: 'user-1',
          likes: [],
          dislikes: [],
          comments: [],
          date: '2024-01-01T00:00:00Z',
        }],
        loading: false,
      },
      auth: {
        isAuthenticated: true,
        loading: false,
        user: { _id: 'user-1' },
      },
    }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Posts />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create a new post/i })).toBeInTheDocument();
  });

  it('hides the create-post action for unauthenticated users', () => {
    const store = createStore((state = {
      post: {
        posts: [],
        loading: false,
      },
      auth: {
        isAuthenticated: false,
        loading: false,
        user: null,
      },
    }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Posts />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create a new post/i })).not.toBeInTheDocument();
  });
});
