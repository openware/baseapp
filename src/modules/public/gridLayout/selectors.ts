import { RootState } from '../../';
import { GridLayoutState } from './reducer';

export const selectGridLayoutState = (state: RootState): GridLayoutState => state.public.rgl;
