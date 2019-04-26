import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { setDocumentTitle } from '../../helpers';

type Props = InjectedIntlProps;

class LockScreenComponent extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Oops!');
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        return (
            <div className="pg-lock-page">
                <div className="pg-lock-page-wrapper">
                    <div className="pg-lock-page-body">
                        <div className="pg-lock-page-heading">
                            <img src={require(`../../assets/images/openwareLogo.svg`)}/>
                            <h1>{this.translate('page.body.lock.oops')}</h1>
                        </div>
                        <p>{this.translate('page.body.lock.expired')}</p>

                        <a href="http://openware.com">
                            {this.translate('page.body.lock.visit')} <span>Openware.com</span>
                        </a>
                    </div>
                </div>
            </div>

        );
    }
}

export const LockScreen = injectIntl(LockScreenComponent);
