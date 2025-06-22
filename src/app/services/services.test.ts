import { DateUtils } from './utils/DateUtils';

describe('DateUtils.getDuration', () => {
  it('returns correct minutes when under 60 mins', () => {
    const start = '2023-01-01T10:00:00Z';
    const stop = '2023-01-01T10:45:00Z';
    expect(DateUtils.getDuration(start, stop)).toBe('45 min');
  });

  it('returns correct hours when exactly on the hour', () => {
    const start = '2023-01-01T10:00:00Z';
    const stop = '2023-01-01T13:00:00Z';
    expect(DateUtils.getDuration(start, stop)).toBe('3h');
  });

  it('returns correct hours and minutes when over an hour', () => {
    const start = '2023-01-01T10:00:00Z';
    const stop = '2023-01-01T12:30:00Z';
    expect(DateUtils.getDuration(start, stop)).toBe('2h 30m');
  });



  it('handles durations that are not clean numbers', () => {
    const start = '2023-01-01T10:00:00Z';
    const stop = '2023-01-01T10:01:30Z'; // 1.5 minutes
    expect(DateUtils.getDuration(start, stop)).toBe('1.5 min');
  });
});
