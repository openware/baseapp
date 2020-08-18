import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { IntlProps } from '../../index';
import { Modal } from '../../mobile/components/Modal';

interface OwnProps {
    handleToggleFailModal: () => void;
    history: History;
    isMobileDevice?: boolean;
}

type Props = OwnProps & IntlProps & RouteProps;

class BeneficiariesFailAddModalComponent extends React.Component<Props> {
    public render() {
        return (
            this.props.isMobileDevice ?
                <Modal
                    isOpen
                    onClose={this.props.handleToggleFailModal}
                    title={this.translate('page.body.wallets.beneficiaries.failAddModal.content')}>
                    {this.renderContent()}
                </Modal> : this.renderContent()
        );
    }

    public ModalHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    {this.translate('page.body.wallets.beneficiaries.failAddModal.header')}
                    <span
                        className="pg-profile-page__close pg-profile-page__pull-right"
                        onClick={this.props.handleToggleFailModal}
                    />
                </div>
            </div>
        </div>
    );

    public ModalBody = () => (
        <div className="cr-email-form__form-content">
            <span className="cr-email-form__form-content__info">
                {this.translate('page.body.wallets.beneficiaries.failAddModal.content')}
            </span>
            <div className="cr-email-form__button-wrapper">
                <Link to="/confirm">
                    <Button
                        size="lg"
                        variant="primary"
                        className="cr-email-form__button-wrapper__btn"
                    >
                        {this.translate('page.body.wallets.beneficiaries.failAddModal.button')}
                    </Button>
                </Link>
            </div>
        </div>
    );

    private renderContent = () => {
        const className = classnames('beneficiaries-fail-modal', {
            'cr-modal': !this.props.isMobileDevice,
        });

        return (
            <div className={className}>
                <div className="cr-email-form">
                    <this.ModalHeader/>
                    <this.ModalBody/>
                </div>
            </div>
        );
    };

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

// tslint:disable-next-line:no-any
export const BeneficiariesFailAddModal = withRouter(injectIntl(BeneficiariesFailAddModalComponent) as any) as any;
