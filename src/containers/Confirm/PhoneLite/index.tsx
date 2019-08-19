import { Button } from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';


interface ReduxProps {
    openModal?: () => void;
}

type Props = ReduxProps  & InjectedIntlProps;

class PhoneLiteComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const phoneNumberFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': false,
        });

        const confirmationCodeFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': false,
        });

        return (
            <div className="pg-confirm__content-phone">
                <h2 className="pg-confirm__content-phone-head">{this.translate('page.body.kyc.phone.head')}</h2>
                <div className="pg-confirm__content-phone-col">
                    <div className="pg-confirm__content-phone-col-text">
                        1. {this.translate('page.body.kyc.phone.enterPhone')}
                    </div>
                    <fieldset className={phoneNumberFocusedClass}>
                        <legend>{this.translate('page.body.kyc.phone.phoneNumber')}</legend>
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                            value={''}
                            onClick={this.props.openModal}
                            onChange={this.props.openModal}
                        />
                        <button
                            className={'' ? 'pg-confirm__content-phone-col-content-send' : 'pg-confirm__content-phone-col-content-send--disabled'}
                            type="button"
                            onClick={this.props.openModal}
                        >
                            {this.translate('page.body.kyc.phone.send')}
                        </button>
                    </fieldset>
                </div>
                <div className="pg-confirm__content-phone-col">
                    <div className="pg-confirm__content-phone-col-text">
                        2. {this.translate('page.body.kyc.phone.enterCode')}
                    </div>
                    <fieldset className={confirmationCodeFocusedClass}>
                        <legend>{this.translate('page.body.kyc.phone.code')}</legend>
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.code')}
                            value={''}
                            onClick={this.props.openModal}
                            onChange={this.props.openModal}
                        />
                    </fieldset>
                </div>
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.props.openModal}
                    />
                </div>
            </div>
        );
    }
}

// tslint:disable-next-line
export const PhoneLite = injectIntl(PhoneLiteComponent as any);
