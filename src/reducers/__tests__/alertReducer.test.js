import alertReducer from '../alert';
import { SET_ALERT, REMOVE_ALERT } from '../../actions/constants';

describe('alert reducer', () => {
  it('adds alerts and retains prior alerts', () => {
    const first = { id: '1', msg: 'Oops', alertType: 'danger' };
    const second = { id: '2', msg: 'Saved', alertType: 'success' };
    expect(alertReducer(undefined, { type: SET_ALERT, payload: first })).toEqual([first]);
    expect(alertReducer([first], { type: SET_ALERT, payload: second })).toEqual([first, second]);
  });

  it('removes only the alert with the requested ID', () => {
    const alerts = [{ id: '1' }, { id: '2' }];
    expect(alertReducer(alerts, { type: REMOVE_ALERT, payload: '1' })).toEqual([{ id: '2' }]);
    expect(alertReducer(alerts, { type: REMOVE_ALERT, payload: 'missing' })).toEqual(alerts);
  });

  it('returns current state for unknown actions', () => {
    const state = [{ id: '1' }];
    expect(alertReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});
