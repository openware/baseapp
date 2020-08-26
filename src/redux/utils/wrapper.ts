import { AnyAction } from 'redux';

interface ReducerMethods<StateType> {
    [actionType: string]: (state: StateType, payload?: any) => StateType;
}

export function reducerWrapper<TState>(
    initialState: TState,
    reducerMethods: ReducerMethods<TState>
): (state: TState, action: AnyAction) => TState {
    return function reducerFunction(
        state: TState = initialState,
        action: AnyAction = { type: '', payload: null }
    ): TState {
        if (action.type in reducerMethods) {
            // console.log(action.type);
            return reducerMethods[action.type](state, action.payload);
        }
        return state;
    };
}
