import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Alert from '../Alert';

describe('Alert component', () => {
  const renderAlerts = (alert) => {
    const store = createStore((state = { alert }) => state);
    return render(<Provider store={store}><Alert /></Provider>);
  };

  it('renders alerts with their type class', () => {
    renderAlerts([{ id: 'a', msg: 'Saved', alertType: 'success' }]);
    expect(screen.getByText('Saved')).toHaveClass('alert', 'alert-success');
  });

  it('renders nothing when no alerts exist', () => {
    const { container } = renderAlerts([]);
    expect(container.firstChild).toBeNull();
  });
});
