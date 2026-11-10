import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { getCurrentProfile, delAccount } from '../../../actions/profile';

jest.mock('../../../actions/profile', () => ({ getCurrentProfile: jest.fn(), delAccount: jest.fn() }));

const renderDashboard = (profile, loading = false) => {
  const state = {
    auth: { user: { _id: 'user-1', name: 'Alice' } },
    profile: { profile, loading },
  };
  const store = createStore((current = state) => current);
  return render(<Provider store={store}><MemoryRouter><Dashboard /></MemoryRouter></Provider>);
};

describe('Dashboard integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches profile and shows spinner while waiting', () => {
    renderDashboard(null, true);
    expect(getCurrentProfile).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.fa-spin')).toBeInTheDocument();
  });

  it('offers profile creation when user has no profile', () => {
    renderDashboard(null);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/hello alice/i)).toBeInTheDocument();
    expect(screen.getByText(/click the below button to create your profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /let's go/i }).closest('a')).toHaveAttribute('href', '/createProfile');
  });

  it('renders dashboard details and calls account deletion action', () => {
    renderDashboard({ user: { avatar: 'https://example.com/avatar.png' }, experience: [], education: [] });
    expect(screen.getByText('Experience Credentials')).toBeInTheDocument();
    expect(screen.getByText('Education Details')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));
    expect(delAccount).toHaveBeenCalledWith('user-1');
  });
});
