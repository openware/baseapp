import { Table } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeFullDate } from '../../helpers';
import {
    getUserActivity,
    RootState,
    selectUserActivity,
    UserActivityDataInterface,
} from '../../modules';

interface ReduxProps {
    userActivity?: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class ProfileAccountActivityComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.getUserActivity();
    }

    public render() {
        const { userActivity } = this.props;
        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page-header">
                    <h3><FormattedMessage id="page.body.profile.header.accountActivity" /></h3>
                </div>
                <Table
                    header={this.getHeaders()}
                    data={userActivity ? this.getActivityData(userActivity) : [['', '', 'There is no date to show']]}
                />
            </div>
        );
    }

    private getHeaders = () => {
        return [
            this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.date'}),
            this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.action'}),
            this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.result'}),
            this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.addressip'}),
            this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.userAgent'}),
        ];
    };

    private getActivityData(userData: UserActivityDataInterface[]) {
        return userData.map(item => {
            return [
                localeFullDate(item.created_at),
                this.getResultOfUserAction(item.action),
                this.renderResult(this.props.intl.formatMessage({ id: `page.body.profile.content.result.${item.result}`})),
                item.user_ip,
                item.user_agent,
            ];
        });
    }

    private renderResult(result: string) {
        const className = classnames({
            'pg-profile-page__activity-result-succeed': result === 'Succeed',
            'pg-profile-page__activity-result-failed': result === 'Failed',
        });
        return <span className={className}>{result}</span>;
    }

    private getResultOfUserAction = (value: string) => {
        switch (value) {
            case 'login':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login'});
            case 'logout':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.logout'});
            case 'request QR code for 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.request2fa'});
            case 'enable 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.enable2fa'});
            case 'login::2fa':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login.2fa'});
            case 'request password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.requestPasswordReset'});
            case 'password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.passwordReset'});
            default:
                return value;
        }
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getUserActivity: () => dispatch(getUserActivity()),
    });

const ProfileAccountActivity = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAccountActivityComponent));

export {
    ProfileAccountActivity,
};
