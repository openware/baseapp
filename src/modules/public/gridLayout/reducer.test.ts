import { LayoutGrid } from '../../../components/Grid';
import * as actions from './actions';
import { gridLayoutReducer, GridLayoutState, initialLayoutState } from './reducer';

describe('Grid Layout reducer', () => {
    it('should handle SAVE_LAYOUTS', () => {
        const payload = {
            key: 'layouts',
            layouts: {foo: 42} as unknown as LayoutGrid,
        };

        const expectedState: GridLayoutState = {
            ...initialLayoutState,
            layouts: payload.layouts,
        };

        expect(gridLayoutReducer(initialLayoutState, actions.saveLayouts({
            key: payload.key,
            layouts: payload.layouts,
        }))).toEqual(expectedState);
    });

    it('should handle RESET_LAYOUTS', () => {
        const payload = {
            key: 'layouts',
        };

        const expectedState: GridLayoutState = {
            ...initialLayoutState,
        };

        expect(gridLayoutReducer(initialLayoutState, actions.resetLayouts(payload))).toEqual(expectedState);
    });
});
