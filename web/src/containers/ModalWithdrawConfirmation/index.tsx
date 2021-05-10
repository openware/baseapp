import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import { Decimal, Modal, CodeVerification } from '../../components';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { Modal as MobileModal } from '../../mobile/components/Modal';
import { TipIcon } from '../../assets/images/TipIcon';
import {
    Beneficiary,
    BeneficiaryBank,
} from 'src/modules';

interface ModalWithdrawConfirmationProps {
    beneficiary: Beneficiary;
    amount: string;
    total: string;
    fee: string;
    otpCode: string;
    type: "fiat" | "coin";
    currency: string;
    rid: string;
    isMobileDevice?: boolean;
    show: boolean;
    precision: number;
    onSubmit: () => void;
    onDismiss: () => void;
    handleChangeCodeValue: (value: string) => void;
}

interface State {
    isOpenTip: boolean;
}

type Props = ModalWithdrawConfirmationProps & IntlProps;

class ModalWithdraw extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isOpenTip: false,
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };
    public render() {
        const { show, isMobileDevice } = this.props;

        return isMobileDevice ?
            <MobileModal title={this.renderHeader()} onClose={this.props.onDismiss} isOpen={this.props.show}>
                <div>
                    {this.renderBody()}
                </div>
                <div>
                    {this.renderFooter()}
                </div>
            </MobileModal> : (
            <Modal
                show={show}
                header={this.renderHeader()}
                content={this.renderBody()}
                footer={this.renderFooter()}
            />
        );
    }

    private renderHeader = () => {
        const { currency } = this.props;
        const formattedCurrency = currency.toUpperCase();

        return (
            <div className="pg-exchange-modal-submit-header">
                {this.translate('page.body.wallets.tabs.withdraw.modal.title')}
                {` ${formattedCurrency}`}
                <CloseIcon onClick={() => this.props.onDismiss()} className="pg-exchange-modal-submit-header-close"/>
            </div>
        );
    };

    private renderBody = () => {
        const { amount, currency, precision, rid, total, fee, beneficiary } = this.props;
        const { isOpenTip } = this.state;

        const formattedCurrency = currency.toUpperCase();

        return (
            <div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
                <div className="modal-body__withdraw-confirm-address">
                    <span>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.withdrawTo')}
                    </span>
                    <div className="modal-body__withdraw-confirm-address-row bold-text">
                        {rid}
                        <span className="tip-icon" onMouseOver={this.handleToggleTip} onMouseOut={this.handleToggleTip}><TipIcon/></span>
                    </div>
                </div>
                {isOpenTip && this.renderDropdownTipFiat(beneficiary)}
                <div className="modal-body__withdraw-confirm-inline">
                    <span>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.amount')}
                    </span>
                    <p><span className="bold-text">{Decimal.format(amount, precision, ',')}</span> {formattedCurrency}</p>
                </div>
                <div className="modal-body__withdraw-confirm-inline">
                    <span>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.fee')}
                    </span>
                    <p>
                        <span className="bold-text">{Decimal.format(fee, precision, ',')}</span> {formattedCurrency}
                    </p>
                </div>
                <div className="modal-body__withdraw-confirm-block">
                    <div>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.total')}
                    </div>
                    <div className="bold-text">
                        {Decimal.format(total, precision, ',')} {formattedCurrency}
                    </div>
                </div>
            </div>
        );
    };

    private renderDropdownTipFiatDescription = (description: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.description')}</span>
                <span className="tip__content__block__value">{description}</span>
            </div>
        );
    };

    private renderDropdownTipFiat = (currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="modal-body__withdraw-confirm__tip tip fiat-tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && this.renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.account')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}</span>
                        </div>
                    </div>
                </div>
            );
        }
    };

    private handleToggleTip = () => {
        this.setState(prevState => ({
            isOpenTip: !prevState.isOpenTip,
        }));
    };

    private handleEnterClick = e => {
        if (e.key === 'Enter' && this.props.otpCode.length >= 6) {
            e.preventDefault();
            this.props.onSubmit();
        }
    };

    private renderFooter = () => {
        const { isMobileDevice, otpCode } = this.props;

        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
                <div className="modal-footer__withdraw-confirm-title">
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message')}
                </div>
                <div className="modal-footer__withdraw-confirm-form">
                    <div className="modal-footer__withdraw-confirm-form-row">
                        <fieldset className="modal-footer__withdraw-confirm-form-input">
                            <CodeVerification
                                code={otpCode}
                                onChange={e => this.props.handleChangeCodeValue(e)}
                                onSubmit={e => this.handleEnterClick(e)}
                                codeLength={6}
                                type="text"
                                placeholder="X"
                                inputMode="decimal"
                                showPaste2FA={true}
                                isMobile={isMobileDevice}
                            />
                        </fieldset>
                        <Button
                            className="modal-footer__withdraw-confirm-form-button"
                            block={true}
                            disabled={otpCode.length < 6}
                            onClick={this.props.onSubmit}
                            size="lg"
                            variant="primary"
                        >
                            {this.translate('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };
}

// tslint:disable-next-line
export const ModalWithdrawConfirmation = injectIntl(ModalWithdraw) as any;
