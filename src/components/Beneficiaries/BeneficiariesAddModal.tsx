import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { CustomInput } from '../../components';
import {
    beneficiariesCreate,
    BeneficiaryBank,
    RootState,
    selectBeneficiariesCreateError,
    selectBeneficiariesCreateSuccess,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    beneficiariesAddError?: CommonError;
    beneficiariesAddSuccess: boolean;
}

interface DispatchProps {
    createAddress: typeof beneficiariesCreate;
}

interface OwnProps {
    currency: string;
    type: 'fiat' | 'coin';
    handleToggleAddAddressModal: () => void;
    handleToggleConfirmationModal: () => void;
}

interface CoinState {
    coinAddress: string;
    coinBeneficiaryName: string;
    coinDescription: string;

    coinAddressFocused: boolean;
    coinBeneficiaryNameFocused: boolean;
    coinDescriptionFocused: boolean;
}

interface FiatState {
    fiatName: string;
    fiatFullName: string;
    fiatAccountNumber: string;
    fiatBankName: string;
    fiatBankSwiftCode: string;
    fiatIntermediaryBankName: string;
    fiatIntermediaryBankSwiftCode: string;

    fiatNameFocused: boolean;
    fiatFullNameFocused: boolean;
    fiatAccountNumberFocused: boolean;
    fiatBankNameFocused: boolean;
    fiatBankSwiftCodeFocused: boolean;
    fiatIntermediaryBankNameFocused: boolean;
    fiatIntermediaryBankSwiftCodeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;
type State = CoinState & FiatState;

const defaultState = {
    coinAddress: '',
    coinBeneficiaryName: '',
    coinDescription: '',
    coinAddressFocused: false,
    coinBeneficiaryNameFocused: false,
    coinDescriptionFocused: false,

    fiatName: '',
    fiatFullName: '',
    fiatAccountNumber: '',
    fiatBankName: '',
    fiatBankSwiftCode: '',
    fiatIntermediaryBankName: '',
    fiatIntermediaryBankSwiftCode: '',
    fiatNameFocused: false,
    fiatFullNameFocused: false,
    fiatAccountNumberFocused: false,
    fiatBankNameFocused: false,
    fiatBankSwiftCodeFocused: false,
    fiatIntermediaryBankNameFocused: false,
    fiatIntermediaryBankSwiftCodeFocused: false,
};

// tslint:disable:jsx-no-lambda
class BeneficiariesAddModalComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ...defaultState,
        };
    }

    public componentWillReceiveProps(nextProps: Props) {
        const {
            beneficiariesAddError,
            beneficiariesAddSuccess,
        } = this.props;

        if ((nextProps.beneficiariesAddError && !beneficiariesAddError) ||
            (nextProps.beneficiariesAddSuccess && !beneficiariesAddSuccess)) {
            this.props.handleToggleAddAddressModal();
            this.handleClearModalsInputs();
        }

        if (nextProps.beneficiariesAddSuccess && !beneficiariesAddSuccess) {
            this.props.handleToggleConfirmationModal();
        }
    }

    public render() {
        const { type } = this.props;

        const addModalClass = classnames('cr-modal beneficiaries-add-address-modal', {
            'beneficiaries-add-address-modal--coin': type === 'coin',
            'beneficiaries-add-address-modal--fiat': type === 'fiat',
        });

        return (
            <div className={addModalClass}>
                <div className="cr-email-form">
                    {this.renderAddAddressModalHeader()}
                    {type === 'coin' ? this.renderAddAddressModalCryptoBody() : this.renderAddAddressModalFiatBody()}
                </div>
            </div>
        );
    }

    private renderAddAddressModalHeader = () => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {this.translate('page.body.wallets.beneficiaries.addAddressModal.header')}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={this.handleClickToggleAddAddressModal(true)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    private renderAddAddressModalBodyItem = (field: string, optional?: boolean) => {
        const focusedClass = classnames('cr-email-form__group', {
            'cr-email-form__group--focused': this.state[`${field}Focused`],
            'cr-email-form__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <CustomInput
                    type="text"
                    label={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
                    placeholder={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
                    defaultLabel={field}
                    handleChangeInput={value => this.handleChangeFieldValue(field, value)}
                    inputValue={this.state[field]}
                    handleFocusInput={() => this.handleChangeFieldFocus(`${field}Focused`)}
                    classNameLabel="cr-email-form__label"
                    classNameInput="cr-email-form__input"
                    autoFocus={true}
                />
            </div>
        );
    }

    private renderAddAddressModalCryptoBody = () => {
        const {
            coinAddress,
            coinBeneficiaryName,
        } = this.state;

        const isDisabled = !coinAddress || !coinBeneficiaryName;

        return (
            <div className="cr-email-form__form-content">
                {this.renderAddAddressModalBodyItem('coinAddress')}
                {this.renderAddAddressModalBodyItem('coinBeneficiaryName')}
                {this.renderAddAddressModalBodyItem('coinDescription', true)}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={this.handleSubmitAddAddressCoinModal}
                        size="lg"
                        variant="primary"
                    >
                        {this.translate('page.body.wallets.beneficiaries.addAddressModal.body.button')}
                    </Button>
                </div>
            </div>
        );
    };

    private renderAddAddressModalFiatBody = () => {
        const {
            fiatName,
            fiatFullName,
            fiatAccountNumber,
            fiatBankName,
        } = this.state;

        const isDisabled = !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName;

        return (
            <div className="cr-email-form__form-content">
                {this.renderAddAddressModalBodyItem('fiatName')}
                {this.renderAddAddressModalBodyItem('fiatFullName')}
                {this.renderAddAddressModalBodyItem('fiatAccountNumber')}
                {this.renderAddAddressModalBodyItem('fiatBankName')}
                {this.renderAddAddressModalBodyItem('fiatBankSwiftCode', true)}
                {this.renderAddAddressModalBodyItem('fiatIntermediaryBankName', true)}
                {this.renderAddAddressModalBodyItem('fiatIntermediaryBankSwiftCode', true)}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={this.handleSubmitAddAddressFiatModal}
                        size="lg"
                        variant="primary"
                    >
                        {this.translate('page.body.wallets.beneficiaries.addAddressModal.body.button')}
                    </Button>
                </div>
            </div>
        );
    };

    private handleChangeFieldValue = (key: string, value: string) => {
        // @ts-ignore
        this.setState({
            [key]: value,
        });
    }

    private handleChangeFieldFocus = (key: string) => {
        // @ts-ignore
        this.setState(prev => ({
            [key]: !prev[key],
        }));
    };

    private handleClearModalsInputs = () => {
        this.setState({
            ...defaultState,
        });
    }

    private handleSubmitAddAddressCoinModal = () => {
        const { currency } = this.props;
        const {
            coinAddress,
            coinBeneficiaryName,
            coinDescription,
        } = this.state;

        // tslint:disable-next-line:no-any
        let payload: any = {
            currency: currency || '',
            name: coinBeneficiaryName,
            data: JSON.stringify({
                address: coinAddress,
            }),
        };

        if (coinDescription) {
            payload = {
                ...payload,
                description: coinDescription,
            };
        }

        this.props.createAddress(payload);
    }

    private handleSubmitAddAddressFiatModal = () => {
        const { currency } = this.props;
        const {
            fiatName,
            fiatFullName,
            fiatAccountNumber,
            fiatBankName,
            fiatBankSwiftCode,
            fiatIntermediaryBankName,
            fiatIntermediaryBankSwiftCode,
        } = this.state;

        let data: BeneficiaryBank = {
            full_name: fiatFullName,
            account_number: fiatAccountNumber,
            bank_name: fiatBankName,
        };

        if (fiatBankSwiftCode) {
            data = {
                ...data,
                bank_swift_code: fiatBankSwiftCode,
            };
        }

        if (fiatIntermediaryBankName) {
            data = {
                ...data,
                intermediary_bank_name: fiatIntermediaryBankName,
            };
        }

        if (fiatIntermediaryBankSwiftCode) {
            data = {
                ...data,
                intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode,
            };
        }

        const payload = {
            currency: currency || '',
            name: fiatName,
            data: JSON.stringify(data),
        };

        this.props.createAddress(payload);
    }

    private handleClickToggleAddAddressModal = (clear?: boolean) => () => {
        this.props.handleToggleAddAddressModal();

        if (clear) {
            this.handleClearModalsInputs();
        }
    }

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    beneficiariesAddError: selectBeneficiariesCreateError(state),
    beneficiariesAddSuccess: selectBeneficiariesCreateSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    createAddress: payload => dispatch(beneficiariesCreate(payload)),
});

// tslint:disable-next-line:no-any
export const BeneficiariesAddModal = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BeneficiariesAddModalComponent) as any);
