import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useApiKeysFetch } from '../../../hooks';
import {
    ApiKeyDataInterface,
    apiKeyUpdateFetch,
    selectUserInfo,
} from '../../../modules';
import { selectApiKeys } from '../../../modules/user/apiKeys/selectors';
import { ApiKeysItem, Subheader, TwoFactorModal } from '../../components';

const ProfileApiKeysMobileScreenComponent: React.FC = () => {
    const [itemToUpdate, setItemToUpdate] = React.useState<ApiKeyDataInterface | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const apiKeys = useSelector(selectApiKeys);
    const user = useSelector(selectUserInfo);
    useApiKeysFetch();

    const handleUpdateKey = item => {
        setItemToUpdate(item);
        setShowModal(state => !state);
    };

    const handleToggle2FA = (code2FA, shouldFetch) => {
        if (shouldFetch && itemToUpdate) {
            const payload = {
                totp_code: code2FA,
                apiKey: {
                    ...itemToUpdate,
                    state: itemToUpdate.state === 'active' ? 'disabled' : 'active',
                },
            };
            dispatch(apiKeyUpdateFetch(payload));
        }

        setItemToUpdate(null);
        setShowModal(false);
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
                <TwoFactorModal
                    showModal={showModal}
                    handleToggle2FA={handleToggle2FA}
                />
            </div>
        </React.Fragment>
    );
};

export const ProfileApiKeysMobileScreen = React.memo(ProfileApiKeysMobileScreenComponent);
