import { kycSteps } from '../api';
import { Label } from '../modules/user/kyc/label';

export const getVerificationStep = (labels: Label[]) => {
    const lastVerifiedStep = labels.length && labels.slice().reverse().find((label: Label) => label.value === 'verified' && label.scope === 'private');
    const lastVerifiedStepKey = lastVerifiedStep ? lastVerifiedStep.key : '';
    const lastVerifiedStepIndex = kycSteps().findIndex((step: string) => step === lastVerifiedStepKey);
    const currentVerificationStep = kycSteps()[lastVerifiedStepIndex + 1] || '';

    return currentVerificationStep;
};
