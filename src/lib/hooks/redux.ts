import { useSelector, shallowEqual } from 'react-redux';

import { ReduxState } from 'src/redux/interfaces';
import { LocalizationContainer } from 'src/units/localization/interfaces';

export function useReduxSelector<T>(selector: (state: ReduxState) => T): T {
    return useSelector(selector, shallowEqual);
}

export function useLocalization(): LocalizationContainer {
    return useReduxSelector((x) => x.localization.text);
}
