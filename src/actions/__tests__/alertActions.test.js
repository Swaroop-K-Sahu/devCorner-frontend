import alertReducer from '../alert';
import { SET_ALERT, REMOVE_ALERT } from '../../actions/constants';

describe('alert reducer', () => {
  it('adds an alert when SET_ALERT is dispatched', () => {
    const state = alertReducer(undefined, {
      type: SET_ALERT,
      payload: { id: '1', msg: 'Oops', alertType: 'danger' },
    });

    expect(state).toEqual([{ id: '1', msg: 'Oops', alertType: 'danger' }]);
  });

  it('removes the matching alert when REMOVE_ALERT is dispatched', () => {
    const state = alertReducer(
      [
        { id: '1', msg: 'One', alertType: 'danger' },
        { id: '2', msg: 'Two', alertType: 'success' },
      ],
      { type: REMOVE_ALERT, payload: '1' }
    );

    expect(state).toEqual([{ id: '2', msg: 'Two', alertType: 'success' }]);
  });

  it('returns the current state for unknown actions', () => {
    const state = [{ id: 'abc', msg: 'Keep', alertType: 'info' }];
    expect(alertReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});
