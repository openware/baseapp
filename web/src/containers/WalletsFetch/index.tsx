import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { balancesFetchInterval, isFinexEnabled } from '../../api';
import { walletsFetch } from '../../modules/user/wallets';

interface DispatchProps {
    walletsFetch: typeof walletsFetch;
}

export type WalletsFetchProps = DispatchProps;

export class WalletsFetchComponent extends React.Component<WalletsFetchProps> {
    private walletsFetchInterval;

    public componentDidMount(): void {
        if (!isFinexEnabled()) {
            this.walletsFetchInterval = setInterval(() => {
                this.props.walletsFetch();
            }, parseFloat(balancesFetchInterval()));
        }
    }

    public componentWillUnmount(): void {
        if (!isFinexEnabled()) {
            clearInterval(this.walletsFetchInterval);
        }
    }

    public render() {
        return null;
    }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    walletsFetch: () => dispatch(walletsFetch()),
});

export const WalletsFetch = compose(
    withRouter,
    connect(null, mapDispatchToProps),
)(WalletsFetchComponent) as React.ComponentClass;
