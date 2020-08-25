import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useApiKeysFetch } from '../../../hooks';
import {
    apiKeyCreateFetch,
    ApiKeyDataInterface,
    apiKeyDeleteFetch,
    apiKeyUpdateFetch,
    selectUserInfo,
} from '../../../modules';
import { selectApiKeys } from '../../../modules/user/apiKeys/selectors';
import { AddIcon } from '../../assets/images/AddIcon';
import { ApiKeysItem, Subheader, TwoFactorModal } from '../../components';

const ProfileApiKeysMobileScreenComponent: React.FC = () => {
    const [itemToUpdate, setItemToUpdate] = React.useState<ApiKeyDataInterface | undefined>();
    const [currentAction, setCurrentAction] = React.useState('');
    const [show2FAModal, setShow2FAModal] = React.useState(false);
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const apiKeys = useSelector(selectApiKeys);
    const user = useSelector(selectUserInfo);
    useApiKeysFetch();

    const handleCreateApiKey = (code2FA, shouldFetch) => {
        if (shouldFetch) {
            const payload = {
                totp_code: code2FA,
            };
            dispatch(apiKeyCreateFetch(payload));
        }
    };

    const handleUpdateApiKey = (code2FA, shouldFetch) => {
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
    };

    const handleDeleteApiKey = (code2FA, shouldFetch) => {
        if (shouldFetch && itemToUpdate) {
            const payload = {
                totp_code: code2FA,
                kid: itemToUpdate.kid,
            };
            dispatch(apiKeyDeleteFetch(payload));
        }
    };

    const handleTriggerAction = (code2FA, shouldFetch) => {
        switch (currentAction) {
            case 'create':
                handleCreateApiKey(code2FA, shouldFetch);
                break;
            case 'update':
                handleUpdateApiKey(code2FA, shouldFetch);
                break;
            case 'delete':
                handleDeleteApiKey(code2FA, shouldFetch);
                break;
            default:
                break;
        }

        setShow2FAModal(false);
        setItemToUpdate(undefined);
        setCurrentAction('');
    };

    const handleSetApiKeyProcess = (actionToSet, item?: ApiKeyDataInterface ) => {
        setShow2FAModal(state => !state);

        switch (actionToSet) {
            case 'create':
                setCurrentAction('create');
                break;
            case 'update':
                setItemToUpdate(item);
                setCurrentAction('update');
                break;
            case 'delete':
                setItemToUpdate(item);
                setCurrentAction('delete');
                break;
            default:
                break;
        }
    };

    return (
        <React.Fragment>
          <Subheader
            title={intl.formatMessage({ id: 'page.mobile.profile.apiKeys.title' })}
            backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
            onGoBack={() => history.push('/profile')}
          />
            <div className="pg-mobile-profile-api-keys-screen">
                {user.otp ? (
                    <div
                        className="pg-mobile-profile-api-keys-screen__create"
                        onClick={() => handleSetApiKeyProcess('create')}
                    >
                        <AddIcon />
                    </div>
                ) : null}
                <div className="pg-mobile-profile-api-keys-screen__list">
                    {user.otp && apiKeys.length ? (
                        apiKeys.map((apiKey, index) => (
                            <ApiKeysItem
                                key={index}
                                item={apiKey}
                                handleUpdateKey={item => handleSetApiKeyProcess('update', item)}
                                handleDeleteKey={item => handleSetApiKeyProcess('delete', item)}
                            />
                        ))
                    ) : (
                        <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
                    )}
                </div>
                <TwoFactorModal
                    showModal={show2FAModal}
                    handleToggle2FA={handleTriggerAction}
                />
            </div>
        </React.Fragment>
    );
};

export const ProfileApiKeysMobileScreen = React.memo(ProfileApiKeysMobileScreenComponent);
