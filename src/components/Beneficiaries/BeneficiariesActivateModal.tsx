import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { CustomInput } from '../../components';
import {
    beneficiariesActivate,
    Beneficiary,
    RootState,
    selectBeneficiariesActivateError,
    selectBeneficiariesActivateSuccess,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    beneficiariesActivateError?: CommonError;
    beneficiariesActivateSuccess: boolean;
}

interface DispatchProps {
    activateAddress: typeof beneficiariesActivate;
}

interface OwnProps {
    beneficiariesAddData: Beneficiary;
    handleToggleConfirmationModal: () => void;
}

interface State {
    confirmationModalCode: string;
    confirmationModalCodeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

const defaultState = {
    confirmationModalCode: '',
    confirmationModalCodeFocused: false,
};

// tslint:disable:jsx-no-lambda
class BeneficiariesActivateModalComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ...defaultState,
        };
    }

    public componentWillReceiveProps(nextProps: Props) {
        const {
            beneficiariesActivateError,
            beneficiariesActivateSuccess,
        } = this.props;

        if ((nextProps.beneficiariesActivateError && !beneficiariesActivateError) ||
            (nextProps.beneficiariesActivateSuccess && !beneficiariesActivateSuccess)) {
            this.props.handleToggleConfirmationModal();
            this.handleClearModalsInputs();
        }
    }


    public render() {
        return (
            <div className="cr-modal beneficiaries-confirmation-modal">
                <div className="cr-email-form">
                    {this.renderConfirmationModalHeader()}
                    {this.renderConfirmationModalBody()}
                </div>
            </div>
        );
    }

    private renderConfirmationModalHeader = () => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {this.translate('page.body.wallets.beneficiaries.confirmationModal.header')}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={this.handleClickToggleConfirmationModal(true)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    private renderConfirmationModalBodyItem = (field: string, optional?: boolean) => {
        const focusedClass = classnames('cr-email-form__group', {
            'cr-email-form__group--focused': this.state[`${field}Focused`],
            'cr-email-form__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <CustomInput
                    type="text"
                    label={this.translate(`page.body.wallets.beneficiaries.confirmationModal.body.${field}`)}
                    placeholder={this.translate(`page.body.wallets.beneficiaries.confirmationModal.body.${field}`)}
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

    private renderConfirmationModalBody = () => {
        const { confirmationModalCode } = this.state;

        const isDisabled = !confirmationModalCode;

        return (
            <div className="cr-email-form__form-content">
                <div className="confirmation-modal__content">
                    <img alt="content-icon" className="confirmation-modal__content__icon" src={require('../../assets/images/LetterIcon.svg')}/>
                    <span className="confirmation-modal__content__text">{this.translate('page.body.wallets.beneficiaries.confirmationModal.body.text')}</span>
                </div>
                {this.renderConfirmationModalBodyItem('confirmationModalCode')}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={this.handleSubmitConfirmationModal}
                        size="lg"
                        variant="primary"
                    >
                        {this.translate('page.body.wallets.beneficiaries.confirmationModal.body.button')}
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

    private handleSubmitConfirmationModal = () => {
        const { beneficiariesAddData } = this.props;
        const { confirmationModalCode } = this.state;

        if (beneficiariesAddData) {
            const payload = {
                pin: confirmationModalCode,
                id: beneficiariesAddData.id,
            };

            this.props.activateAddress(payload);
        }
    }

    private handleClickToggleConfirmationModal = (clear?: boolean) => () => {
        this.props.handleToggleConfirmationModal();

        if (clear) {
            this.handleClearModalsInputs();
        }
    }

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    beneficiariesActivateError: selectBeneficiariesActivateError(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    activateAddress: payload => dispatch(beneficiariesActivate(payload)),
});

// tslint:disable-next-line:no-any
export const BeneficiariesActivateModal = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BeneficiariesActivateModalComponent) as any);
