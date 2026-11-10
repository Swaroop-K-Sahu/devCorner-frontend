import axios from 'axios';
import { setAlert } from '../alert';
import { SET_ALERT, REMOVE_ALERT } from '../constants';

jest.mock('axios');
jest.mock('uuid', () => ({
  v4: () => 'test-alert-id',
}));

describe('alert action', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('dispatches SET_ALERT and then removes it after 3 seconds', () => {
    const dispatch = jest.fn();

    setAlert('Validation failed', 'danger')(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: SET_ALERT,
      payload: { msg: 'Validation failed', alertType: 'danger', id: 'test-alert-id' },
    });

    jest.advanceTimersByTime(3000);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: REMOVE_ALERT,
      payload: 'test-alert-id',
    });
  });
});
