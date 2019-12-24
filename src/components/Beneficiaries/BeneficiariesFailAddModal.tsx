import * as React from 'react';
import { History } from 'history';
import { RouteProps, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface OwnProps {
    handleToggleFailModal: () => void;
    history: History;
}

type Props = OwnProps & InjectedIntlProps & RouteProps;

class BeneficiariesFailAddModalComponent extends React.Component<Props> {
    public render() {
        return (
            <div className="cr-modal beneficiaries-fail-modal">
                <div className="cr-email-form">
                    {this.renderModalHeader()}
                    {this.renderModalBody()}
                </div>
            </div>
        );
    }

    private renderModalHeader = () => {
        return (
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
    };


    private renderModalBody = () => {
        return (
            <div className="cr-email-form__form-content">
                <span className="cr-email-form__form-content__info">
                    {this.translate('page.body.wallets.beneficiaries.failAddModal.content')}
                </span>
                <div className="cr-email-form__button-wrapper">
                    <a href="/confirm">
                        <Button
                            size="lg"
                            variant="primary"
                            className="cr-email-form__button-wrapper__btn"
                        >
                            {this.translate('page.body.wallets.beneficiaries.failAddModal.button')}
                        </Button>
                    </a>
                </div>
            </div>
        );
    };

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

// tslint:disable-next-line:no-any
export const BeneficiariesFailAddModal = withRouter(injectIntl(BeneficiariesFailAddModalComponent)) as any;
