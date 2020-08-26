import { LocalizationState } from '../../units/localization/interfaces';
import { KeepState } from 'src/units/keep/interfaces';
import { CommonState } from 'src/units/common/interfaces';

interface MutableState {
    localization: Readonly<LocalizationState>;
    form: Readonly<any>;
    keep: Readonly<KeepState>;
    common: Readonly<CommonState>;
}

export type ReduxState = Readonly<MutableState>;

export interface LocalStorageState {
    keep: Readonly<KeepState>;
}

export interface LocalStorageVersionState extends LocalStorageState {
    version: number;
}
