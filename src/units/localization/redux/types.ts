import { ReduxUtil } from '../../../redux/utils/action';

const prefix = '@localization';

export const LocalizationActionTypes = {
    LOAD_SUCCESS: ReduxUtil.getType(prefix, 'LOAD_SUCCESS'),
    SET_LOCALE: ReduxUtil.getType(prefix, 'SET_LOCALE'),
};
