import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import Landing from '../Landing';

describe('Landing page', () => {
  const renderLanding = (isAuthenticated) => {
    const store = createStore((state = { auth: { isAuthenticated } }) => state);
    return render(<Provider store={store}><MemoryRouter initialEntries={['/']}>
      <Route exact path="/" component={Landing} />
      <Route path="/dashboard" render={() => <div>Dashboard</div>} />
    </MemoryRouter></Provider>);
  };

  it('renders welcome content and signup link for guests', () => {
    renderLanding(false);
    expect(screen.getByText('Dev-Corner')).toBeInTheDocument();
    expect(screen.getByText(/exciting journey/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register');
  });

  it('redirects authenticated visitors to dashboard', () => {
    renderLanding(true);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
