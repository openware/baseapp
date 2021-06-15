import { RootState } from '../../';
import { AbilitiesState } from './';

export const selectAbilities = (state: RootState): AbilitiesState['abilities'] =>
    state.user.abilities.abilities;

export const selectLoadingAbilities = (state: RootState): AbilitiesState['loading'] =>
    state.user.abilities.loading;
