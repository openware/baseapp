import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import { Decimal, Modal, CodeVerification } from '../../components';
import { HugeCloseIcon } from '../../assets/images/CloseIcon';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { Modal as MobileModal } from '../../mobile/components/Modal';
import {
    Beneficiary,
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
    protocol?: string;
    isMobileDevice?: boolean;
    show: boolean;
    precision: number;
    onSubmit: () => void;
    onDismiss: () => void;
    handleChangeCodeValue: (value: string) => void;
}

type Props = ModalWithdrawConfirmationProps & IntlProps;

class ModalWithdraw extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public componentWillUnmount() {
        document.getElementById('root')?.style.setProperty('height', 'auto');
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.show !== this.props.show) {
            if (!prevProps.show && this.props.show) {
                document.getElementById('root')?.style.setProperty('height', '100%');
            }
    
            if (prevProps.show && !this.props.show) {
                document.getElementById('root')?.style.setProperty('height', 'auto');
            }
        }
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
                fullView={true}
                show={show}
                header={this.renderHeader()}
                content={this.renderBody()}
                footer={this.renderFooter()}
            />
        );
    }

    private renderHeader = () => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        <LogoIcon />
                        <HugeCloseIcon className="cr-email-form__option-inner-close" onClick={this.props.onDismiss}/>
                    </div>
                </div>
            </div>
        );
    };

    private renderBody = () => {
        const { amount, currency, precision, rid, total, fee, beneficiary, protocol } = this.props;
        const formattedCurrency = currency.toUpperCase();

        return (
            <div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
                <div className="modal-body__withdraw-confirm-title">
                    {this.translate('page.body.wallets.tabs.withdraw.modal.title')}
                    {` ${formattedCurrency}`}
                </div>
                <div className="modal-body__withdraw-confirm-address">
                    <span>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.withdrawTo')}
                    </span>
                    <div className="modal-body__withdraw-confirm-address-row bold-text">
                        {rid}
                    </div>
                </div>
                <div className="modal-body__withdraw-confirm-name">
                    <span>
                        {this.translate('page.body.wallets.tabs.withdraw.modal.name')}
                    </span>
                    <div className="modal-body__withdraw-confirm-address-row bold-text">
                        {beneficiary.name}
                    </div>
                </div>
                {beneficiary.protocol || protocol ?
                    <div className="modal-body__withdraw-confirm-name">
                        <span>
                            {this.translate('page.body.wallets.withdraw.blockchain.network')}
                        </span>
                        <div className="modal-body__withdraw-confirm-address-row bold-text">
                            {beneficiary.protocol?.toUpperCase() || protocol?.toUpperCase()}
                        </div>
                    </div>
                : null}
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
                <div className="modal-footer__withdraw-confirm-verification">{this.translate('page.body.wallets.tabs.withdraw.modal.verification')}</div>
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
                                message={this.translate('page.body.wallets.tabs.withdraw.modal.message')}
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
