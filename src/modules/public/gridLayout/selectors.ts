import { RootState } from '../../index';
import { GridLayoutState } from './reducer';

export const selectGridLayoutState = (state: RootState): GridLayoutState => state.public.rgl;
