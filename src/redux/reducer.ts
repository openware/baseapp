import { publicReducer, userReducer } from '../modules/app';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
});
