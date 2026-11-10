import { setAlert } from '../alert';
import { SET_ALERT, REMOVE_ALERT } from '../constants';

jest.mock('uuid', () => ({ v4: () => 'fixed-id' }));

describe('setAlert action', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => { jest.runOnlyPendingTimers(); jest.useRealTimers(); });

  it('dispatches the alert and removes it after three seconds', () => {
    const dispatch = jest.fn();
    setAlert('Saved', 'success')(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: SET_ALERT,
      payload: { id: 'fixed-id', msg: 'Saved', alertType: 'success' },
    });
    jest.advanceTimersByTime(2999);
    expect(dispatch).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: REMOVE_ALERT, payload: 'fixed-id' });
  });
});
