import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router';
import {
    openGuardModal,
    RootState,
    selectUserInfo,
    User,
} from '../../modules';


interface ReduxProps {
    user: User;
}

interface DispatchProps {
    openGuardModal: typeof openGuardModal;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class ProfileApiKeysLiteComponent extends React.Component<Props> {
    public t = (key: string) => {
        return this.props.intl.formatMessage({id: key});
    };

    public render() {
        const { user } = this.props;

        return (
            <div className="pg-profile-page__api-keys">
                <div className="pg-profile-page-header">
                    <div className="pg-profile-page__api-keys__header">
                        <h3>{this.t('page.body.profile.apiKeys.header')}</h3>
                        {user.otp && (
                            <span
                                className="pg-profile-page__pull-right"
                                onClick={this.handleCreateKeyClick}
                            >
                                {this.t('page.body.profile.apiKeys.header.create')}
                            </span>)}
                    </div>
                </div>

                {!user.otp && (
                    <p className="pg-profile-page__label pg-profile-page__text-center">
                        {this.t('page.body.profile.apiKeys.noOtp')}
                    </p>
                )}

                {user.otp && (
                    <div className="pg-profile-page__label pg-profile-page__text-center">
                        {this.t('page.body.profile.apiKeys.noKeys')}
                    </div>
                )}
            </div>

        );
    }

    private handleCreateKeyClick = () => this.props.openGuardModal();
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        openGuardModal: () => dispatch(openGuardModal()),
    });

const connected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileApiKeysLiteComponent));
const ProfileApiKeysLite = withRouter(connected);

export {
    ProfileApiKeysLite,
};
