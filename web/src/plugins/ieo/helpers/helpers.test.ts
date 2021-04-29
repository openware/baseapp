import * as helpers from './';

describe('Helpers', () => {
    it('getCountdownDate', () => {
        expect(helpers.getCountdownDate('2019-10-01T15:55:00.000Z')).toBe('00:00:00');
        expect(helpers.getCountdownDate('2019-10-01T15:55:00.000Z', '5m')).toBe('00:00:00');
    });
});
