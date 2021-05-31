import { RootState } from '../../';
import { ConfigsState } from './reducer';

export const selectConfigsLoading = (state: RootState): ConfigsState['loading'] =>
    state.public.configs.loading;
