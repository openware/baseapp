import { Pagination, Table } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate } from '../../helpers';
import {
    getUserActivity,
    RootState,
    selectTotalNumber,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityLoading,
    selectUserActivityNextPageExists,
    selectUserActivityPageCount,
    UserActivityDataInterface,
} from '../../modules';

interface ReduxProps {
    loading: boolean;
    total: number;
    page: number;
    pageCount: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    userActivity: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

const paginationLimit = 25;

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class ProfileAccountActivityComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.getUserActivity({ page: 0, limit: paginationLimit });
    }

    public render() {
        const { loading, userActivity } = this.props;
        const emptyMsg = this.props.intl.formatMessage({id: 'page.noDataToShow'});

        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page-header">
                    <h3><FormattedMessage id="page.body.profile.header.accountActivity" /></h3>
                </div>
                <div className={`pg-history-elem ${userActivity.length ? '' : 'pg-history-empty'}`}>
                    {userActivity.length ? this.renderContent() : null}
                    {!userActivity.length && !loading ? <p className="pg-history-elem__empty">{emptyMsg}</p> : null}
                </div>
            </div>
        );
    }

    public renderContent = () => {
        const { total, firstElemIndex, lastElemIndex, page, nextPageExists, userActivity } = this.props;
        return (
            <React.Fragment>
                <Table
                    header={this.getHeaders()}
                    data={this.getActivityData(userActivity)}
                />
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    total={total}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

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
                localeDate(item.created_at, 'fullDate'),
                this.getResultOfUserAction(item.action),
                this.renderResult(this.props.intl.formatMessage({ id: `page.body.profile.content.result.${item.result}`})),
                item.user_ip,
                item.user_agent,
            ];
        });
    }

    private renderResult(result: string) {
        const className = classnames({
            'pg-profile-page__activity-result-succeed': result === this.props.intl.formatMessage({id: 'page.body.profile.content.result.succeed'}),
            'pg-profile-page__activity-result-failed': result === this.props.intl.formatMessage({id: 'page.body.profile.content.result.failed'}),
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

    private onClickPrevPage = () => {
        const { page } = this.props;
        this.props.getUserActivity({ page: Number(page) - 1, limit: paginationLimit });
    };

    private onClickNextPage = () => {
        const { page } = this.props;
        this.props.getUserActivity({ page: Number(page) + 1, limit: paginationLimit });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
    loading: selectUserActivityLoading(state),
    total: selectTotalNumber(state),
    page: selectUserActivityCurrentPage(state),
    pageCount: selectUserActivityPageCount(state, paginationLimit),
    firstElemIndex: selectUserActivityFirstElemIndex(state, paginationLimit),
    lastElemIndex: selectUserActivityLastElemIndex(state, paginationLimit),
    nextPageExists: selectUserActivityNextPageExists(state, paginationLimit),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getUserActivity: params => dispatch(getUserActivity(params)),
    });

export const ProfileAccountActivity = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAccountActivityComponent));
