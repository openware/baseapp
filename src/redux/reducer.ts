import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';

import { localizationReducer as localization } from '../units/localization/redux/reducer';
import { keepReducer as keep } from '../units/keep/redux/reducer';
import { commonReducer as common } from '../units/common/redux/reducer';

export const rootReducer = combineReducers({
    form,
    localization,
    keep,
    common,
});
