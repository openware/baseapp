import { useSelector } from 'react-redux';
import { RootState } from '../modules';

export function useReduxState<T>(callback: (state: RootState) => T): T {
    return useSelector(callback);
}
