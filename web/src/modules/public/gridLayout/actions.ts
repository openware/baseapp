import { LayoutGrid } from '../../../helpers/layout';
import { RESET_LAYOUTS, SAVE_LAYOUTS } from './constants';

interface SaveLayoutsAction {
    type: string;
    payload: {
        key: string;
        layouts: LayoutGrid;
    };
}

interface ResetLayoutsAction {
    type: string;
    payload: {
        key: string;
    };
}

export const saveLayouts = (payload: SaveLayoutsAction['payload']): SaveLayoutsAction => ({
    type: SAVE_LAYOUTS,
    payload,
});

export const resetLayouts = (payload: ResetLayoutsAction['payload']): ResetLayoutsAction => ({
    type: RESET_LAYOUTS,
    payload,
});
