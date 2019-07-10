import { RootState } from '../../../modules';
import { ColorThemeState } from './reducer';

export const selectCurrentColorTheme = (state: RootState): ColorThemeState['color'] => state.public.colorTheme.color;
