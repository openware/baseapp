import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { setDocumentTitle } from '../../helpers';

type Props = RouterProps & InjectedIntlProps;

class Restricted extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        const isRestricted = localStorage.getItem('restricted');
        if (!isRestricted) {
            props.history.replace('/');
        }
    }

    public componentDidMount() {
        setDocumentTitle('404');
    }

    public render() {
        return(
            <div className="pg-restricted-screen">
                <div className="pg-restricted-screen__title">
                    404
                </div>
                <div className="pg-restricted-screen__content">
                    {this.translate('page.body.restricted')}
                </div>
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const RestrictedScreen = compose(
    injectIntl,
    withRouter,
)(Restricted) as React.ComponentClass;
