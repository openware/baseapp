import { UnsupportedChainIdError } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';

export const getMetaMaskErrorMessage = (error: Error): string => {
    if (error instanceof NoEthereumProviderError) {
        return 'metamask.error.noExtension';
    } else if (error instanceof UnsupportedChainIdError) {
        return 'metamask.error.unsupportedNetwork';
    } else if (error instanceof UserRejectedRequestErrorInjected) {
        return 'metamask.error.unauthorized';
    } else {
        return 'metamask.error.unknown';
    }
};
