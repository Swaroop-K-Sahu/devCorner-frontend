import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Profiles from '../Profiles';
import { getProfiles } from '../../../actions/profile';

jest.mock('../../../actions/profile', () => ({ getProfiles: jest.fn() }));

const renderProfiles = (profiles, loading = false) => {
  const store = createStore((state = { profile: { profiles, loading } }) => state);
  return render(<Provider store={store}><MemoryRouter><Profiles /></MemoryRouter></Provider>);
};

describe('Profiles integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requests profiles and renders spinner while loading', () => {
    renderProfiles([], true);
    expect(getProfiles).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.fa-spin')).toBeInTheDocument();
  });

  it('renders profile cards with profile link and skills', () => {
    renderProfiles([{
      _id: 'profile-1',
      user: { _id: 'user-1', name: 'Alice', avatar: 'https://example.com/alice.png' },
      status: 'Developer', company: 'Acme', location: 'Toronto', skills: ['React', 'Node', 'JavaScript', 'CSS', 'Hidden'],
    }]);
    expect(screen.getByRole('heading', { name: 'Our Community' })).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Toronto')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view profile/i }).closest('a')).toHaveAttribute('href', '/profile/user-1');
  });

  it('renders empty state for no profiles', () => {
    renderProfiles([]);
    expect(screen.getByText('No Profiles found')).toBeInTheDocument();
  });
});
