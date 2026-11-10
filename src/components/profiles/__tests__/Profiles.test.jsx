import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

jest.mock('../../../actions/profile', () => ({
  getCurrentProfile: jest.fn(),
  delAccount: jest.fn(),
}));

describe('Dashboard integration', () => {
  const renderDashboard = (stateOverrides = {}) => {
    const defaultState = {
      auth: {
        user: { _id: 'user-1', name: 'Alice' },
      },
      profile: {
        profile: null,
        loading: false,
      },
    };

    const store = createStore((currentState = { ...defaultState, ...stateOverrides }) => currentState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
  };

  it('shows the create profile prompt when the user has no profile', () => {
    renderDashboard();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/hello alice/i)).toBeInTheDocument();
    expect(screen.getByText(/click the below button to create your profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /let's go/i })).toBeInTheDocument();
  });

  it('renders the user dashboard when a profile exists', () => {
    renderDashboard({
      profile: {
        profile: {
          user: { avatar: 'https://example.com/avatar.png' },
          experience: [],
          education: [],
        },
        loading: false,
      },
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/hello alice/i)).toBeInTheDocument();
    expect(screen.getByText('Delete My Account')).toBeInTheDocument();
  });
});
