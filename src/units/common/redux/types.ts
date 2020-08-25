import { ReduxUtil } from '../../../redux/utils/action';

const prefix = '@common';

export const CommonActionTypes = {
    INIT: ReduxUtil.getType(prefix, 'INIT'),
    DIALOG: ReduxUtil.getType(prefix, 'DIALOG'),
    LOADING: ReduxUtil.getType(prefix, 'LOADING'),
    SHOW_TOAST: ReduxUtil.getType(prefix, 'SHOW_TOAST'),
    SET_INITIALIZED: ReduxUtil.getType(prefix, 'SET_INITIALIZED'),
};
