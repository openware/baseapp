import { LocalizationState } from '../../units/localization/interfaces';
import { KeepState } from 'src/units/keep/interfaces';

interface MutableState {
    localization: Readonly<LocalizationState>;
    form: Readonly<any>;
    keep: Readonly<KeepState>;
}

export type ReduxState = Readonly<MutableState>;

export interface LocalStorageState {
    keep: Readonly<KeepState>;
}

export interface LocalStorageVersionState extends LocalStorageState {
    version: number;
}
