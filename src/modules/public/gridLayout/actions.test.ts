import { LayoutGrid } from '../../../components/Grid';
import * as actions from './actions';

describe('Grid Layout actions', () => {
    it('should check saveLayouts action creator', () => {
        const expectedAction = {
            type: 'layouts/SAVE_LAYOUTS',
            payload: {
                key: 'layouts',
                layouts: {foo: 42} as unknown as LayoutGrid,
            },
        };

        expect(actions.saveLayouts(expectedAction.payload)).toEqual(expectedAction);
    });

    it('should check resetLayouts action creator', () => {
        const expectedAction = {
            type: 'layouts/RESET_LAYOUTS',
            payload: {
                key: 'layouts',
            },
        };

        expect(actions.resetLayouts(expectedAction.payload)).toEqual(expectedAction);
    });
});
