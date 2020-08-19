import { combineReducers } from 'redux';

import { publicReducer, userReducer } from '../modules/app';

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
});
