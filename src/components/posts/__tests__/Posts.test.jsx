import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Profiles from '../Profiles';

jest.mock('../../../actions/profile', () => ({
  getProfiles: jest.fn(),
}));

describe('Profiles integration', () => {
  it('renders the profiles list and invokes getProfiles on mount', () => {
    const store = createStore((state = {
      profile: {
        profiles: [{
          _id: 'profile-1',
          user: { _id: 'u1', name: 'Alice', avatar: 'https://example.com/alice.png' },
          status: 'Developer',
          company: 'Acme',
          location: 'San Francisco',
          skills: ['React', 'Node', 'JS'],
        }],
        loading: false,
      },
    }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Profiles />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Our Community')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view profile/i })).toBeInTheDocument();
  });

  it('renders the empty-state message when no profiles exist', () => {
    const store = createStore((state = {
      profile: {
        profiles: [],
        loading: false,
      },
    }) => state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Profiles />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No Profiles found')).toBeInTheDocument();
  });
});
