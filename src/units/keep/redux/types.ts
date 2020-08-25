import { ReduxUtil } from '../../../redux/utils/action';

const prefix = '@keep';

export const KeepTypes = {
    SAVE_LOCALE: ReduxUtil.getType(prefix, 'SAVE_LOCALE')
};
