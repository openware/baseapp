import { DocumentsState } from './documents';
import { IdentityState } from './identity';
import { LabelState } from './label';
import { PhoneState } from './phone';

export * from './documents';
export * from './identity';
export * from './phone';
export * from './label';


export type KycState = PhoneState & IdentityState & DocumentsState & LabelState;
