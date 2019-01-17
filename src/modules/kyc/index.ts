import { DocumentsState } from './documents';
import { IdentityState } from './identity';
import { PhoneState } from './phone';

export * from './documents';
export * from './identity';
export * from './phone';


export type KycState = PhoneState & IdentityState & DocumentsState;
