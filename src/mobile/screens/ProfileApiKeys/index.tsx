import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useApiKeysFetch } from '../../../hooks';
import { apiKeyUpdateFetch, selectUserInfo } from '../../../modules';
import { selectApiKeys } from '../../../modules/user/apiKeys/selectors';
import { ApiKeysItem, Subheader } from '../../components';

const ProfileApiKeysMobileScreenComponent = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const apiKeys = useSelector(selectApiKeys);
    const user = useSelector(selectUserInfo);
    useApiKeysFetch();

    const handleUpdateKey = item => {
        const payload = {
            totp_code: '',
            apiKey: {
                ...item,
                state: item.state === 'active' ? 'disabled' : 'active',
            },
        };
        dispatch(apiKeyUpdateFetch(payload));
    };

    return (
        <React.Fragment>
          <Subheader
            title={intl.formatMessage({ id: 'page.mobile.profile.apiKeys.title' })}
            backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
            onGoBack={() => history.push('/profile')}
          />
            <div className="pg-mobile-profile-api-keys-screen">
                <div className="pg-mobile-profile-api-keys-screen__list">
                    {user.otp && apiKeys.length ? (
                        apiKeys.map((item, index) => (
                            <ApiKeysItem
                                key={index}
                                item={item}
                                handleUpdateKey={handleUpdateKey}
                            />
                        ))
                    ) : (
                        <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export const ProfileApiKeysMobileScreen = React.memo(ProfileApiKeysMobileScreenComponent);
