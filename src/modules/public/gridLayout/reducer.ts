import {
    getLayoutFromLS,
    LayoutGrid,
    layouts,
    resetLayout,
    saveLayoutToLS,
} from '../../../helpers/layout';
import { RESET_LAYOUTS, SAVE_LAYOUTS } from './constants';

export interface GridLayoutState {
    layouts: LayoutGrid;
}

export const initialLayoutState: GridLayoutState = {
    layouts: getLayoutFromLS('layouts') || layouts,
};

export const gridLayoutReducer = (state = initialLayoutState, action) => {
    switch (action.type) {
        case SAVE_LAYOUTS:
            saveLayoutToLS(action.payload.key, action.payload.layouts);

            return {
                layouts: action.payload.layouts,
            };
        case RESET_LAYOUTS:
            resetLayout(action.payload.key);

            return {
                layouts: layouts,
            };
        default:
            return state;
    }
};
