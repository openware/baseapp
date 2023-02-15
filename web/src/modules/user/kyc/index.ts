import { AddressesState } from './addresses';
import { DocumentsState } from './documents';
import { IdentityState } from './identity';
import { LabelState } from './label';
import { PhoneState } from './phone';

export * from './addresses';
export * from './documents';
export * from './identity';
export * from './label';
export * from './phone';

export type KycState = AddressesState & PhoneState & IdentityState & DocumentsState & LabelState;
