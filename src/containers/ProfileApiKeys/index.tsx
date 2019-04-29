import { Button, Checkbox, Table } from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router';
import { CopyableTextField, CustomInput } from '../../components';
import { localeDate } from '../../helpers/localeDate';

import {
    alertPush,
    ApiKeyCreateFetch,
    apiKeyCreateFetch, ApiKeyDataInterface,
    ApiKeyDeleteFetch,
    apiKeyDeleteFetch,
    ApiKeys2FAModal,
    apiKeys2FAModal, apiKeysFetch,
    ApiKeyStateModal, ApiKeyUpdateFetch,
    apiKeyUpdateFetch,
    RootState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysModal,
} from '../../modules/user/apiKeys/selectors';

interface ReduxProps {
    apiKeys: ApiKeyDataInterface[] | [];
    dataLoaded: boolean;
    modal: ApiKeyStateModal;
    user: User;
}

interface DispatchProps {
    toggleApiKeys2FAModal: typeof apiKeys2FAModal;
    getApiKeys: typeof apiKeysFetch;
    createApiKey: typeof apiKeyCreateFetch;
    updateApiKey: typeof apiKeyUpdateFetch;
    deleteApiKey: typeof apiKeyDeleteFetch;
    fetchSuccess: typeof alertPush;
}

interface ProfileApiKeysState {
    otpCode: string;
    codeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
// tslint:disable jsx-no-lambda
class ProfileApiKeysComponent extends React.Component<Props, ProfileApiKeysState> {
    public state = {
        otpCode: '',
        codeFocused: false,
    };

    public t = (key: string) => {
        return this.props.intl.formatMessage({id: key});
    };

    public copy = (id: string) => {
        const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

        if (copyText) {
            copyText.select();

            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    };

    public render() {
        const {user, dataLoaded, apiKeys} = this.props;
        const modal = this.props.modal.active ? (
            <div className="cr-modal">
                <div className="cr-email-form">
                    {this.renderModalHeader()}
                    {this.renderModalBody()}
                </div>
            </div>
        ) : null;

        return (
            <div className="pg-profile-page__api-keys">
                <div className="pg-profile-page-header">
                    <div className="pg-profile-page__api-keys__header">
                        <h3>{this.t('page.body.profile.apiKeys.header')}</h3>
                        {user.otp && dataLoaded && (
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

                {user.otp && !dataLoaded && (
                    <div className="pg-profile-page__text-center">
                        <div className="cr-button" onClick={this.handleGetKeysClick}>
                            <span>Show</span>
                        </div>
                    </div>
                )}

                {user.otp && dataLoaded && !apiKeys.length && (
                    <div className="pg-profile-page__label pg-profile-page__text-center">
                        {this.t('page.body.profile.apiKeys.noKeys')}
                    </div>
                )}

                {user.otp && dataLoaded && apiKeys.length > 0 && (
                    <Table
                        header={this.getTableHeaders()}
                        data={apiKeys && apiKeys.length ? this.getTableData(apiKeys) : [[]]}
                    />
                )}

                {modal}
            </div>

        );
    }

    private getTableHeaders = () => {
        return [
            this.t('page.body.profile.apiKeys.table.header.kid'),
            this.t('page.body.profile.apiKeys.table.header.algorithm'),
            this.t('page.body.profile.apiKeys.table.header.state'),
            '',
            this.t('page.body.profile.apiKeys.table.header.created'),
            this.t('page.body.profile.apiKeys.table.header.updated'),
            '',
        ];
    };

    private getTableData(apiKeysData: ApiKeyDataInterface[]) {
        return apiKeysData.map(item => (
            [
                item.kid,
                item.algorithm,
                (
                    <div className="pg-profile-page__api-keys__state">
                        <span
                            className={item.state === 'active' ? 'pg-profile-page__api-keys__state__active'
                                : 'pg-profile-page__api-keys__state__disabled'}
                        >
                            {item.state}
                        </span>
                    </div>
                ),
                (
                    <div className="pg-profile-page__api-keys__state-checkbox">
                        <Checkbox
                            checked={item.state === 'active'}
                            className={'pg-profile-page__switch'}
                            onChange={() => this.handleToggleStateKeyClick(item)}
                            label={''}
                            slider={true}
                        />
                    </div>
                )
                ,
                localeDate(item.created_at, 'fullDate'),
                localeDate(item.updated_at, 'fullDate'),
                (
                    <span
                        className="pg-profile-page__close"
                        key={item.kid}
                        onClick={() => this.handleDeleteKeyClick(item)}
                    />
                ),
            ]
        ));
    }

    private renderModalHeader = () => {
        const headerText = this.props.modal.action === 'createSuccess' ? this.t('page.body.profile.apiKeys.modal.created_header')
            : this.t('page.body.profile.apiKeys.modal.header');
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {headerText}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={this.handleHide2FAModal}
                        />
                    </div>
                </div>
            </div>
        );
    };

    private renderModalBody = () => {
        const {otpCode, codeFocused} = this.state;
        const emailGroupClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': codeFocused,
        });
        let body;
        let button;
        switch (this.props.modal.action) {
            case 'getKeys':
                button =
                    (
                        <Button
                            label={this.t('page.body.profile.apiKeys.modal.btn.show')}
                            onClick={this.handleGetKeys}
                            disabled={!otpCode.match(/.{6}/g)}
                            className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                        />
                    );
                break;
            case 'createKey':
                button =
                    (
                        <Button
                            label={this.t('page.body.profile.apiKeys.modal.btn.create')}
                            onClick={this.handleCreateKey}
                            className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                        />
                    );
                break;
            case 'createSuccess':
                button =
                    (
                        <Button
                            label={this.t('page.body.profile.apiKeys.modal.btn.create')}
                            onClick={this.handleCreateSuccess}
                            className={'cr-email-form__button'}
                        />
                    );
                body = (
                    <div className="cr-success-create">
                        <div className="pg-copyable-text__section">
                            <fieldset onClick={() => this.handleCopy('access-key-id', 'access')}>
                                <legend><span>{this.t('page.body.profile.apiKeys.modal.access_key')}</span></legend>
                                <CopyableTextField
                                  className="pg-copyable-text-field__input"
                                  fieldId={'access-key-id'}
                                  value={this.props.modal.apiKey.kid}
                                  copyButtonText={this.t('page.body.profile.content.copyLink')}
                                />
                            </fieldset>
                        </div>
                        <div className="secret-section">
                            <span className="secret-sign">&#9888;</span>
                            <p className="secret-warning">
                                <span>{this.t('page.body.profile.apiKeys.modal.secret_key')}</span>
                                <br/>
                                {this.t('page.body.profile.apiKeys.modal.secret_key_info')}
                                <span> {this.t('page.body.profile.apiKeys.modal.secret_key_store')}</span>
                            </p>
                        </div>
                        <div className="pg-copyable-text__section">
                            <fieldset onClick={() => this.handleCopy('secret-key-id', 'secret')}>
                                <legend><span>{this.t('page.body.profile.apiKeys.modal.secret_key')}</span></legend>
                                <CopyableTextField
                                  className="pg-copyable-text-field__input"
                                  fieldId={'secret_key-id'}
                                  value={this.props.modal.apiKey.secret}
                                  copyButtonText={this.t('page.body.profile.content.copyLink')}
                                />
                            </fieldset>
                        </div>
                        <p className="note-section">
                            <span>{this.t('page.body.profile.apiKeys.modal.note')} </span>
                            <br/>
                            {this.t('page.body.profile.apiKeys.modal.note_content')}
                        </p>
                        <div className="button-confirmation">
                            {button}
                        </div>
                    </div>
                );
                break;
            case 'updateKey':
                button =
                    this.props.modal.apiKey.state === 'active' ?
                        (
                            <Button
                                label={this.t('page.body.profile.apiKeys.modal.btn.disabled')}
                                onClick={this.handleUpdateKey}
                                className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                            />
                        )
                        :
                        (
                            <Button
                                label={this.t('page.body.profile.apiKeys.modal.btn.activate')}
                                onClick={this.handleUpdateKey}
                                className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                            />
                        );
                break;
            case 'deleteKey':
                button =
                    (
                        <Button
                            label={this.t('page.body.profile.apiKeys.modal.btn.delete')}
                            onClick={this.handleDeleteKey}
                            className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                        />
                    );
                break;
            default:
                break;
        }
        body = !body ? (
            <div className="cr-email-form__form-content">
                <div className="cr-email-form__header">
                    {this.t('page.body.profile.apiKeys.modal.title')}
                </div>
                <div className={emailGroupClass}>
                    <CustomInput
                        type="number"
                        label={this.t('page.body.profile.apiKeys.modal.label')}
                        placeholder={this.t('page.body.profile.apiKeys.modal.placeholder')}
                        defaultLabel="2FA code"
                        handleChangeInput={this.handleOtpCodeChange}
                        inputValue={otpCode || ''}
                        handleFocusInput={this.handleChangeFocusField}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                        onKeyPress={this.handleEnterPress}
                    />
                </div>
                <div className="cr-email-form__button-wrapper">
                    {button}
                </div>
            </div>
        ) : body;
        return (
            <React.Fragment>
                {body}
            </React.Fragment>
        );
    };

    private handleChangeFocusField = () => {
        this.setState(prev => ({
            codeFocused: !prev.codeFocused,
        }));
    }

    private handleHide2FAModal = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: false};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private renderOnClick = () => {
        switch (this.props.modal.action) {
            case 'getKeys':
                this.handleGetKeys();
                break;
            case 'createKey':
                this.handleCreateKey();
                break;
            case 'createSuccess':
                this.handleCreateSuccess();
                break;
            case 'updateKey':
                this.handleUpdateKey();
                break;
            case 'deleteKey':
                this.handleDeleteKey();
                break;
            default:
                break;
        }
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.renderOnClick();
        }
    };

    private handleGetKeysClick = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'getKeys'};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleGetKeys = () => {
        const payload: ApiKeyCreateFetch['payload'] = {totp_code: this.state.otpCode};
        this.props.getApiKeys(payload);
        this.setState({otpCode: ''});
    };

    private handleCreateKeyClick = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'createKey'};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleCreateKey = () => {
        const payload: ApiKeyCreateFetch['payload'] = {totp_code: this.state.otpCode};
        this.props.createApiKey(payload);
        this.setState({otpCode: ''});
    };

    private handleCreateSuccess = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: false};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleToggleStateKeyClick = apiKey => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'updateKey', apiKey};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleUpdateKey = () => {
        const apiKey: ApiKeyDataInterface = {...this.props.modal.apiKey};
        apiKey.state = apiKey.state === 'active' ? 'disabled' : 'active';
        const payload: ApiKeyUpdateFetch['payload'] = {totp_code: this.state.otpCode, apiKey: apiKey};
        this.props.updateApiKey(payload);
        this.setState({otpCode: ''});
    };

    private handleCopy = (id: string, type: string) => {
        this.copy(id);
        this.props.fetchSuccess({ message: [`success.api_keys.copied.${type}`], type: 'success'});
    };

    private handleDeleteKeyClick = apiKey => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'deleteKey', apiKey};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleDeleteKey = () => {
        const payload: ApiKeyDeleteFetch['payload'] = {kid: this.props.modal.apiKey.kid, totp_code: this.state.otpCode};
        this.props.deleteApiKey(payload);
        this.setState({otpCode: ''});
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    apiKeys: selectApiKeys(state),
    dataLoaded: selectApiKeysDataLoaded(state),
    modal: selectApiKeysModal(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        toggleApiKeys2FAModal: (payload: ApiKeys2FAModal['payload']) => dispatch(apiKeys2FAModal(payload)),
        getApiKeys: payload => dispatch(apiKeysFetch(payload)),
        createApiKey: payload => dispatch(apiKeyCreateFetch(payload)),
        updateApiKey: payload => dispatch(apiKeyUpdateFetch(payload)),
        deleteApiKey: payload => dispatch(apiKeyDeleteFetch(payload)),
        fetchSuccess: payload => dispatch(alertPush(payload)),
    });

const connected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileApiKeysComponent));
const ProfileApiKeys = withRouter(connected);

export {
    ProfileApiKeys,
};
