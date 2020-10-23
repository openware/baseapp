import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError, useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import {
    InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
  } from '@web3-react/injected-connector';
import * as React from 'react';

import { useDispatch } from 'react-redux';
import { MetaMaskLogo } from '../../assets/images/MetaMaskLogo';
import { Web3ProviderWrapper } from '../../helpers';
import { alertPush } from '../../modules';

interface OwnProps {
    depositAddress: string;
}

type Props = OwnProps;

const getErrorMessage = (error: Error): string => {
    if (error instanceof NoEthereumProviderError) {
        return 'metamask.error.noExtension';
    } else if (error instanceof UnsupportedChainIdError) {
        return 'metamask.error.unsupportedNetwork';
    } else if (error instanceof UserRejectedRequestErrorInjected) {
        return 'metamask.error.unauthorized';
    } else {
        window.console.error(error);

        return 'metamask.error.unknown';
    }
};

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

export const MetaMaskButtonComponent: React.FunctionComponent<Props> = (props: Props) => {
    const {
        account,
        activate,
        connector,
        error,
    } = useWeb3ReactCore<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = React.useState<any>();
    const dispatch = useDispatch();

    const handleConnectWallet = React.useCallback(() => {
        if (account) {
            dispatch(alertPush({ message: ['metamask.success.connected'], type: 'success'}));
        } else {
            setActivatingConnector(injected);
            // tslint:disable-next-line: no-floating-promises
            activate(injected);
        }
    }, [account]);

    React.useEffect(() => {
        if (activatingConnector &&
            activatingConnector === connector &&
            account
        ) {
            dispatch(alertPush({ message: ['metamask.success.connected'], type: 'success'}));
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector, account]);

    React.useEffect(() => {
        if (!!error) {
            dispatch(alertPush({ message: [getErrorMessage(error)], type: 'error'}));
        }
    }, [!!error]);

    return (
        <div className="pg-metamask">
            <MetaMaskLogo
                className="pg-metamask__logo-icon"
                onClick={handleConnectWallet}
            />
        </div>
    );
};

export const MetaMaskButton: React.FunctionComponent<Props> = (props: Props) => (
    <Web3ProviderWrapper>
        <MetaMaskButtonComponent {...props} />
    </Web3ProviderWrapper>
);
