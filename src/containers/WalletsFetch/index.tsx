import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { balancesFetchInterval } from '../../api';
import { walletsFetch } from '../../modules/user/wallets';

interface DispatchProps {
    walletsFetch: typeof walletsFetch;
}

export type WalletsFetchProps = DispatchProps;

export class WalletsFetchComponent extends React.Component<WalletsFetchProps> {
    private walletsFetchInterval;

    public componentDidMount(): void {
        this.walletsFetchInterval = setInterval(() => {
            this.props.walletsFetch();
        }, parseFloat(balancesFetchInterval()));
    }

    public componentWillUnmount(): void {
        clearInterval(this.walletsFetchInterval);
    }

    public render() {
        return null;
    }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    walletsFetch: () => dispatch(walletsFetch()),
});

// tslint:disable-next-line no-any
export const WalletsFetch = withRouter(connect(null, mapDispatchToProps)(WalletsFetchComponent) as any);
