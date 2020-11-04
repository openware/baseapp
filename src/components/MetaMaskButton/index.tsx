import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { MetaMaskLogo } from '../../assets/images/MetaMaskLogo';
import { Web3ProviderWrapper } from '../../helpers';
import { alertPush, sendError } from '../../modules';

interface OwnProps {
    depositAddress: string;
}

type Props = OwnProps;

export const injected = new InjectedConnector({ supportedChainIds: [1] });

export const MetaMaskButtonComponent: React.FunctionComponent<Props> = () => {
    const { account, activate, connector, error } = useWeb3ReactCore<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = React.useState<any>();
    const dispatch = useDispatch();

    const handleConnectWallet = React.useCallback(() => {
        if (account) {
            dispatch(alertPush({ message: ['metamask.success.connected'], type: 'success' }));
        } else {
            setActivatingConnector(injected);
            // tslint:disable-next-line: no-floating-promises
            activate(injected);
        }
    }, [account, activate, dispatch]);

    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector && account) {
            dispatch(alertPush({ message: ['metamask.success.connected'], type: 'success' }));
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector, account, dispatch]);

    React.useEffect(() => {
        if (!!error) {
            dispatch(
                sendError({
                    error,
                    processingType: 'alert',
                    extraOptions: {
                        type: 'METAMASK_HANDLE_ERROR',
                    },
                })
            );
        }
    }, [!!error, dispatch]);

    return (
        <div className="pg-metamask">
            <MetaMaskLogo className="pg-metamask__logo-icon" onClick={handleConnectWallet} />
        </div>
    );
};

export const MetaMaskButton: React.FunctionComponent<Props> = (props: Props) => (
    <Web3ProviderWrapper>
        <MetaMaskButtonComponent {...props} />
    </Web3ProviderWrapper>
);
