import { Button } from '@openware/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { selectUserInfo, User } from '../../modules';
import { CommonError } from '../../modules/types';
import {
    selectTiersData,
    selectTiersDisabled,
    selectTiersError,
    Tier,
    tiersFetch,
} from '../../modules/user/profile';

interface ReduxProps {
    user: User;
    tier: Tier;
    tiersDisabled: boolean;
    error?: CommonError;
}

interface DispatchProps {
    tiers: typeof tiersFetch;
}

type Props = ReduxProps & DispatchProps;

class ProfileTiersComponent extends React.Component<Props> {
    public componentWillReceiveProps(next: Props) {
        const currentUID = this.props.user.uid;
        const isUserLoaded = !!currentUID || currentUID.length > 0;

        if (next.user.uid && !isUserLoaded) {
            this.props.tiers({
                uid: next.user.uid,
                currency: 'btc',
            });
        }
    }

    public render() {
        const {
            tier,
            tiersDisabled,
            error,
        } = this.props;

        if (tiersDisabled) {
            return null;
        }

        return (
            <div className="pg-profile-page__box pg-profile-page__right-col__token">
                <div className="pg-profile-page__box-header">
                    <h3>
                        <span className="pg-profile-page__text-purple">Cryptobase token</span> holder incentives
                    </h3>
                </div>
                <div className="pg-profile-page__row pg-profile-page__pb-gap-6">
                    <h1 className="pg-profile-page__text-purple">
                        {tier.min_holding}
                        <span className="pg-profile-page__currency">Cryptobase</span>
                    </h1>
                </div>
                <div className="pg-profile-page__row">
                    {error ? this.renderError(error.message) : this.renderTier(tier)}
                </div>
                <div className="pg-profile-page__row">
                    <div className="pg-profile-page__col">
                        <label>Use Cryptobase to pay trading fee</label>
                    </div>
                    <div className="pg-profile-page__col">
                        <Button
                            className="pg-profile-page__btn-secondary"
                            onClick={this.handleEnablePayFees}
                            label="Off"
                        />
                        <div className="pg-profile-page__vertical-line"/>
                        <Button
                            className="pg-profile-page__btn-secondary pg-profile-page__btn-secondary__active"
                            onClick={this.handleEnablePayFees}
                            label="Enable"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleEnablePayFees = () => {
        // todo: implement
    }

    private renderError(message) {
        return <span className="pg-profile-page__error">{message}</span>;
    }

    private renderTier(tier) {
        return (
            <div className="pg-profile-page-tiers">
                <p className="pg-profile-page-tiers__detail">
                    <span className="pg-profile-page-tiers__detail-data">{tier.color}</span>
                    <span className="pg-profile-page-tiers__detail-title">
                        Cryptobase Tier grant you the following incentives
                    </span>
                </p>
                <p className="pg-profile-page-tiers__detail">
                    <span className="pg-profile-page-tiers__detail-data">{`${tier.fee_discount}%`}</span>
                    <span className="pg-profile-page-tiers__detail-title">Discount on trading fee</span>
                </p>
                <p className="pg-profile-page-tiers__detail">
                    <span className="pg-profile-page-tiers__detail-data">20</span>
                    <span className="pg-profile-page-tiers__detail-title">Token survey points</span>
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: selectUserInfo(state),
    tier: selectTiersData(state),
    error: selectTiersError(state),
    tiersDisabled: selectTiersDisabled(state),
});

const mapDispatchToProps = dispatch => ({
    tiers: ({ uid, currency }) => dispatch(tiersFetch({ uid, currency })),
});

const ProfileTiers = connect(mapStateToProps, mapDispatchToProps)(ProfileTiersComponent);

export {
    ProfileTiers,
};
