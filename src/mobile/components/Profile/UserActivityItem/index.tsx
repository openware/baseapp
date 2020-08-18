import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { getUserAgent, localeDate } from '../../../../helpers';

const UserActivityItemComponent = props => {
    const { index, item } = props;
    const intl = useIntl();

    const getResultOfUserAction = (value: string) => {
        switch (value) {
            case 'login':
                return intl.formatMessage({id: 'page.body.profile.content.action.login'});
            case 'logout':
                return intl.formatMessage({id: 'page.body.profile.content.action.logout'});
            case 'request QR code for 2FA':
                return intl.formatMessage({id: 'page.body.profile.content.action.request2fa'});
            case 'enable 2FA':
                return intl.formatMessage({id: 'page.body.profile.content.action.enable2fa'});
            case 'login::2fa':
                return intl.formatMessage({id: 'page.body.profile.content.action.login.2fa'});
            case 'request password reset':
                return intl.formatMessage({id: 'page.body.profile.content.action.requestPasswordReset'});
            case 'password reset':
                return intl.formatMessage({id: 'page.body.profile.content.action.passwordReset'});
            default:
                return value;
        }
    };

    const userAgent = getUserAgent(item.user_agent);
    const resultOfUserAction = getResultOfUserAction(item.action);
    const [itemDate, itemTime] = localeDate(item.created_at, 'fullDate').split(' ');

    const resultStatusClassName = classnames({
        'color-green': item.result === 'succeed',
        'color-red':  ['failed', 'denied'].includes(item.result),
    });

    return (
        <div key={index} className="pg-mobile-profile-account-activity-item">
            <div className="pg-mobile-profile-account-activity-item__row">
                <div className="pg-mobile-profile-account-activity-item__row__block">
                    <span>{userAgent}</span>
                </div>
                <div className="pg-mobile-profile-account-activity-item__row__block">
                    <span>{itemDate}</span>
                    <span>{itemTime}</span>
                </div>
            </div>
            <div className="pg-mobile-profile-account-activity-item__row">
                <div className="pg-mobile-profile-account-activity-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.accountActivity.action' })}</span>
                    <span className="pg-mobile-profile-account-activity-item__row__block__value">
                        {resultOfUserAction}
                    </span>
                </div>
                <div className="pg-mobile-profile-account-activity-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.accountActivity.ip' })}</span>
                    <span className="pg-mobile-profile-account-activity-item__row__block__value">
                        {item.user_ip}
                    </span>
                </div>
                <div className="pg-mobile-profile-account-activity-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.accountActivity.result' })}</span>
                    <div className="pg-mobile-profile-account-activity-item__row__block__value">
                        <span className={resultStatusClassName}>
                            {item.result}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const UserActivityItem = React.memo(UserActivityItemComponent);
