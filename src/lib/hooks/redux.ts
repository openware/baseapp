import { useSelector, shallowEqual } from 'react-redux';

import { RootState } from '../../modules';

export function useReduxSelector<T>(selector: (state: RootState) => T): T {
    return useSelector(selector, shallowEqual);
}
